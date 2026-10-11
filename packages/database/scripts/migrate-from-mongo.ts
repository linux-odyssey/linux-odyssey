/**
 * One-shot migration of the legacy Mongo data into Postgres.
 *
 *   MONGO_URL=... DATABASE_URL=... bun run scripts/migrate-from-mongo.ts [--dry-run] [--force]
 *
 * - Stop the server before running; this is a snapshot copy, not a sync.
 * - Everything runs in ONE Postgres transaction, so a failure leaves Postgres untouched
 *   and the script can simply be re-run.
 * - Refuses to run if any target table is non-empty, unless --force is given
 *   (--force does not delete anything; it only skips the check).
 * - New ids are assigned here (sequential), so relations can be rewired from ObjectIds.
 *   The id sequences are advanced afterwards.
 * - Rows that cannot be migrated (orphans, unknown providers) are written to
 *   migration-skipped.json and counted in the summary.
 */
import 'dotenv/config'
import { writeFileSync } from 'node:fs'
import { Temporal } from 'temporal-polyfill'
import {
  connectDB,
  User,
  UserProfile,
  Session,
  Command,
  LoginAttempt,
} from '@odyssey/models'
import { db } from '../src/prisma/db'

const DRY_RUN = process.argv.includes('--dry-run')
const FORCE = process.argv.includes('--force')
const BATCH_SIZE = 1000

const LOGIN_METHODS = ['password', 'google', 'github'] as const
type LoginMethod = (typeof LOGIN_METHODS)[number]
const isLoginMethod = (v: string): v is LoginMethod =>
  (LOGIN_METHODS as readonly string[]).includes(v)

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]

const skipped: {
  table: string
  reason: string
  id?: string
  detail?: unknown
}[] = []
const stats: Record<
  string,
  { source: number; inserted: number; skipped: number }
> = {}

function track(table: string) {
  return (stats[table] ??= { source: 0, inserted: 0, skipped: 0 })
}

function skip(table: string, reason: string, id?: unknown, detail?: unknown) {
  track(table).skipped++
  skipped.push({
    table,
    reason,
    id: id === undefined ? undefined : String(id),
    detail,
  })
}

const instant = (d: Date) => Temporal.Instant.fromEpochMilliseconds(d.getTime())
const instantOrNull = (d?: Date | null) => (d ? instant(d) : null)

// Postgres text cannot hold NUL bytes, which some captured terminal output contains.
let nulStripped = 0
function text(v: string): string
function text(v: string | null | undefined): string | null
function text(v: string | null | undefined) {
  if (v == null) return null
  if (!v.includes('\0')) return v
  nulStripped++
  return v.replaceAll('\0', '')
}

// Mongoose subdocuments carry _id; the Postgres graph column stores the bare tree.
interface GraphNode {
  path: string
  type: string
  discovered: boolean
  children?: GraphNode[]
}
function cleanGraph(node: any): GraphNode {
  const out: GraphNode = {
    path: node?.path ?? '/',
    // legacy sessions used 'folder' for directories
    type: node?.type === 'file' ? 'file' : 'directory',
    discovered: node?.discovered ?? false,
  }
  if (node?.children?.length) out.children = node.children.map(cleanGraph)
  return out
}

// A lean Mongoose Map comes back as a plain object, a hydrated one as a Map.
const entries = <T>(m: Map<string, T> | Record<string, T> | undefined) =>
  m instanceof Map ? [...m.entries()] : Object.entries(m ?? {})

async function insert(tx: Tx, table: string, plan: unknown, count: number) {
  if (DRY_RUN || count === 0) {
    track(table).inserted += count
    return
  }
  const { affectedRows } = await tx.execute(plan as never)
  track(table).inserted += Number(affectedRows)
}

async function* batches<T>(cursor: AsyncIterable<T>, size: number) {
  let buf: T[] = []
  for await (const item of cursor) {
    buf.push(item)
    if (buf.length >= size) {
      yield buf
      buf = []
    }
  }
  if (buf.length) yield buf
}

async function migrate(tx: Tx) {
  const t = tx.sql.public
  const userIds = new Map<string, bigint>()
  const userIdsByUsername = new Map<string, bigint>()
  const sessionIds = new Map<string, bigint>()
  const seenEmails = new Set<string>()
  const seenOAuth = new Set<string>()
  let nextUserId = 1n
  let nextSessionId = 1n
  let nextCommandId = 1n
  let nextAttemptId = 1n

  // --- User + UserLoginMethod
  for await (const users of batches(
    User.find().sort({ _id: 1 }).lean().cursor(),
    BATCH_SIZE
  )) {
    const userRows: any[] = []
    const methodRows: any[] = []
    for (const u of users) {
      track('User').source++
      const email = u.email.trim().toLowerCase()
      if (seenEmails.has(email)) {
        throw new Error(
          `Duplicate email after lowercasing: ${email} (user ${u._id}). Resolve it in Mongo first.`
        )
      }
      seenEmails.add(email)

      const id = nextUserId++
      userIds.set(String(u._id), id)
      userIdsByUsername.set(u.username, id)
      userRows.push({
        id,
        email,
        username: u.username,
        name: null,
        createdAt: instant(u.createdAt),
        updatedAt: instant(u.updatedAt),
        isGuest: u.isGuest ?? false,
      })

      if (u.hashedPassword) {
        methodRows.push({
          userId: id,
          type: 'password',
          hashedPassword: u.hashedPassword,
          oauthId: null,
          displayName: null,
          createdAt: instant(u.createdAt),
          updatedAt: instant(u.updatedAt),
        })
      }
      for (const [key, login] of entries(u.socialLogins)) {
        const provider = (login.provider ?? key).toLowerCase()
        if (!isLoginMethod(provider) || provider === 'password') {
          skip('UserLoginMethod', 'unknown provider', u._id, { provider })
          continue
        }
        const dedupe = `${provider}:${login.id}`
        if (seenOAuth.has(dedupe)) {
          skip('UserLoginMethod', 'duplicate (type, oauthId)', u._id, {
            provider,
            oauthId: login.id,
          })
          continue
        }
        seenOAuth.add(dedupe)
        methodRows.push({
          userId: id,
          type: provider,
          hashedPassword: null,
          oauthId: login.id,
          displayName: login.displayName ?? null,
          createdAt: instant(u.createdAt),
          updatedAt: instant(u.updatedAt),
        })
      }
    }
    await insert(tx, 'User', t.User.insert(userRows).build(), userRows.length)
    track('UserLoginMethod').source += methodRows.length
    await insert(
      tx,
      'UserLoginMethod',
      t.UserLoginMethod.insert(methodRows).build(),
      methodRows.length
    )
  }

  // --- UserProgress (UserProfile.progress map, flattened)
  for await (const profiles of batches(
    UserProfile.find().lean().cursor(),
    BATCH_SIZE
  )) {
    const rows: any[] = []
    for (const p of profiles) {
      const userId = userIds.get(String(p.user))
      const items = entries(p.progress)
      track('UserProgress').source += items.length
      if (userId === undefined) {
        for (const [quest] of items)
          skip('UserProgress', 'user not found', p.user, { quest })
        continue
      }
      for (const [key, prog] of items) {
        rows.push({
          userId,
          quest: prog.quest ?? key,
          startedAt: instant(prog.startedAt),
          // `completed` is no longer stored: finishedAt IS NOT NULL means completed.
          finishedAt: prog.completed
            ? instantOrNull(prog.finishedAt ?? (p as any).updatedAt)
            : null,
        })
      }
    }
    await insert(
      tx,
      'UserProgress',
      t.UserProgress.insert(rows).build(),
      rows.length
    )
  }

  // --- Session
  for await (const sessions of batches(
    Session.find().sort({ _id: 1 }).lean().cursor(),
    BATCH_SIZE
  )) {
    const rows: any[] = []
    for (const s of sessions) {
      track('Session').source++
      const userId = userIds.get(String(s.user))
      if (userId === undefined) {
        skip('Session', 'user not found', s._id, { user: String(s.user) })
        continue
      }
      const id = nextSessionId++
      sessionIds.set(String(s._id), id)
      rows.push({
        id,
        userId,
        quest: s.quest,
        // sessions created before localization have no locale; they were zh-TW
        locale: s.locale ?? 'zh-TW',
        containerId: s.containerId ?? null,
        containerName: s.containerName ?? null,
        status: s.status,
        createdAt: instant(s.createdAt),
        lastActivityAt: instant(s.lastActivityAt ?? s.updatedAt),
        finishedAt: instantOrNull(s.finishedAt),
        completedEvents: s.completedEvents ?? [],
        graph: cleanGraph(s.graph),
      })
    }
    await insert(tx, 'Session', t.Session.insert(rows).build(), rows.length)
  }

  // --- Command (largest collection)
  for await (const commands of batches(
    Command.find().sort({ _id: 1 }).lean().cursor(),
    BATCH_SIZE
  )) {
    const rows: any[] = []
    for (const c of commands) {
      track('Command').source++
      const sessionId = sessionIds.get(String(c.session))
      if (sessionId === undefined) {
        skip('Command', 'session not found', c._id, {
          session: String(c.session),
        })
        continue
      }
      rows.push({
        id: nextCommandId++,
        sessionId,
        timestamp: instant(c.createdAt),
        pwd: text(c.pwd),
        command: text(c.command),
        output: text(c.output),
        error: text(c.error),
        stage: text(c.stage),
      })
    }
    await insert(tx, 'Command', t.Command.insert(rows).build(), rows.length)
  }

  // --- LoginAttempt (userId stays null when the username no longer exists)
  for await (const attempts of batches(
    LoginAttempt.find().sort({ _id: 1 }).lean().cursor(),
    BATCH_SIZE
  )) {
    const rows = attempts.map((a) => {
      track('LoginAttempt').source++
      return {
        id: nextAttemptId++,
        username: a.username,
        userId: userIdsByUsername.get(a.username) ?? null,
        ip: a.ip,
        loginMethod: 'password' as const, // legacy attempts were password-only
        userAgent: a.userAgent,
        time: instant(a.time ?? (a as any).createdAt),
        success: a.success,
        message: a.message ?? null,
      }
    })
    await insert(
      tx,
      'LoginAttempt',
      t.LoginAttempt.insert(rows).build(),
      rows.length
    )
  }

  // --- Advance the autoincrement sequences past the ids we assigned explicitly.
  // Identifiers can't be bind parameters, so each statement is spelled out.
  if (!DRY_RUN) {
    const { raw } = db
    const plans = [
      raw.sql`SELECT setval(pg_get_serial_sequence('"User"', 'id'), COALESCE((SELECT MAX(id) FROM "User"), 0) + 1, false)`,
      raw.sql`SELECT setval(pg_get_serial_sequence('"Session"', 'id'), COALESCE((SELECT MAX(id) FROM "Session"), 0) + 1, false)`,
      raw.sql`SELECT setval(pg_get_serial_sequence('"Command"', 'id'), COALESCE((SELECT MAX(id) FROM "Command"), 0) + 1, false)`,
      raw.sql`SELECT setval(pg_get_serial_sequence('"LoginAttempt"', 'id'), COALESCE((SELECT MAX(id) FROM "LoginAttempt"), 0) + 1, false)`,
    ]
    for (const plan of plans)
      await tx.execute(plan.affectedCount().build() as never)
  }
}

async function assertTargetEmpty() {
  const { orm } = db
  const found = await Promise.all([
    orm.public.User.first(),
    orm.public.UserLoginMethod.first(),
    orm.public.UserProgress.first(),
    orm.public.Session.first(),
    orm.public.Command.first(),
    orm.public.LoginAttempt.first(),
  ])
  if (found.some(Boolean)) {
    throw new Error(
      'Target tables are not empty. Truncate them or pass --force.'
    )
  }
}

async function main() {
  const mongoUrl = process.env['MONGO_URL']
  if (!mongoUrl) throw new Error('MONGO_URL is not set')
  const mongo = await connectDB(mongoUrl)
  console.log(
    DRY_RUN ? 'DRY RUN: nothing will be written' : 'Migrating Mongo -> Postgres'
  )

  try {
    if (!FORCE && !DRY_RUN) await assertTargetEmpty()
    await db.transaction((tx) => migrate(tx as Tx))
  } finally {
    await mongo.close()
    await db.close()
  }

  console.table(stats)
  if (nulStripped)
    console.log(`Stripped NUL bytes from ${nulStripped} command text fields`)
  writeFileSync('migration-skipped.json', JSON.stringify(skipped, null, 2))
  console.log(
    `Skipped rows written to migration-skipped.json (${skipped.length})`
  )
  for (const [table, s] of Object.entries(stats)) {
    if (!DRY_RUN && s.source !== s.inserted + s.skipped) {
      throw new Error(
        `Count mismatch for ${table}: ${s.source} != ${s.inserted} + ${s.skipped}`
      )
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

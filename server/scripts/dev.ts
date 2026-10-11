// Dev server with auto-restart. `bun --watch` only tracks imported modules,
// but quests are read from YAML at startup, so rewrite the entry file (same
// contents) whenever a quest file changes to trigger a restart. Bun ignores
// timestamp-only changes, so `touch` would not work.
import { watch, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const entry = path.join(import.meta.dir, '../src/index.ts')
const questsDir = path.join(import.meta.dir, '../../quests')

const server = Bun.spawn(['bun', '--watch', entry], {
  stdio: ['inherit', 'inherit', 'inherit'],
})

let timer: ReturnType<typeof setTimeout> | undefined
watch(questsDir, { recursive: true }, (_event, filename) => {
  if (!filename?.endsWith('.yml')) return
  clearTimeout(timer)
  timer = setTimeout(() => {
    writeFileSync(entry, readFileSync(entry))
  }, 100)
})

const stop = () => server.kill()
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
process.exit(await server.exited)

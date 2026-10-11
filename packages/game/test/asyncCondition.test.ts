import { test, expect } from 'bun:test'
import { checkFiles } from '../condition/FileMatcher.js'
import { Condition } from '../condition/Condition.js'
import { MockFileChecker } from './mockFileChecker'

test('file matcher', async () => {
  const checker = new MockFileChecker()
  expect(
    await checkFiles(checker, [
      {
        path: '/home/user/hello.txt',
        type: 'file',
        exists: true,
      },
    ])
  ).toBe(true)
  expect(
    await checkFiles(checker, [
      {
        path: '/home/user/not-exists.txt',
        type: 'file',
        exists: true,
      },
    ])
  ).toBe(false)
  expect(
    await checkFiles(checker, [
      {
        path: '/home/user/not-exists.txt',
        type: 'file',
        exists: false,
      },
    ])
  ).toBe(true)
  expect(
    await checkFiles(checker, [
      {
        path: '/home/user/Downloads',
        type: 'directory',
        exists: true,
      },
    ])
  ).toBe(true)
  expect(
    await checkFiles(checker, [
      {
        path: '/home/user/hello.txt',
        type: 'file',
        exists: true,
      },
      {
        path: '/home/user/Downloads',
        type: 'directory',
        exists: true,
      },
    ])
  ).toBe(true)
  expect(
    await checkFiles(checker, [
      {
        path: '/home/user/hello.txt',
        type: 'file',
        exists: true,
      },
      {
        path: '/home/user/not-exist.txt',
        type: 'file',
        exists: true,
      },
    ])
  ).toBe(false)
})

test('condition with file matcher', async () => {
  const checker = new MockFileChecker()
  const condition = new Condition({
    files: [
      {
        path: '/home/user/hello.txt',
        type: 'file',
        exists: true,
      },
    ],
  })
  expect(await condition.check(checker)).toBe(true)
})

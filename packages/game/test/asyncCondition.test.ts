import { test, expect } from '@jest/globals'
import { IFileExistenceChecker, IFileInput } from '../schema'
import { checkFiles } from '../condition/FileMatcher.js'
import { Condition } from '../condition/Condition.js'

export class MockFileChecker implements IFileExistenceChecker {
  private files: IFileInput[] = [
    {
      path: '/home/user/hello.txt',
      type: 'file',
    },
    {
      path: '/home/user/world.txt',
      type: 'file',
    },
    {
      path: '/home/user/Downloads',
      type: 'directory',
    },
  ]

  async exists(file: IFileInput): Promise<boolean> {
    return this.files.some((f) => f.path === file.path && f.type === file.type)
  }
}

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

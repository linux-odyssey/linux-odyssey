import { test, expect } from '@jest/globals'
import { IFileExistenceChecker, FileType, FileInput } from '../src/types.js'
import { checkFiles } from '../src/condition/FileMatcher.js'

class MockFileChecker implements IFileExistenceChecker {
  private files: FileInput[] = [
    {
      path: '/home/user/hello.txt',
      type: FileType.FILE,
    },
    {
      path: '/home/user/world.txt',
      type: FileType.FILE,
    },
    {
      path: '/home/user/Downloads',
      type: FileType.FOLDER,
    },
  ]

  async exists(file: FileInput): Promise<boolean> {
    return this.files.some((f) => f.path === file.path && f.type === file.type)
  }
}

test('file matcher', async () => {
  const checker = new MockFileChecker()
  expect(
    await checkFiles(checker, [
      {
        path: '/home/user/hello.txt',
        type: FileType.FILE,
        exists: true,
      },
    ])
  ).toBe(true)
  expect(
    await checkFiles(checker, [
      {
        path: '/home/user/not-exists.txt',
        type: FileType.FILE,
        exists: true,
      },
    ])
  ).toBe(false)
  expect(
    await checkFiles(checker, [
      {
        path: '/home/user/not-exists.txt',
        type: FileType.FILE,
        exists: false,
      },
    ])
  ).toBe(true)
  expect(
    await checkFiles(checker, [
      {
        path: '/home/user/Downloads',
        type: FileType.FOLDER,
        exists: true,
      },
    ])
  ).toBe(true)
  expect(
    await checkFiles(checker, [
      {
        path: '/home/user/hello.txt',
        type: FileType.FILE,
        exists: true,
      },
      {
        path: '/home/user/Downloads',
        type: FileType.FOLDER,
        exists: true,
      },
    ])
  ).toBe(true)
  expect(
    await checkFiles(checker, [
      {
        path: '/home/user/hello.txt',
        type: FileType.FILE,
        exists: true,
      },
      {
        path: '/home/user/not-exist.txt',
        type: FileType.FILE,
        exists: true,
      },
    ])
  ).toBe(false)
})

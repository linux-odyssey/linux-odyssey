import { describe, test, expect } from '@jest/globals'
import File from '../src/file.js'

describe('File', () => {
  let file: File
  beforeEach(() => {
    file = new File({ path: '/home/user', type: 'folder', discovered: true })
  })

  const filesToCompare = [
    {
      name: 'direct children',
      path: '/home/user/file1.txt',
      answer: true,
    },
    {
      name: 'nested children',
      path: '/home/user/folder1/file1.txt',
      answer: true,
    },
    {
      name: 'outer file',
      path: '/etc/file1.txt',
      answer: false,
    },
    {
      name: 'fake children',
      path: '/home/user2/file2.txt',
      answer: false,
    },
    {
      name: 'same',
      path: '/home/user',
      answer: true,
    },
    {
      name: 'same with trailing',
      path: '/home/user/',
      answer: true,
    },
  ]

  filesToCompare.forEach(({ name, path, answer }) => {
    test(`${name}: ${path}`, () => {
      const fileToCompare = new File({ path, type: 'file', discovered: true })
      expect(file.contains(fileToCompare)).toBe(answer)
    })
  })
})

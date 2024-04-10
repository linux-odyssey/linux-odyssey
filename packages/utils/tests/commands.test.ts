import { describe, it, expect } from '@jest/globals'
import { buildFileCheckCmd, File } from '../src/commands.js'

describe('buildFileCheckCmd function', () => {
  it('builds the file check command correctly', () => {
    const testcases: {
      input: File
      output: string[]
    }[] = [
      {
        input: { path: '/etc/passwd', type: 'file' },
        output: ['test', '-f', '/etc/passwd'],
      },
      {
        input: { path: '/etc', type: 'folder' },
        output: ['test', '-d', '/etc'],
      },
      {
        input: { path: '/tmp/socket', type: 'socket' },
        output: ['test', '-S', '/tmp/socket'],
      },
      {
        input: { path: '/tmp/link', type: 'link' },
        output: ['test', '-L', '/tmp/link'],
      },
      {
        input: { path: '/unknown', type: 'unknown' },
        output: ['test', '-e', '/unknown'],
      },
      // Add some injection tests
      {
        input: { path: '/etc/passwd;ls', type: 'file' },
        output: ['test', '-f', '/etc/passwdls'],
      },
      {
        input: { path: '/etc/passwd && ls', type: 'file' },
        output: ['test', '-f', '/etc/passwdls'],
      },
    ]

    testcases.forEach(({ input, output }) => {
      expect(buildFileCheckCmd(input)).toStrictEqual(output)
    })
  })
})

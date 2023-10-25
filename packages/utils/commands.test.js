import { buildFileCheckCmd } from './commands.js'

describe('buildFileCheckCmd function', () => {
  it('builds the file check command correctly', () => {
    const testcases = [
      {
        input: [{ path: '/etc/passwd', type: 'file', exists: true }],
        output: 'test -f /etc/passwd',
      },
      {
        input: [{ path: '/etc', type: 'folder', exists: false }],
        output: '! test -d /etc',
      },
      {
        input: [
          { path: '/etc/passwd', type: 'file', exists: true },
          { path: '/etc', type: 'folder', exists: false },
        ],
        output: 'test -f /etc/passwd && ! test -d /etc',
      },
      {
        input: [
          { path: '/tmp/socket', type: 'socket', exists: true },
          { path: '/tmp/link', type: 'link', exists: false },
        ],
        output: 'test -S /tmp/socket && ! test -L /tmp/link',
      },
      {
        input: [{ path: '/unknown', type: 'unknown', exists: true }],
        output: 'test -e /unknown',
      },
    ]

    testcases.forEach(({ input, output }) => {
      expect(buildFileCheckCmd(input)).toBe(output)
    })
  })
})

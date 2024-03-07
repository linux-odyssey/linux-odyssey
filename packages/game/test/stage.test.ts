import { test, expect } from '@jest/globals'
import { Stage } from '../src/Stage'

test('check stage condition', () => {
  const stage = new Stage({
    id: 'stage1',
    name: 'List the files using `ls`',
    condition: {
      command: 'ls',
      pwd: '/home/user',
    },
  })
  expect(
    stage.satisfies({
      command: 'ls',
      pwd: '/home/user',
    })
  ).toBe(true)
  expect(
    stage.satisfies({
      command: 'ls',
      pwd: '/home/user/Downloads',
    })
  ).toBe(false)
})

import { test, expect } from '@jest/globals'
import { Stage } from '../Stage'
import { MockFileChecker } from './asyncCondition.test'

const checker = new MockFileChecker()

test('check stage condition', async () => {
  const stage = new Stage({
    id: 'stage1',
    name: 'List the files using `ls`',
    condition: {
      command: 'ls',
      pwd: '/home/user',
    },
    requirements: [],
    response: {
      type: 'narrative',
      content: 'Narrative 1',
    },
  })
  expect(
    await stage.satisfies(
      {
        command: 'ls',
        pwd: '/home/user',
      },
      checker
    )
  ).toBe(true)
  expect(
    await stage.satisfies(
      {
        command: 'ls',
        pwd: '/home/user/Downloads',
      },
      checker
    )
  ).toBe(false)
})

test('check stage with async condition truthy', async () => {
  const stage = new Stage({
    id: 'stage1',
    name: 'Create file',
    condition: {
      files: [
        {
          path: '/home/user/hello.txt',
          type: 'file',
          exists: true,
        },
      ],
    },
    requirements: [],
    response: {
      type: 'narrative',
      content: 'Narrative 1',
    },
  })
  expect(await stage.satisfies({}, checker)).toBe(true)
})

test('check stage with async condition falsy', async () => {
  const stage = new Stage({
    id: 'stage1',
    name: 'Create file',
    condition: {
      files: [
        {
          path: '/home/user/not-exists.txt',
          type: 'file',
          exists: true,
        },
      ],
    },
    requirements: [],
    response: {
      type: 'narrative',
      content: 'Narrative 1',
    },
  })
  expect(await stage.satisfies({}, checker)).toBe(false)
})

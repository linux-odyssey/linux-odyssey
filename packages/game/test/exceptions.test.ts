import { expect, it, describe } from '@jest/globals'
import { IQuest } from '../src/schema'
import { Session } from '../src/Session'
import { MockFileChecker } from './asyncCondition.test'

const quest: IQuest = {
  id: 'quest1',
  title: 'Quest 1',
  image: 'image1',
  instruction: 'Instruction 1',
  requirements: [],
  stages: [
    {
      id: 'stage1',
      requirements: [],
      condition: {
        command: 'echo start',
      },
      exceptions: [
        {
          id: 'exception1',
          condition: {
            command: 'ls',
          },
          response: { type: 'narrative', content: 'Exception 1' },
          catchAll: false,
        },
        {
          id: 'exception2',
          condition: {},
          catchAll: true,
          response: { type: 'narrative', content: 'Exception 2' },
        },
      ],
      response: { type: 'narrative', content: 'Narrative 1' },
    },
    {
      id: 'stage2',
      requirements: ['stage1'],
      condition: {
        command: 'ls',
      },
      response: { type: 'narrative', content: 'Narrative 2' },
    },
  ],
}

describe('exceptions', () => {
  it('should return the stage exception', async () => {
    const session = new Session(
      { completedStages: [] },
      quest,
      new MockFileChecker()
    )
    expect(await session.runCommand({ command: 'ls' })).toBe('exception1')
    await session.runCommand({ command: 'echo start' })
    console.log('completed', session.completedStages)
    expect(await session.runCommand({ command: 'ls' })).toBe('stage2')
  })
})

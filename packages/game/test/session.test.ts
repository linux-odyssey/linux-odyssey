import { expect, describe, it } from '@jest/globals'
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
    {
      id: 'stage3',
      requirements: ['stage1'],
      condition: {
        command: 'mkdir hello',
      },
      response: { type: 'narrative', content: 'Narrative 3' },
    },
    {
      id: 'stage4',
      requirements: ['stage2', 'stage3'],
      condition: {
        command: 'echo finish',
      },
      response: { type: 'narrative', content: 'Narrative 4' },
    },
  ],
}

describe('Session', () => {
  it('should return active stages', () => {
    const session = new Session(
      {
        completedStages: [],
      },
      quest,
      new MockFileChecker()
    )
    expect(session.getActiveStages()).toEqual(['stage1'])

    session.complete('stage1')
    expect(session.getActiveStages()).toEqual(['stage2', 'stage3'])

    session.complete('stage2')
    expect(session.getActiveStages()).toEqual(['stage3'])

    session.complete('stage3')
    expect(session.getActiveStages()).toEqual(['stage4'])
  })

  it('should run command', async () => {
    const session = new Session(
      {
        completedStages: [],
      },
      quest,
      new MockFileChecker()
    )
    expect(await session.runCommand({ command: 'hi' })).toBeNull()
    expect(await session.runCommand({ command: 'echo start' })).toEqual(
      'stage1'
    )

    expect(await session.runCommand({ command: 'echo start' })).toBeNull()
    expect(await session.runCommand({ command: 'ls' })).toEqual('stage2')

    expect(await session.runCommand({ command: 'echo finish' })).toBeNull()

    expect(await session.runCommand({ command: 'mkdir hello' })).toEqual(
      'stage3'
    )

    expect(await session.runCommand({ command: 'echo finish' })).toEqual(
      'stage4'
    )
  })
})

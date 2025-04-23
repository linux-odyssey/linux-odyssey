import { expect, describe, it } from '@jest/globals'
import { IQuest } from '../src/schema'
import { GameSession } from '../src/Session'
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
      name: 'Stage 1',
      requirements: [],
      condition: {
        command: 'echo start',
      },
      response: { type: 'narrative', content: 'Narrative 1' },
    },
    {
      id: 'stage2',
      name: 'Stage 2',
      requirements: ['stage1'],
      condition: {
        command: 'ls',
      },
      response: { type: 'narrative', content: 'Narrative 2' },
    },
    {
      id: 'stage3',
      name: 'Stage 3',
      requirements: ['stage1'],
      condition: {
        command: 'mkdir hello',
      },
      response: { type: 'narrative', content: 'Narrative 3' },
    },
    {
      id: 'stage4',
      name: 'Stage 4',
      requirements: ['stage2', 'stage3'],
      condition: {
        command: 'echo finish',
      },
      response: { type: 'narrative', content: 'Narrative 4' },
    },
  ],
  exceptions: [
    {
      id: 'exception1',
      condition: {
        command: 'rm',
      },
      response: {
        type: 'narrative',
        content: 'Exception 1',
      },
      requirements: [],
    },
  ],
}

describe('Session', () => {
  it('should return active stages', () => {
    const session = new GameSession(
      {
        completedEvents: [],
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
    const session = new GameSession(
      {
        completedEvents: [],
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

  it('should return all responses', () => {
    const session = new GameSession(
      {
        completedEvents: ['stage1'],
      },
      quest,
      new MockFileChecker()
    )
    expect(session.getResponses()).toEqual([
      {
        type: 'narrative',
        content: 'Narrative 1',
      },
    ])

    session.complete('exception1')
    session.complete('stage2')
    expect(session.getResponses()).toEqual([
      { type: 'narrative', content: 'Narrative 1' },
      { type: 'narrative', content: 'Exception 1' },
      { type: 'narrative', content: 'Narrative 2' },
    ])
  })

  it('should return tasks', () => {
    const session = new GameSession(
      {
        completedEvents: [],
      },
      quest,
      new MockFileChecker()
    )
    expect(session.getTasks()).toEqual([
      { id: 'stage1', name: 'Stage 1', completed: false },
    ])

    session.complete('stage1')
    expect(session.getTasks()).toEqual([
      { id: 'stage1', name: 'Stage 1', completed: true },
      { id: 'stage2', name: 'Stage 2', completed: false },
      { id: 'stage3', name: 'Stage 3', completed: false },
    ])

    session.complete('stage2')
    expect(session.getTasks()).toEqual([
      { id: 'stage1', name: 'Stage 1', completed: true },
      { id: 'stage2', name: 'Stage 2', completed: true },
      { id: 'stage3', name: 'Stage 3', completed: false },
    ])

    session.complete('stage3')
    expect(session.getTasks()).toEqual([
      { id: 'stage1', name: 'Stage 1', completed: true },
      { id: 'stage2', name: 'Stage 2', completed: true },
      { id: 'stage3', name: 'Stage 3', completed: true },
      { id: 'stage4', name: 'Stage 4', completed: false },
    ])
  })
})

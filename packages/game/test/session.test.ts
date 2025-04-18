import { expect, describe, it } from '@jest/globals'
import { IQuest } from '../src/schema'
import { Session } from '../src/Session'

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
      condition: {},
      response: { type: 'narrative', content: 'Narrative 1' },
    },
    {
      id: 'stage2',
      requirements: ['stage1'],
      condition: {},
      response: { type: 'narrative', content: 'Narrative 2' },
    },
    {
      id: 'stage3',
      requirements: ['stage1'],
      condition: {},
      response: { type: 'narrative', content: 'Narrative 3' },
    },
    {
      id: 'stage4',
      requirements: ['stage2', 'stage3'],
      condition: {},
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
      quest
    )
    expect(session.getActiveStages()).toEqual(['stage1'])

    session.complete('stage1')
    expect(session.getActiveStages()).toEqual(['stage2', 'stage3'])

    session.complete('stage2')
    expect(session.getActiveStages()).toEqual(['stage3'])

    session.complete('stage3')
    expect(session.getActiveStages()).toEqual(['stage4'])
  })
})

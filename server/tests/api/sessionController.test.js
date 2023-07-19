import jest from 'jest'
import * as sessionController from '../../src/api/controllers/sessionController'
import Session from '../../src/models/session'

jest.mock('../../src/models/session')

describe('Session Controller', () => {
  let mockReq
  let mockRes

  beforeEach(() => {
    mockReq = {
      user: { id: 'userid' },
      body: {},
      params: {},
    }
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
    }
  })

  test('getSessionList returns a list of sessions', async () => {
    Session.find.mockResolvedValue(['session1', 'session2'])
    await sessionController.getSessionList(mockReq, mockRes)
    expect(mockRes.json).toHaveBeenCalledWith(['session1', 'session2'])
  })

  test('createSession creates a new session', async () => {
    mockReq.body.exercise_id = 'exerciseid'
    const mockSession = { user: 'userid', exercise: 'exerciseid' }
    Session.mockReturnValue(mockSession)
    mockSession.save = jest.fn().mockResolvedValue('newsess')
    await sessionController.createSession(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(201)
    expect(mockRes.json).toHaveBeenCalledWith('newsess')
  })

  test('getSessionById returns the correct session', async () => {
    mockReq.params.session_id = 'sessionid'
    const mockSession = { user: 'userid', _id: 'sessionid' }
    Session.findOne.mockResolvedValue(mockSession)
    await sessionController.getSessionById(mockReq, mockRes)
    expect(mockRes.json).toHaveBeenCalledWith(mockSession)
  })

  test('deleteSessionById deletes a session', async () => {
    mockReq.params.session_id = 'sessionid'
    const mockSession = { user: 'userid', _id: 'sessionid' }
    Session.findOneAndDelete.mockResolvedValue(mockSession)
    await sessionController.deleteSessionById(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(204)
    expect(mockRes.end).toHaveBeenCalled()
  })
})

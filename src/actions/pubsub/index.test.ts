import * as actions from './'
import * as types from './types'

describe('pubsub action creators', () => {
  it('should create an action to request connection', () => {
    const expectedResult = {
      type: types.REQUEST_CONNECTION,
      payload: {}
    }
    expect(actions.requestConnection()).toEqual(expectedResult)
  })

  it('creates action for received message', () => {
    const expectedResult = {
      type: types.WS_RECEIVE,
      payload: {
        topic: 'testTopic',
        message: 'testMessage'
      }
    }
    expect(actions.receiveMessage('testTopic', 'testMessage')).toEqual(expectedResult)
  })

  it('should create action to establish WS connection', () => {
    const expectedResult = {
      type: types.WS_CONNECT,
      payload: {
        accessKeyId: 'testAccessKey',
        secretKey: 'testSecretKey',
        sessionToken: 'testSessionToken',
        topics: ['topic1', 'topic2']
      }
    }
    expect(actions.connectToWS({
      accessKeyId: 'testAccessKey',
      secretKey: 'testSecretKey',
      sessionToken: 'testSessionToken',
      topics: ['topic1', 'topic2']
    })).toEqual(expectedResult)
  })

  it('should create an action to disconnect WS', () => {
    const expectedResult = {
      type: types.WS_DISCONNECT,
      payload: {}
    }
    expect(actions.disconnectWS()).toEqual(expectedResult)
  })

  it('should create action to subscribe to topics', () => {
    const expectedResult = {
      type: types.WS_SUBSCRIBE,
      payload: { topics: ['topic1', 'topic2'] }
    }
    expect(actions.subscribeToTopics(['topic1', 'topic2'])).toEqual(expectedResult)
  })
})
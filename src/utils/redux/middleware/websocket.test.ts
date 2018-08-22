import websocketMW from './websocket'
import * as types from 'actions/pubsub/types'

class MockedDevice {
  region: string
  protocol: string
  clientId: string
  host: string
  accessKeyId: string
  secretKey: string
  sessionToken: string
  constructor({
    region,
    protocol,
    clientId,
    host,
    accessKeyId,
    secretKey,
    sessionToken
  }) {
    this.region = region,
    this.protocol = protocol,
    this.clientId = clientId,
    this.host = host,
    this.accessKeyId = accessKeyId,
    this.secretKey = secretKey,
    this.sessionToken = sessionToken
  }
  on(eventType: string, callback?: Function) {
    return jest.fn()
  }
  end() {
    return jest.fn()
  }
  subscribe() {
    return jest.fn()
  }
}

const mockStore = { getState: jest.fn(), dispatch: jest.fn() }
const mockNext = jest.fn()

describe('websocket middleware', () => {
  beforeEach(() => {
    // Have to mock this here otherwise it 'collects' the calls from previous tests.
    MockedDevice.prototype.on = jest.fn((type: string, callback: Function) => {
      switch (type) {
        case 'connect':
        case 'close':
          callback()
          break
        case 'error':
          callback('testError')
          break
        case 'message':
          callback('testTopic', 'testMessage')
          break
        default:
      }
    })
    MockedDevice.prototype.end = jest.fn()
    MockedDevice.prototype.subscribe = jest.fn()
  })
  it('WS_CONNECT calls initialiseWS', () => {
    const mw = websocketMW(MockedDevice)(mockStore)(mockNext)
    const action = { type: types.WS_CONNECT, payload: { accessKeyId: 'testAccessKey', secretKey: 'testSecretKey', sessionToken: 'testSessionToken', topics: ['topic1'] } }
    mw(action)
    expect(MockedDevice.prototype.on).toHaveBeenCalledTimes(4)
    expect(MockedDevice.prototype.subscribe).toHaveBeenCalledWith('topic1')
    expect(mockNext).toHaveBeenCalledWith(action)
  })
  it('initialises new connection for more than 50 subscriptions', () => {
    const mw = websocketMW(MockedDevice)(mockStore)(mockNext)
    const topics = new Array(60).fill('topic')
    const initialise = { type: types.WS_CONNECT, payload: { accessKeyId: 'testAccessKey', secretKey: 'testSecretKey', sessionToken: 'testSessionToken', topics } }
    mw(initialise)
    expect(MockedDevice.prototype.subscribe).toHaveBeenCalledTimes(60)
    // on() is called 4 times per initialise (connect, close, error, message), and we expect 2 initialisations for 60 topics
    expect(MockedDevice.prototype.on).toHaveBeenCalledTimes(8)
  })
  it('WS_DISCONNECT disconnects', () => {
    const mw = websocketMW(MockedDevice)(mockStore)(mockNext)
    const initialise = { type: types.WS_CONNECT, payload: { accessKeyId: 'testAccessKey', secretKey: 'testSecretKey', sessionToken: 'testSessionToken', topics: ['topic1'] } }
    const disconnect = { type: types.WS_DISCONNECT, payload: {} }
    mw(initialise)
    mw(disconnect)
    expect(MockedDevice.prototype.end).toHaveBeenCalled()
    expect(mockNext).toHaveBeenCalled()
  })
  it('passes on unknown action type', () => {
    const mw = websocketMW(MockedDevice)(mockStore)(mockNext)
    mw({ type: undefined, payload: {} })
    expect(mockNext).toHaveBeenCalled()
  })
})
import * as types from './types'

export const requestConnection = () => (
  {
    type: types.REQUEST_CONNECTION,
    payload: {}
  }
)

export const receiveMessage = (topic: string, message: string) => ({
  type: types.WS_RECEIVE,
  payload: {
    topic,
    message
  }
})

export const connectToWS = (config: {
  accessKeyId: string
  secretKey: string
  sessionToken: string,
  topics: string[]
}) => ({
  type: types.WS_CONNECT,
  payload: config
})

export const disconnectWS = () => ({
  type: types.WS_DISCONNECT,
  payload: {}
})

export const subscribeToTopics = (topics: string[]) => (
  {
    type: types.WS_SUBSCRIBE,
    payload: { topics }
  }
)

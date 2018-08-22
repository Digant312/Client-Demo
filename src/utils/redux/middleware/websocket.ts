import { device } from 'aws-iot-device-sdk'
import { Action, Dispatch, Middleware, MiddlewareAPI, Store } from 'redux'
import { IState } from 'reducers'

import * as types from 'actions/pubsub/types'
import { receiveMessage } from 'actions/pubsub'

interface IAction extends Action {
  payload: any
}

interface IConnection {
  id: string
  conn: device
  subCount: number
}

interface IConfig {
  accessKeyId: string
  secretKey: string
  sessionToken: string
  topics: string[]
}

const createMW = (device: any): Middleware => {
  // This needs to be an array for potential extra clients
  let ws: IConnection[] = []

  const initialiseWS = (
    store: MiddlewareAPI<IState>,
    config: IConfig
  ) => {
    const clientId = Date.now().toString()
    const conn = new device({
      region: 'ap-southeast-1',
      protocol: 'wss',
      clientId,
      host: 'a1lp6ocgu3x00y.iot.ap-southeast-1.amazonaws.com',
      accessKeyId: config.accessKeyId,
      secretKey: config.secretKey,
      sessionToken: config.sessionToken
    })
    ws.push({ id: clientId, conn, subCount: 0 })

    conn.on('connect', () => {
      // console.log('WS connected')
      subscribe(store, config)
    })
    conn.on('close', () => {
      // console.log('WS closed')
    })
    conn.on('error', (error: object | string) => {
      console.error(error)
    })
    conn.on('message', (topic: string, messageEnc: any) => {
      const message = messageEnc.toString()
      store.dispatch(receiveMessage(topic, message))
    })
  }

  const subscribe = (store: MiddlewareAPI<IState>, config: IConfig) => {
    if (config.topics.length === 0) return
    // Cannot subscribe to more than 50 topics in a single connection
    const { topics, ...rest } = config
    const currLength = ws.length
    const lastIndex = ws.length - 1
    const lastConnLength = ws[lastIndex].subCount
    const availableSubsInConn = 50 - lastConnLength
    if (ws && ws.length > 0) {
      // First fill up the remaining subscriptions in the last connection
      topics.slice(0, availableSubsInConn).map((topic: string) => {
        ws[lastIndex].conn.subscribe(topic)
      })
      ws[lastIndex].subCount = lastConnLength + topics.slice(0, availableSubsInConn).length
      // If there are still subscriptions left over, initialise another connection
      if (topics.slice(availableSubsInConn - 1, 50).length > 0) {
        const remainingTopics = config.topics.slice(availableSubsInConn)
        config.topics = remainingTopics
        initialiseWS(store, config)
      }
    } else {
      console.error('Cannot subscribe as there is no WS instance open')
    }
  }

  return (store: MiddlewareAPI<any>) => (next: Function) => (action: any) => {
    switch (action.type) {
      case types.WS_CONNECT:
        const config = action.payload
        initialiseWS(store, config)
        return next(action)
      case types.WS_DISCONNECT:
        if (ws && ws.length > 0) {
          ws.map((connection: IConnection) => {
            connection.conn.end()
          })
          ws = []
        }
        return next(action)
      default:
        return next(action)
    }
  }
}

export default createMW

// Node_modules
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore, Action, Store } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createLogger } from 'redux-logger'
import { addLocaleData } from 'react-intl'
import { IntlProvider } from 'react-intl-redux'
import en from 'react-intl/locale-data/en'
import { device } from 'aws-iot-device-sdk'
import { api } from '@amaas/amaas-core-sdk-js'

// src
import argomi, { IState } from 'reducers'
import { sessionSelector } from 'selectors'
import argomiSaga from 'sagas'
import App from 'components/Global/Main'
import { loadState, saveState } from 'utils/redux'
import pubSubMiddleware from 'utils/redux/middleware/websocket'
import { staticAssets } from 'config'

import 'styles/index.scss'

declare global {
  interface Window {
    zE: any
  }
}

const apiConfig = (env: string) => {
  switch (env) {
    case 'production':
      return { stage: 'prod', apiVersion: 'sg1.0' }
    case 'staging':
      return { stage: 'staging', apiVersion: 'v1.0' }
    case 'dev':
    default:
      return { stage: 'dev', apiVersion: 'v1.0' }
  }
}
api.config(apiConfig(process.env.DEPLOY_ENV as string))

// Append stylesheet according to config
let styleSheet = document.createElement('link')
styleSheet.rel = 'stylesheet'
styleSheet.href = staticAssets('production').stylesheet
styleSheet.href = (function(env: string) {
  return staticAssets(env).stylesheet
})(process.env.DEPLOY_ENV as string)
document.head.appendChild(styleSheet)

// Append icon stylsheet according to config
let iconLink = document.createElement('link')
iconLink.rel = 'icon'
iconLink.type = 'image/x-icon'
iconLink.href = staticAssets('production').appIconOnWhiteBig
iconLink.href = (function(env: string) {
  return staticAssets(env).appIconOnWhiteBig
})(process.env.DEPLOY_ENV as string)
document.head.appendChild(iconLink)

const logger = createLogger({
  predicate: (getState: Function, action: Action) => {
    // Do not log redux-form actions (too many...)
    const reg = new RegExp(/@@redux-form/)

    if (process.env.DEPLOY_ENV === 'production') {
      return false
    }
    return !reg.test(action.type)
    // return true
  }
})

const sagaMiddleware = createSagaMiddleware()
const persistedState = loadState()
const store: Store<IState> = createStore(
  argomi,
  persistedState,
  applyMiddleware(sagaMiddleware, pubSubMiddleware(device), logger) // logger must be last!
)

store.subscribe(() => {
  const state: IState = store.getState()
  saveState(state)
})

sagaMiddleware.run(argomiSaga)

addLocaleData(en)

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider>
      <Router>
        <App />
      </Router>
    </IntlProvider>
  </Provider>,
  document.getElementById('root')
)

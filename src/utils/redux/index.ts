import { createStore } from 'redux'

import reducer, { IState } from 'reducers'
import * as selectors from 'selectors'

import enMessages from '../../../messages/output/index.json'

let locale =
  (navigator.languages && navigator.languages[0])
  || navigator.language
  || 'en-US'

const languageWithoutRegionCode = locale.toLowerCase().split(/[_-]+/)[0]

const messages = enMessages[locale] || enMessages[languageWithoutRegionCode] || enMessages.en

// This will have to be updated if the state shape changes (including key name changes)
export const loadState = (): IState => {
  const emptyState = createStore(reducer).getState()
  try {
    const authState = localStorage.getItem('argomiAuthState')
    const assumedAMID = localStorage.getItem('assumedAMID')
    if (!authState) return emptyState
    return {
      ...emptyState,
      app: {
        ...emptyState.app,
        publicState: {
          ...emptyState.app.publicState,
          session: {
            authenticated: JSON.parse(authState),
            authenticating: false,
            sessionValid: JSON.parse(authState),
            error: ''
          }
        },
      },
      intl: {
        locale,
        messages
      }
    }
  } catch (e) {
    return emptyState
  }
}

export const saveState = (state: IState) => {
  // Save the authenticated state
  saveAuthenticatedState(selectors.sessionSelector(state).authenticated)
}

export const saveAuthenticatedState = (authenticated: boolean) => {
  try {
    localStorage.setItem('argomiAuthState', JSON.stringify(authenticated))
  } catch (e) {
    // no-op
  }
}
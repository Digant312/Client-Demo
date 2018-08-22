import * as authTypes from 'actions/session/types'
import { History } from 'history'
import { Action } from 'redux'

interface IAction extends Action {
  payload?: {
    username?: string
    password?: string
    history?: History
    error?: string
  }
}

export interface ISessionState {
  authenticating: boolean
  authenticated: boolean
  sessionValid: boolean
  error: string
}

const initialState = {
  authenticating: false,
  authenticated: false,
  sessionValid: false,
  error: ''
}

export default (state: ISessionState = initialState, action: IAction) => {
  if (!action.payload) return state
  switch (action.type) {
    case authTypes.REQUEST_LOGIN:
    case authTypes.REQUEST_AUTHENTICATION:
      return { ...state, authenticating: true }
    case authTypes.LOGIN_SUCCESS:
    case authTypes.AUTHENTICATION_SUCCESS:
      return { ...state, authenticating: false, authenticated: true, sessionValid: true, error: '' }
    case authTypes.LOGIN_FAILED:
      return { ...state, authenticating: false, authenticated: false, sessionValid: false, error: action.payload.error }
    case authTypes.AUTHENTICATION_FAILED:
      return { ...state, authenticating: false, authenticated: false, sessionValid: false, error: '' }
    case authTypes.LOGOUT_SUCCESS:
      return { ...state, authenticating: false, authenticated: false, sessionValid: false, error: '' }
    default:
      return state
  }
}
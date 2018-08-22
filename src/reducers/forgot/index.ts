import * as types from 'actions/forgot/types'
import { Action } from 'redux'

interface IAction extends Action {
  payload: {
    email?: string
    error?: string
  }
}

export interface IForgotState {
  sending: boolean
  sent: boolean
  email: string
  error: string
}

const initialState = {
  sending: false,
  sent: false,
  email: '',
  error: ''
}

export default (state: IForgotState = initialState, action: IAction) => {
  switch (action.type) {
    case types.REQUEST_FORGOT:
      return { ...state, sending: true, email: action.payload.email }
    case types.FORGOT_SUCCESS:
      return { ...state, sending: false, sent: true, error: '' }
    case types.FORGOT_FAILED:
      return { ...state, sending: false, sent: false, error: action.payload.error }
    case types.FORGOT_RESET:
      return initialState
    default:
      return state
  }
}
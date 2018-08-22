import * as types from 'actions/reset/types'
import { Action } from 'redux'

interface IAction extends Action {
  payload: {
    code?: string
    password?: string
    email?: string
    error?: string
  }
}

export interface IResetPasswordState {
  resetting: boolean
  reset: boolean
  error: string
}

const initialState = {
  resetting: false,
  reset: false,
  error: ''
}

export default (state: IResetPasswordState = initialState, action: IAction) => {
  switch (action.type) {
    case types.REQUEST_RESET_PASS:
      return { ...state, resetting: true }
    case types.RESET_PASS_SUCCESS:
      return { ...state, resetting: false, reset: true, error: '' }
    case types.RESET_PASS_FAILED:
      return { ...state, resetting: false, reset: false, error: action.payload.error }
    default:
      return state
  }
}
import { Action } from 'redux'
import { History } from 'history'

import * as types from 'actions/verify/types'

interface IAction extends Action {
  payload: {
    code?: string
    username?: string
    error?: string
    history?: History
  }
}

export interface IVerifyState {
  verifying: boolean
  verified: boolean
  verifyError: string
  resendingCode: boolean
  codeResent: boolean
  resendError: string
}

const initialState = {
  verifying: false,
  verified: false,
  verifyError: '',
  resendingCode: false,
  codeResent: false,
  resendError: ''
}

export default (state: IVerifyState = initialState, action: IAction) => {
  switch (action.type) {
    case types.REQUEST_VERIFY:
      return { ...state, verifying: true }
    case types.VERIFY_SUCCESS:
      return { ...state, verifying: false, verified: true, verifyError: '' }
    case types.VERIFY_FAILED:
      return { ...state, verifying: false, verified: false, verifyError: action.payload.error }
    case types.REQUEST_RESEND:
      return { ...state, resendingCode: true }
    case types.RESEND_SUCCESS:
      return { ...state, resendingCode: false, codeResent: true, resendError: '' }
    case types.RESEND_FAILED:
      return { ...state, resendingCode: false, codeResent: false, resendError: action.payload.error }
    default:
      return state
  }
}
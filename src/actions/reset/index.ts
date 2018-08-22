import * as types from './types'
import { History } from 'history'

export const requestResetPass = (payload: { code: string, email: string, password: string, history: History }) => (
  {
    type: types.REQUEST_RESET_PASS,
    payload
  }
)

export const resetPassSuccess = () => (
  {
    type: types.RESET_PASS_SUCCESS,
    payload: {}
  }
)

export const resetPassFailed = (error: string) => (
  {
    type: types.RESET_PASS_FAILED,
    payload: {
      error
    }
  }
)
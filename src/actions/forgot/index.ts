import * as types from './types'

export const requestForgot = (payload: { email: string }) => (
  {
    type: types.REQUEST_FORGOT,
    payload
  }
)

export const forgotSuccess = () => (
  {
    type: types.FORGOT_SUCCESS,
    payload: {}
  }
)

export const forgotFailed = (error: string) => (
  {
    type: types.FORGOT_FAILED,
    payload: { error }
  }
)

export const forgotReset = () => (
  {
    type: types.FORGOT_RESET,
    payload: {}
  }
)
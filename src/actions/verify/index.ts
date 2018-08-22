import * as types from './types'
import { History } from 'history'

export const requestVerify = (creds: { code: string, username: string, history: History }) => (
  {
    type: types.REQUEST_VERIFY,
    payload: {
      code: creds.code,
      username: creds.username,
      history: creds.history
    }
  }
)

export const verifySuccess = () => (
  {
    type: types.VERIFY_SUCCESS,
    payload: {}
  }
)

export const verifyFailed = (error: string) => (
  {
    type: types.VERIFY_FAILED,
    payload: {
      error
    }
  }
)

export const requestResend = (creds: { username: string }) => (
  {
    type: types.REQUEST_RESEND,
    payload: {
      username: creds.username
    }
  }
)

export const resendSuccess = () => (
  {
    type: types.RESEND_SUCCESS,
    payload: {}
  }
)

export const resendFailed = (error: string) => (
  {
    type: types.RESEND_FAILED,
    payload: {
      error
    }
  }
)
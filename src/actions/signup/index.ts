import { History } from 'history'

import * as signupTypes from './types'

export const requestSignup = (creds: {
  username: string
  password: string
  email: string
  firstName: string
  lastName: string
  history: History
}) => ({
  type: signupTypes.REQUEST_SIGNUP,
  payload: creds
})

export const signupSuccess = () => ({
  type: signupTypes.SIGNUP_SUCCESS,
  payload: {}
})

export const signupFailed = (error: string) => ({
  type: signupTypes.SIGNUP_FAILED,
  payload: { error }
})

export const cancelSignupFlow = () => ({
  type: signupTypes.CANCEL_SIGNUP,
  payload: {}
})

export const updateSignupProgress = (progress: number) => ({
  type: signupTypes.UPDATE_SIGNUP_PROGRESS,
  payload: { progress }
})

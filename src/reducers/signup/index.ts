import { Action } from 'redux'

import * as signupTypes from 'actions/signup/types'
import * as domainTypes from 'actions/checkDomain/types'

interface IAction extends Action {
  payload: {
    username?: string
    password?: string
    email?: string
    firstName?: string
    lastName?: string
    error?: string
    persist?: boolean
    amidToJoin?: number
    progress?: number
  }
}

export interface ISignupState {
  signingUp: boolean
  success: boolean
  error: string
  amidToJoin?: number
  firstName?: string
  lastName?: string
  accountCreationProgress?: number
}

const initialState = {
  signingUp: false,
  success: false,
  error: '',
  accountCreationProgress: 0
}

export default (state: ISignupState = initialState, action: IAction) => {
  switch (action.type) {
    case signupTypes.REQUEST_SIGNUP:
      return {
        ...state,
        signingUp: true,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        accountCreationProgress: 0
      }
    case signupTypes.SIGNUP_SUCCESS:
      return { ...state, signingUp: false, success: true, error: '' }
    case domainTypes.CHECKDOMAIN_SUCCESS:
      if (action.payload.persist)
        return { ...state, amidToJoin: action.payload.amidToJoin }
    case signupTypes.SIGNUP_FAILED:
      return {
        ...state,
        signingUp: false,
        success: false,
        error: action.payload.error
      }
    case signupTypes.UPDATE_SIGNUP_PROGRESS:
      return { ...state, accountCreationProgress: action.payload.progress }
    default:
      return state
  }
}

import { Action } from 'redux'

import * as types from 'actions/joinCompany/types'
import { CANCEL_SIGNUP } from 'actions/signup/types'

interface IAction extends Action {
  payload: {
    message?: string
    error?: string
  }
}

export interface IJoinCompanyState {
  joining: boolean
  joined: boolean
  error: string
}

const initialState = {
  joining: false,
  joined: false,
  error: ''
}

export default (state: IJoinCompanyState = initialState, action: IAction) => {
  switch (action.type) {
    case types.REQUEST_JOINCOMPANY:
      return { ...state, joining: true }
    case types.JOINCOMPANY_SUCCESS:
      return { ...state, joining: false, joined: true, error: '' }
    case types.JOINCOMPANY_FAILED:
      return { ...state, joining: false, joined: false, error: action.payload.error }
    case CANCEL_SIGNUP:
      return initialState
    default:
      return state
  }
}
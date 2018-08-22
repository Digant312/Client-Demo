import { Action } from 'redux'

import * as types from 'actions/newCompany/types'
import { CANCEL_SIGNUP } from 'actions/signup/types'

interface IAction extends Action {
  payload: {
    name?: string
    type?: string
    error?: string
  }
}

export interface INewCompanyState {
  creating: boolean
  created: boolean
  error: string
}

const initialState = {
  creating: false,
  created: false,
  error: ''
}

export default (state: INewCompanyState = initialState, action: IAction) => {
  switch (action.type) {
    case types.REQUEST_NEWCOMPANY:
      return { ...state, creating: true, error: '' }
    case types.NEWCOMPANY_SUCCESS:
      return { ...state, creating: false, created: true, error: '' }
    case types.NEWCOMPANY_FAILED:
      return {
        ...state,
        creating: false,
        created: false,
        error: action.payload.error
      }
    case CANCEL_SIGNUP:
      return initialState
    default:
      return state
  }
}

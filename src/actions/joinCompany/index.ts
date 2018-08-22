import * as types from './types'
import { History } from 'history'

export const requestJoinCompany = (history: History, message?: string) => (
  {
    type: types.REQUEST_JOINCOMPANY,
    payload: {
      message,
      history
    }
  }
)

export const joinCompanySuccess = () => (
  {
    type: types.JOINCOMPANY_SUCCESS,
    payload: {}
  }
)

export const joinCompanyFailed = (error: string) => (
  {
    type: types.JOINCOMPANY_FAILED,
    payload: { error }
  }
)
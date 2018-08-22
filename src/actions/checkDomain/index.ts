import * as types from './types'
import { History } from 'history'

export const requestCheckDomain = (domain: string, history: History) => (
  {
    type: types.REQUEST_CHECKDOMAIN,
    payload: {
      domain,
      history
    }
  }
)

export const checkDomainSuccess = ({ persist, amidToJoin }: { persist: boolean, amidToJoin?: number }) => (
  {
    type: types.CHECKDOMAIN_SUCCESS,
    payload: { persist, amidToJoin }
  }
)

export const checkDomainFailed = (error: string) => (
  {
    type: types.CHECKDOMAIN_FAILED,
    payload: { error }
  }
)
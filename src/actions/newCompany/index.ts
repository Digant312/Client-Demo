import * as types from './types'
import { History } from 'history'

export const requestNewCompany = ({
  name,
  type,
  history,
  domain
}: {
  name: string
  type: string
  history: History
  domain: string
}) => ({
  type: types.REQUEST_NEWCOMPANY,
  payload: {
    name,
    type,
    history,
    domain
  }
})

export const newCompanySuccess = () => ({
  type: types.NEWCOMPANY_SUCCESS,
  payload: {}
})

export const newCompanyFailed = (error: string) => ({
  type: types.NEWCOMPANY_FAILED,
  payload: { error }
})

export const redirectToTermsAndConditions = (
  name: string,
  type: string,
  regulated: boolean,
  domain: string,
  history: History
) => ({
  type: types.REDIRECT_TO_TC,
  payload: { name, type, regulated, domain, history }
})

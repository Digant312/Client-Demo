import { History } from 'history'

import * as types from './types'
import * as actions from './'

describe('checkDomain action creators', () => {
  it('creates an action for request check domain', () => {
    const expectedResult = { type: types.REQUEST_CHECKDOMAIN, payload: { domain: 'testDomain.com', history: 'testHistory' } }
    expect(actions.requestCheckDomain('testDomain.com', 'testHistory' as any)).toEqual(expectedResult)
  })

  it('creates an action for successful domain check', () => {
    const expectedResult = { type: types.CHECKDOMAIN_SUCCESS, payload: { persist: true, amidToJoin: 1 } }
    expect(actions.checkDomainSuccess({ persist: true, amidToJoin: 1 })).toEqual(expectedResult)
  })

  it('creates an action for failed check Domain', () => {
    const expectedResult = { type: types.CHECKDOMAIN_FAILED, payload: { error: 'testError' } }
    expect(actions.checkDomainFailed('testError')).toEqual(expectedResult)
  })
})
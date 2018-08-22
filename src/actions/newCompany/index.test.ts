import * as types from './types'
import * as actions from './'

describe('newCompany action creators', () => {
  it('should create an action to request create new company', () => {
    const expectedResult = {
      type: types.REQUEST_NEWCOMPANY,
      payload: {
        name: 'testName',
        type: 'testType',
        history: 'testHistory',
        domain: 'testDomain'
      }
    }
    expect(
      actions.requestNewCompany({
        name: 'testName',
        type: 'testType',
        history: 'testHistory' as any,
        domain: 'testDomain'
      })
    ).toEqual(expectedResult)
  })

  it('shoudl create an action for successful creation of new company', () => {
    const expectedResult = {
      type: types.NEWCOMPANY_SUCCESS,
      payload: {}
    }
    expect(actions.newCompanySuccess()).toEqual(expectedResult)
  })

  it('should create an action for failed creation of new company', () => {
    const expectedResult = {
      type: types.NEWCOMPANY_FAILED,
      payload: { error: 'testError' }
    }
    expect(actions.newCompanyFailed('testError')).toEqual(expectedResult)
  })

  it('should create an action to request redirect to terms and conditions', () => {
    const expectedResult = {
      type: types.REDIRECT_TO_TC,
      payload: {
        name: 'test company name',
        type: 'Venture Capital',
        regulated: true,
        domain: 'argomi.com',
        history: 'history'
      }
    }
    expect(
      actions.redirectToTermsAndConditions(
        'test company name',
        'Venture Capital',
        true,
        'argomi.com',
        'history' as any
      )
    ).toEqual(expectedResult)
  })
})

import * as types from './types'
import * as actions from './'

describe('joinCompany action creators', () => {
  it('should create an action to request join company', () => {
    const expectedResult = {
      type: types.REQUEST_JOINCOMPANY,
      payload: { message: 'testMessage', history: 'testHistory' }
    }
    expect(actions.requestJoinCompany('testHistory' as any, 'testMessage')).toEqual(expectedResult)
  })

  it('should create an action for successful join company', () => {
    const expectedResult = {
      type: types.JOINCOMPANY_SUCCESS,
      payload: {}
    }
    expect(actions.joinCompanySuccess()).toEqual(expectedResult)
  })

  it('should create an action for failed join company', () => {
    const expectedResult = {
      type: types.JOINCOMPANY_FAILED,
      payload: { error: 'testError' }
    }
    expect(actions.joinCompanyFailed('testError')).toEqual(expectedResult)
  })
})
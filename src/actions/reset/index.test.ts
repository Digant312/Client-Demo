import * as types from './types'
import * as actions from './'

describe('resetPass action creators', () => {
  it('should create an action for requestResetPass', () => {
    const expectedResult = {
      type: types.REQUEST_RESET_PASS,
      payload: {
        code: 'testCode',
        email: 'testEmail',
        password: 'testPass'
      }
    }
    expect(actions.requestResetPass({ code: 'testCode', email: 'testEmail', password: 'testPass' })).toEqual(expectedResult)
  })

  it('should create an action for resetPassSuccess', () => {
    const expectedResult = {
      type: types.RESET_PASS_SUCCESS,
      payload: {}
    }
    expect(actions.resetPassSuccess()).toEqual(expectedResult)
  })

  it('should create an action for resetPassFailed', () => {
    const expectedResult = {
      type: types.RESET_PASS_FAILED,
      payload: { error: 'testError' }
    }
    expect(actions.resetPassFailed('testError')).toEqual(expectedResult)
  })
})
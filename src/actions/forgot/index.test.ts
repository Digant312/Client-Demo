import * as types from './types'
import * as actions from './'

describe('forgot action creators', () => {
  it('should create an action for forgot request', () => {
    const expectedResult = {
      type: types.REQUEST_FORGOT,
      payload: {
        email: 'testEmail'
      }
    }
    expect(actions.requestForgot({ email: 'testEmail' })).toEqual(expectedResult)
  })

  it('should create an action for successful sending of forgot password reset code', () => {
    const expectedResult = {
      type: types.FORGOT_SUCCESS,
      payload: {}
    }
    expect(actions.forgotSuccess()).toEqual(expectedResult)
  })

  it('should create an action for failed sending of forgot password reset code', () => {
    const expectedResult = {
      type: types.FORGOT_FAILED,
      payload: {
        error: 'testError'
      }
    }
    expect(actions.forgotFailed('testError')).toEqual(expectedResult)
  })

  it('should create an action for forgotReset (clear down the state for whatever reason', () => {
    const expectedResult = {
      type: types.FORGOT_RESET,
      payload: {}
    }
    expect(actions.forgotReset()).toEqual(expectedResult)
  })
})
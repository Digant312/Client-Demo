import * as types from './types'
import * as actions from './'

describe('verify actions', () => {
  it('should create an action for request verify', () => {
    const expectedResult = {
      type: types.REQUEST_VERIFY,
      payload: {
        code: 'testCode',
        username: 'testUser',
        history: ''
      }
    }
    expect(actions.requestVerify({ code: 'testCode', username: 'testUser', history: '' as any })).toEqual(expectedResult)
  })

  it('should create an action for successful verify', () => {
    const expectedResult = {
      type: types.VERIFY_SUCCESS,
      payload: {}
    }
    expect(actions.verifySuccess()).toEqual(expectedResult)
  })

  it('should create an action for failed verify', () => {
    const expectedResult = {
      type: types.VERIFY_FAILED,
      payload: {
        error: 'testError'
      }
    }
    expect(actions.verifyFailed('testError')).toEqual(expectedResult)
  })

  it('should create an action for request resend', () => {
    const expectedResult = {
      type: types.REQUEST_RESEND,
      payload: {
        username: 'testUser'
      }
    }
    expect(actions.requestResend({ username: 'testUser' })).toEqual(expectedResult)
  })

  it('should create an action for successful resend', () => {
    const expectedResult = {
      type: types.RESEND_SUCCESS,
      payload: {}
    }
    expect(actions.resendSuccess()).toEqual(expectedResult)
  })

  it('should create an action for failed resend', () => {
    const expectedResult = {
      type: types.RESEND_FAILED,
      payload: {
        error: 'testError'
      }
    }
    expect(actions.resendFailed('testError')).toEqual(expectedResult)
  })
})
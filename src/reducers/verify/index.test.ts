import reducer from './'
import * as types from 'actions/verify/types'

const initialState = {
  verifying: false,
  verified: false,
  verifyError: '',
  resendingCode: false,
  codeResent: false,
  resendError: ''
}

describe('verify reducer', () => {
  it('should return initialState on unknown action', () => {
    const expectedResult = initialState
    expect(reducer(initialState, { type: undefined, payload: {} })).toEqual(expectedResult)
  })

  it('should set verifying to true on request verify', () => {
    const expectedResult = { ...initialState, verifying: true }
    expect(reducer(initialState, { type: types.REQUEST_VERIFY, payload: {} })).toEqual(expectedResult)
  })

  it('should set verified to true on successful verify', () => {
    const expectedResult = { ...initialState, verified: true }
    expect(reducer(initialState, { type: types.VERIFY_SUCCESS, payload: {} })).toEqual(expectedResult)
  })

  it('should set verifyError on failed verify', () => {
    const expectedResult = { ...initialState, verifyError: 'testError' }
    expect(reducer(initialState, { type: types.VERIFY_FAILED, payload: { error: 'testError' } }))
  })

  it('should set resendingCode to true on resend request', () => {
    const expectedResult = { ...initialState, resendingCode: true }
    expect(reducer(initialState, { type: types.REQUEST_RESEND, payload: {} })).toEqual(expectedResult)
  })

  it('should set codeResent to true on successful resend', () => {
    const expectedResult = { ...initialState, codeResent: true }
    expect(reducer(initialState, { type: types.RESEND_SUCCESS, payload: {} })).toEqual(expectedResult)
  })

  it('should set resendError on failed resend', () => {
    const expectedResult = { ...initialState, resendError: 'testError' }
    expect(reducer(initialState, { type: types.RESEND_FAILED, payload: { error: 'testError' } })).toEqual(expectedResult)
  })
})
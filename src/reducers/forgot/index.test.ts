import * as types from 'actions/forgot/types'
import reducer from './'

const initialState = {
  sending: false,
  sent: false,
  email: '',
  error: ''
}

describe('forgot reducer', () => {
  it('returns initial state for unknown action', () => {
    const expectedResult = initialState
    expect(reducer(initialState, { type: undefined, payload: {} })).toEqual(expectedResult)
  })

  it('sets sending on REQUEST_FORGOT', () => {
    const expectedResult = { ...initialState, sending: true, email: 'testEmail' }
    expect(reducer(initialState, { type: types.REQUEST_FORGOT, payload: { email: 'testEmail' } })).toEqual(expectedResult)
  })

  it('sets sent on FORGOT_SUCCESS', () => {
    const expectedResult = { ...initialState, sent: true }
    expect(reducer(initialState, { type: types.FORGOT_SUCCESS, payload: {} })).toEqual(expectedResult)
  })

  it('sets error on FORGOT_FAILED', () => {
    const expectedResult = { ...initialState, error: 'testError' }
    expect(reducer(initialState, { type: types.FORGOT_FAILED, payload: { error: 'testError' } })).toEqual(expectedResult)
  })

  it('reverts to empty state on FORGOT_RESET', () => {
    const expectedResult = initialState
    expect(reducer({ ...initialState, email: 'testEmail' }, { type: types.FORGOT_RESET, payload: {} })).toEqual(expectedResult)
  })
})
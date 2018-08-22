import reducer from './'
import * as types from 'actions/reset/types'

const initialState = {
  resetting: false,
  reset: false,
  error: ''
}

describe('reset pass reducer', () => {
  it('should return initial state for unknown action', () => {
    const expectedResult = initialState
    expect(reducer(initialState, { type: undefined, payload: {} })).toEqual(expectedResult)
  })

  it('should set resetting on REQUEST_RESET_PASS', () => {
    const expectedResult = { ...initialState, resetting: true }
    expect(reducer(initialState, { type: types.REQUEST_RESET_PASS, payload: {} })).toEqual(expectedResult)
  })

  it('should set reset on RESET_PASS_SUCCESS', () => {
    const expectedResult = { ...initialState, reset: true }
    expect(reducer({ ...initialState, resetting: true }, { type: types.RESET_PASS_SUCCESS, payload: {} })).toEqual(expectedResult)
  })

  it('should set reset and error on RESET_PASS_FAILED', () => {
    const expectedResult = { ...initialState, error: 'testError' }
    expect(reducer({ ...initialState, reset: true, resetting: true }, { type: types.RESET_PASS_FAILED, payload: { error: 'testError' } })).toEqual(expectedResult)
  })
})
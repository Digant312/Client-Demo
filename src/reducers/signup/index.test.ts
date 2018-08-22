import reducer from './'

import * as types from 'actions/signup/types'

const initialState = {
  signingUp: false,
  success: false,
  error: '',
  accountCreationProgress: 0
}

describe('signup reducer', () => {
  it('should return initial state for unknown action', () => {
    const expectedResult = initialState
    expect(reducer(initialState, { type: undefined, payload: {} })).toEqual(
      expectedResult
    )
  })

  it('should set signingUp to true on signup request', () => {
    const expectedResult = { ...initialState, signingUp: true }
    expect(
      reducer(initialState, { type: types.REQUEST_SIGNUP, payload: {} })
    ).toEqual(expectedResult)
  })

  it('should set signingUp to false and success to true on failed signup', () => {
    const expectedResult = { ...initialState, success: true }
    expect(
      reducer(initialState, { type: types.SIGNUP_SUCCESS, payload: {} })
    ).toEqual(expectedResult)
  })

  it('should set signingUp to false and error on failed signup', () => {
    const expectedResult = { ...initialState, error: 'testError' }
    expect(
      reducer(initialState, {
        type: types.SIGNUP_FAILED,
        payload: { error: 'testError' }
      })
    ).toEqual(expectedResult)
  })

  it('should update the accountCreationProgress', () => {
    const expectedResult = { ...initialState, accountCreationProgress: 42 }
    expect(
      reducer(initialState, {
        type: types.UPDATE_SIGNUP_PROGRESS,
        payload: { progress: 42 }
      })
    ).toEqual(expectedResult)
  })
})

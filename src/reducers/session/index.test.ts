import reducer from './'

import * as authTypes from 'actions/session/types'

const initialState = {
  authenticating: false,
  authenticated: false,
  sessionValid: false,
  error: ''
}

describe('auth reducer', () => {
  it('should return the initial state if action has no payload', () => {
    const expectedResult = initialState
    expect(reducer(initialState, { type: 'REQUEST_LOGIN' })).toEqual(expectedResult)
  })

  it('should return the initial state if an unknown action is dispatched', () => {
    const expectedResult = initialState
    expect(reducer(initialState, { type: 'UnknownAction', payload: {} })).toEqual(expectedResult)
  })

  it('should set authenticating to true on login request and authentication request', () => {
    const expectedResult = { authenticating: true, authenticated: false, sessionValid: false, error: '' }
    expect(reducer(initialState, { type: authTypes.REQUEST_LOGIN, payload: {} })).toEqual(expectedResult)
    expect(reducer(initialState, { type: authTypes.REQUEST_AUTHENTICATION, payload: {} })).toEqual(expectedResult)
  })

  it('should set authenticating to false and set username on successful request and successful authentication', () => {
    const expectedResult = { authenticating: false, authenticated: true, sessionValid: true, error: '' }
    expect(reducer({ ...initialState, authenticating: true }, { type: authTypes.LOGIN_SUCCESS, payload: { username: 'testUser' } })).toEqual(expectedResult)
    expect(reducer({ ...initialState, authenticating: true }, { type: authTypes.AUTHENTICATION_SUCCESS, payload: {} })).toEqual(expectedResult)
  })

  it('should set authenticating to false and error on unsuccessful request', () => {
    const expectedResult = { authenticating: false, authenticated: false, sessionValid: false, error: 'testError' }
    expect(reducer({ ...initialState, authenticating: true }, { type: authTypes.LOGIN_FAILED, payload: { error: 'testError' } })).toEqual(expectedResult)
  })

  it('should set authenticating, authenticated and sessionValid to false and remove error on failed checkSession', () => {
    const expectedResult = initialState
    expect(reducer({ ...initialState, authenticated: true, sessionValid: true }, { type: authTypes.AUTHENTICATION_FAILED, payload: {} })).toEqual(expectedResult)
  })
})
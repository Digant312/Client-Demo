import reducer from './'
import * as types from 'actions/joinCompany/types'
import { CANCEL_SIGNUP } from 'actions/signup/types'

const initialState = {
  joining: false, 
  joined: false,
  error: ''
}

describe('joinCompany reducer', () => {
  it('returns initialState on unknown action', () => {
    const expectedResult = initialState
    expect(reducer(initialState, { type: undefined, payload: {} })).toEqual(initialState)
  })

  it('sets joining to true on REQUEST_JOINCOMPANY', () => {
    const expectedResult = { ...initialState, joining: true }
    expect(reducer(initialState, { type: types.REQUEST_JOINCOMPANY, payload: { message: 'testMessage' } })).toEqual(expectedResult)
  })

  it('sets joined to true and error to empty on JOINCOMPANY_SUCCESS', () => {
    const expectedResult = { ...initialState, joined: true }
    expect(reducer({ ...initialState, error: 'error' }, { type: types.JOINCOMPANY_SUCCESS, payload: {} })).toEqual(expectedResult)
  })

  it('sets joined to false and error on JOINCOMPANY_FAILED', () => {
    const expectedResult = { ...initialState, error: 'testError' }
    expect(reducer({ joining: true, joined: true, error: '' }, { type: types.JOINCOMPANY_FAILED, payload: { error: 'testError' } })).toEqual(expectedResult)
  })

  it('returns initialState on CANCEL_SIGNUP', () => {
    const expectedResult = initialState
    expect(reducer({ ...initialState, error: 'testError' }, { type: CANCEL_SIGNUP, payload: {} })).toEqual(expectedResult)
  })
})
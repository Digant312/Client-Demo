import reducer from './'
import * as types from 'actions/newCompany/types'
import { CANCEL_SIGNUP } from 'actions/signup/types'

const initialState = {
  creating: false,
  created: false,
  error: ''
}

describe('newCompany reducer', () => {
  it('returns initialState on unknown action', () => {
    const expectedResult = initialState
    expect(reducer(initialState, { type: undefined, payload: {} })).toEqual(
      initialState
    )
  })

  it('sets creating to true on REQUEST_NEWCOMPANY ', () => {
    const expectedResult = { ...initialState, creating: true }
    expect(
      reducer(
        { ...initialState, error: 'an error' },
        {
          type: types.REQUEST_NEWCOMPANY,
          payload: { name: 'testName', type: 'testType' }
        }
      )
    ).toEqual(expectedResult)
  })

  it('sets created to true and creating to false on NEWCOMPANY_SUCCESS', () => {
    const expectedResult = { ...initialState, created: true }
    expect(
      reducer(
        { ...initialState, creating: true, error: 'testError' },
        { type: types.NEWCOMPANY_SUCCESS, payload: {} }
      )
    ).toEqual(expectedResult)
  })

  it('sets created to false and error on NEWCOMPANY_FAILED', () => {
    const expectedResult = { ...initialState, error: 'testError' }
    expect(
      reducer(
        { ...initialState, creating: true, created: true },
        { type: types.NEWCOMPANY_FAILED, payload: { error: 'testError' } }
      )
    ).toEqual(expectedResult)
  })

  it('returns initialState on CANCEL_SIGNUP', () => {
    const expectedResult = initialState
    expect(
      reducer(
        { ...initialState, error: 'testError' },
        { type: CANCEL_SIGNUP, payload: {} }
      )
    ).toEqual(expectedResult)
  })
})

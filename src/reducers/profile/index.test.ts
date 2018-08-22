import reducer from './'
import * as authTypes from 'actions/session/types'

const initialState = {
  fetching: false,
  assetManagerId: '',
  assumedAMID: '',
  assumableAMIDs: [],
  username: '',
  email: '',
  darkProfile: false,
  dateFormat: 'DD-MM-YYYY' as 'DD-MM-YYYY'
}

describe('profile reducer', () => {
  it('returns original state for unknown action', () => {
    const expectedResult = initialState
    expect(reducer(initialState, { type: undefined, payload: {} })).toEqual(
      expectedResult
    )
  })

  it('sets fetching on request', () => {
    const expectedResult = { ...initialState, fetching: true }
    expect(
      reducer(initialState, { type: authTypes.REQUEST_LOGIN, payload: {} })
    ).toEqual(expectedResult)
    expect(
      reducer(initialState, {
        type: authTypes.REQUEST_AUTHENTICATION,
        payload: {}
      })
    ).toEqual(expectedResult)
  })

  it('sets username, email and assetManagerId on LOGIN_SUCCESS', () => {
    const expectedResult = {
      ...initialState,
      fetching: false,
      username: 'testUser',
      email: 'testEmail',
      assetManagerId: 'testAMID',
      assumedAMID: 5,
      assumableAMIDs: [
        {
          assetManagerId: 5,
          relationshipStatus: 'Active',
          relationshipType: 'Administrator'
        }
      ],
      dateFormat: 'DD-MM-YYYY'
    }
    expect(
      reducer(initialState, {
        type: authTypes.LOGIN_SUCCESS,
        payload: {
          username: 'testUser',
          email: 'testEmail',
          assetManagerId: 'testAMID',
          assumableAMIDs: [
            {
              assetManagerId: 5,
              relationshipStatus: 'Active',
              relationshipType: 'Administrator'
            }
          ],
          dateFormat: 'DD-MM-YYYY'
        }
      })
    ).toEqual(expectedResult)
  })

  it('sets username, email and assetManagerId to null on LOGOUT_SUCCESS', () => {
    const expectedResult = initialState
    expect(
      reducer(
        { ...initialState, username: 'testUser' },
        { type: authTypes.LOGOUT_SUCCESS, payload: {} }
      )
    ).toEqual(expectedResult)
  })

  it('toggles darkProfile on TOGGLE_DARK', () => {
    const expectedResult = { ...initialState, darkProfile: true }
    expect(
      reducer(initialState, { type: authTypes.TOGGLE_DARK, payload: {} })
    ).toEqual(expectedResult)
  })

  it('sets assumedAMID on assumeAMID', () => {
    const expectedResult = { ...initialState, assumedAMID: '5' }
    expect(
      reducer(initialState, {
        type: authTypes.ASSUME_AMID,
        payload: { assumedAMID: 5 }
      })
    ).toEqual(expectedResult)
  })
})

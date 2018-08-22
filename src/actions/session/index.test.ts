import * as actions from './'
import * as authTypes from './types'

describe('auth action generators', () => {
  it('should create an action for login request', () => {
    const expectedResult = {
      type: authTypes.REQUEST_LOGIN,
      payload: {
        username: 'testUser',
        password: 'testPassword',
        history: {},
        nextPath: 'testPath/path'
      }
    }
    expect(
      actions.requestLogin({
        username: 'testUser',
        password: 'testPassword',
        history: {} as any,
        nextPath: 'testPath/path' as any
      })
    ).toEqual(expectedResult)
  })

  it('should create an action for successful login', () => {
    const expectedResult = {
      type: authTypes.LOGIN_SUCCESS,
      payload: {
        username: 'testUser',
        email: 'testEmail',
        assetManagerId: '1',
        dateFormat: 'MM-DD-YYYY'
      }
    }
    expect(
      actions.loginSuccess({
        username: 'testUser',
        email: 'testEmail',
        assetManagerId: '1',
        dateFormat: 'MM-DD-YYYY'
      })
    ).toEqual(expectedResult)
  })

  it('should create an action for failed login', () => {
    const expectedResult = {
      type: authTypes.LOGIN_FAILED,
      payload: { error: 'testError' }
    }
    expect(actions.loginFailed('testError')).toEqual(expectedResult)
  })

  it('should create an action to toggle dark profile', () => {
    const expectedResult = {
      type: authTypes.TOGGLE_DARK,
      payload: {}
    }
    expect(actions.toggleDarkProfile()).toEqual(expectedResult)
  })

  it('creates action for logout', () => {
    const expectedResult = {
      type: authTypes.REQUEST_LOGOUT,
      payload: { history: 'history' }
    }
    expect(actions.requestLogout({ history: 'history' as any })).toEqual(
      expectedResult
    )
  })

  it('creates action for successful logout', () => {
    const expectedResult = { type: authTypes.LOGOUT_SUCCESS, payload: {} }
    expect(actions.logoutSuccess()).toEqual(expectedResult)
  })

  it('creates action for REQUEST_AUTHENTICATION', () => {
    const expectedResult = {
      type: authTypes.REQUEST_AUTHENTICATION,
      payload: {}
    }
    expect(actions.requestAuth()).toEqual(expectedResult)
  })

  it('creates an action for successful authentication', () => {
    const expectedResult = {
      type: authTypes.AUTHENTICATION_SUCCESS,
      payload: {
        username: 'testUser',
        email: 'testEmail',
        assetManagerId: 1,
        assumableAMIDs: [
          {
            assetManagerId: 4,
            relationshipStatus: 'Active',
            relationshipType: 'Employee'
          },
          {
            assetManagerId: 5,
            relationshipStatus: 'Active',
            relationshipType: 'Employee'
          },
          {
            assetManagerId: 6,
            relationshipStatus: 'Active',
            relationshipType: 'Employee'
          }
        ],
        dateFormat: 'MM-DD-YYYY'
      }
    }
    expect(
      actions.authSuccess({
        username: 'testUser',
        email: 'testEmail',
        assetManagerId: 1,
        assumableAMIDs: [
          {
            assetManagerId: 4,
            relationshipStatus: 'Active',
            relationshipType: 'Employee'
          },
          {
            assetManagerId: 5,
            relationshipStatus: 'Active',
            relationshipType: 'Employee'
          },
          {
            assetManagerId: 6,
            relationshipStatus: 'Active',
            relationshipType: 'Employee'
          }
        ],
        dateFormat: 'MM-DD-YYYY'
      })
    ).toEqual(expectedResult)
  })

  it('creates action for failed authentication', () => {
    const expectedResult = {
      type: authTypes.AUTHENTICATION_FAILED,
      payload: {}
    }
    expect(actions.authFailed()).toEqual(expectedResult)
  })

  it('creates an action for assuming AMID', () => {
    const expectedResult = {
      type: authTypes.ASSUME_AMID,
      payload: { assumedAMID: 5 }
    }
    expect(actions.assumeAMID({ assumedAMID: 5 })).toEqual(expectedResult)
  })
})

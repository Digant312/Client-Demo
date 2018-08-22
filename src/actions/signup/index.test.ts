import * as signupTypes from './types'
import * as actions from './'

describe('signup actions', () => {
  it('should create an action for signup request', () => {
    const expectedResult = {
      type: signupTypes.REQUEST_SIGNUP,
      payload: {
        username: 'testUser',
        password: 'testPass',
        email: 'testEmail',
        firstName: 'testFirstName',
        lastName: 'testLastName',
        history: 'history'
      }
    }
    expect(
      actions.requestSignup({
        username: 'testUser',
        password: 'testPass',
        email: 'testEmail',
        firstName: 'testFirstName',
        lastName: 'testLastName',
        history: 'history' as any
      })
    ).toEqual(expectedResult)
  })

  it('should create an action for successful signup', () => {
    const expectedResult = {
      type: signupTypes.SIGNUP_SUCCESS,
      payload: {}
    }
    expect(actions.signupSuccess()).toEqual(expectedResult)
  })

  it('should create an action for failed signup', () => {
    const expectedResult = {
      type: signupTypes.SIGNUP_FAILED,
      payload: {
        error: 'testError'
      }
    }
    expect(actions.signupFailed('testError')).toEqual(expectedResult)
  })

  it('should create an action for cancel signup flow', () => {
    const expectedResult = {
      type: signupTypes.CANCEL_SIGNUP,
      payload: {}
    }
    expect(actions.cancelSignupFlow()).toEqual(expectedResult)
  })

  it('should create an action to update signup progress', () => {
    const expectedResult = {
      type: signupTypes.UPDATE_SIGNUP_PROGRESS,
      payload: { progress: 42 }
    }
    expect(actions.updateSignupProgress(42)).toEqual(expectedResult)
  })
})

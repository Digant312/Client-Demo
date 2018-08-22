import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js'

import { changeAttribute, changePassword, checkSession, loginUser, refreshSession, resendAttributeVerificationCode, resendVerificationCode, resetPassword, sendForgotPassResetCode, signupUser, verifyAttribute, verifyUser } from './'
import config from '../../config'

class MockedAttribute {
  name: string
  constructor(name: string) {
    this.name = name
  }
  getName() {
    return this.name
  }
  getValue() {
    return 'testValue'
  }
}

describe('auth functions', () => {
  describe('signupUser', () => {
    it('should reject if any credentials are missing', () => {
      return expect(signupUser({ username: '', password: '', email: '', firstName: '', lastName: '' })).rejects.toEqual(new Error('Missing credentials, please try again'))
    })

    it('should reject if userPool.signup calls back error', () => {
      CognitoUserPool.prototype.signUp = jest.fn((arg1, arg2, arg3, arg4, cb) => cb({ message: 'testError' }))
      return expect(signupUser({ username: 'testUser', password: 'testPass', email: 'testEmail', firstName: 'testFirstName', lastName: 'testLastName' })).rejects.toEqual({ type: 'SIGNUP', message: 'testError' })
    })

    it('should resolve if userPool.signup calls back with success', () => {
      CognitoUserPool.prototype.signUp = jest.fn((arg1, arg2, arg3, arg4, cb) => cb(null, 'testResult'))
      return expect(signupUser({ username: 'testUser', password: 'testPass', email: 'testEmail', firstName: 'testFirstName', lastName: 'testLastName' })).resolves.toEqual('testResult')
    })
  })

  describe('verifyUser', () => {
    it('should throw if there are missing params', () => {
      return expect(verifyUser('', { username: '' })).rejects.toEqual(new Error('Missing Parameters'))
    })

    it('should reject if confirmRegistration fails', () => {
      CognitoUser.prototype.confirmRegistration = jest.fn((arg1, arg2, cb) => cb({ message: 'testError' }))
      return expect(verifyUser('testCode', { username: 'testUser' })).rejects.toEqual({ type: 'VERIFY', message: 'testError' })
    })

    it('should resolve if confirmRegistration succeeds', () => {
      CognitoUser.prototype.confirmRegistration = jest.fn((arg1, arg2, cb) => cb(null, 'testResult'))
      return expect(verifyUser('testCode', { username: 'testUser' })).resolves.toEqual('testResult')
    })
  })

  describe('resendVerificationCode', () => {
    it('should throw if called without username', () => {
      return expect(resendVerificationCode({ username: '' })).rejects.toEqual(new Error('Missing credentials'))
    })

    it('should reject if cognitoUser.resendConfirmationCode fails', () => {
      CognitoUser.prototype.resendConfirmationCode = jest.fn(cb => cb({ message: 'testError' }))
      return expect(resendVerificationCode({ username: 'testUser' })).rejects.toEqual({ type: 'RESEND', message: 'testError' })
    })

    it('should resolve if cognitoUser.resendConfirmationCode succeeds', () => {
      CognitoUser.prototype.resendConfirmationCode = jest.fn(cb => cb(null, 'testResult'))
      return expect(resendVerificationCode({ username: 'testUser' })).resolves.toEqual('testResult')
    })
  })

  describe('sendForgotPassResetCode', () => {
    it('should throw if passed empty string', () => {
      CognitoUser.prototype.forgotPassword = jest.fn()
      return expect(sendForgotPassResetCode({ email: '' })).rejects.toEqual(new Error('Missing email address'))
    })

    it('should resolve if cognitoUser.forgotPassword succeeds', () => {
      CognitoUser.prototype.forgotPassword = jest.fn(cb => cb.onSuccess())
      return expect(sendForgotPassResetCode({ email: 'testEmail' })).resolves.toBeUndefined()
    })

    it('should reject if cognitoUser.forgotPassword fails', () => {
      CognitoUser.prototype.forgotPassword = jest.fn(cb => cb.onFailure({ message: 'testError' }))
      return expect(sendForgotPassResetCode({ email: 'testEmail' })).rejects.toEqual({ type: 'FORGOT', message: 'testError' })
    })
  })

  describe('resetPassword', () => {
    it('should throw if any missing params', () => {
      return expect(resetPassword({ code: '', email: 'testEmail', password: 'testPass' })).rejects.toEqual(new Error('Both code and new password must be supplied'))
    })

    it('should resolve if cognitoUser.confirmPassword succeeds', () => {
      CognitoUser.prototype.confirmPassword = jest.fn((code, pass, cb) => cb.onSuccess())
      return expect(resetPassword({ code: 'testCode', email: 'testEmail', password: 'testPass' })).resolves.toBeUndefined()
    })

    it('should reject if cognitoUser.confirmPassword fails', () => {
      CognitoUser.prototype.confirmPassword = jest.fn((code, pass, cb) => cb.onFailure({ message: 'testError' }))
      return expect(resetPassword({ code: 'testCode', email: 'testEmail', password: 'testPass' })).rejects.toEqual({ type: 'RESET', message: 'testError' })
    })
  })

  describe('loginUser', () => {
    it('should throw if Username or Password is missing', () => {
      return expect(loginUser({ username: '', password: '' })).rejects.toEqual(new Error('Missing Username or Password'))
    })

    it('should resolve with the value returned in onSuccess if getUserAttributes succeeds', () => {
      CognitoUser.prototype.authenticateUser = jest.fn((args, handler) => handler.onSuccess('authentication'))
      CognitoUser.prototype.getUserAttributes = jest.fn(cb => cb(null, [new MockedAttribute('email'), new MockedAttribute('custom:asset_manager_id')]))
      return expect(loginUser({ username: 'testUsername', password: 'testPassword' })).resolves.toEqual({ username: 'testUsername', email: 'testValue', assetManagerId: 'testValue' })
    })

    it('should reject with type LOGIN and value returned in onFailure if value.code !== "UserNotConfirmedException', () => {
      CognitoUser.prototype.authenticateUser = jest.fn((args, handler) => handler.onFailure({ message: 'error' }))
      const expectedResult = { type: 'LOGIN', message: 'error' }
      return expect(loginUser({ username: 'testUsername', password: 'testPassword' })).rejects.toEqual(expectedResult)
    })

    it('should reject with type VERIFY and value returned in onFailure if value.code === "UserNotConfirmedException"', () => {
      CognitoUser.prototype.authenticateUser = jest.fn((args, handler) => handler.onFailure({ code: 'UserNotConfirmedException' }))
      const expectedResult = { type: 'UNVERIFIED', message: { Username: 'testUsername', Password: 'testPassword' } }
      return expect(loginUser({ username: 'testUsername', password: 'testPassword' })).rejects.toEqual(expectedResult)
    })
  })

  describe('checkSession', () => {
    it('rejects if there is no user in session', () => {
      CognitoUserPool.prototype.getCurrentUser = jest.fn(() => null)
      return expect(checkSession()).rejects.toEqual(new Error('No user in session'))
    })

    it('rejects if getSession returns an error', () => {
      CognitoUserPool.prototype.getCurrentUser = jest.fn(() => ({ getSession: jest.fn(callback => callback('error')) }))
      return expect(checkSession()).resolves.toBeFalsy()
    })

    it('resolves if getSession does not return an error', () => {
      CognitoUserPool.prototype.getCurrentUser = jest.fn(() => ({ getSession: jest.fn(callback => callback(null, 'session')), getUserAttributes: jest.fn(cb => cb(null, [])), getUsername: jest.fn(() => 'testUser') }))
      return expect(checkSession()).resolves.toBeDefined()
    })
  })

  describe('refreshSession', () => {
    it('rejects if no user in session', () => {
      CognitoUserPool.prototype.getCurrentUser = jest.fn(() => null)
      return expect(refreshSession()).rejects.toEqual(new Error('No user in session'))
    })

    it('rejects if getSession fails', () => {
      CognitoUserPool.prototype.getCurrentUser = jest.fn(() => ({ getSession: jest.fn(cb => cb(new Error('testError'))) }))
      return expect(refreshSession()).rejects.toEqual(new Error('testError'))
    })

    it('rejects if refreshSession fails', () => {
      const mockedUser = {
        getSession: jest.fn(cb => cb(null, { getRefreshToken: jest.fn(() => 'testToken') })),
        refreshSession: jest.fn((token, cb) => cb(new Error('testError')))
      }
      CognitoUserPool.prototype.getCurrentUser = jest.fn(() => (mockedUser))
      return expect(refreshSession()).rejects.toEqual(new Error('Error refreshing session'))
    })

    it('resolves if refreshSession succeeds', () => {
      const mockedUser = {
        getSession: jest.fn(cb => cb(null, { getRefreshToken: jest.fn(() => 'testToken') })),
        refreshSession: jest.fn((token, cb) => cb(null, 'result'))
      }
      CognitoUserPool.prototype.getCurrentUser = jest.fn(() => (mockedUser))
      return expect(refreshSession()).resolves.toEqual('result')
    })
  })

  describe('changeAttribute', () => {
    it('rejects if missing parameters', () => {
      CognitoUserPool.prototype.getCurrentUser = jest.fn()
      return expect(changeAttribute({ type: 'email', attr: '' })).rejects.toEqual(new Error('Missing parameters'))
    })

    it('rejects if getSession returns an error', () => {
      const mockedUser = {
        getSession: jest.fn(cb => cb(new Error('testError'))),
        refreshSession: jest.fn((token, cb) => cb(new Error('testError')))
      }
      CognitoUserPool.prototype.getCurrentUser = jest.fn(() => mockedUser)
      return expect(changeAttribute({ type: 'email', attr: 'testEmail' })).rejects.toEqual('testError')
    })

    it('rejects if updateAttributes returns an error', () => {
      const mockedUser = {
        getSession: jest.fn(cb => cb(null, { getRefreshToken: jest.fn(() => 'testToken') })),
        updateAttributes: jest.fn((attributes, cb) => cb(new Error('testError'))),
        refreshSession: jest.fn((token, cb) => cb(null, 'result'))
      }
      CognitoUserPool.prototype.getCurrentUser = jest.fn(() => mockedUser)
      return expect(changeAttribute({ type: 'email', attr: 'testEmail' })).rejects.toEqual('testError')
    })

    it('resolves if there are no errors', () => {
      const mockedUser = {
        getSession: jest.fn(cb => cb(null, { getRefreshToken: jest.fn(() => 'testToken') })),
        updateAttributes: jest.fn((attributes, cb) => cb(null, 'testResult')),
        refreshSession: jest.fn((token, cb) => cb(null, 'result'))
      }
      CognitoUserPool.prototype.getCurrentUser = jest.fn(() => mockedUser)
      return expect(changeAttribute({ type: 'email', attr: 'testEmail' })).resolves.toEqual('testResult')
    })
  })

  describe('verifyAttribute', () => {
    it('rejects if missing parameters', () => {
      CognitoUserPool.prototype.getCurrentUser = jest.fn()
      return expect(verifyAttribute({ type: 'email', code: '' })).rejects.toEqual(new Error('Missing parameters'))
    })

    it('rejects if getSession returns an error', () => {
      const mockedUser = {
        getSession: jest.fn(cb => cb(new Error('testError'))),
        refreshSession: jest.fn((token, cb) => cb(new Error('testError')))
      }
      CognitoUserPool.prototype.getCurrentUser = jest.fn(() => mockedUser)
      return expect(verifyAttribute({ type: 'email', code: '123456' })).rejects.toEqual('testError')
    })

    it('rejects if verifyAttribute fails', () => {
      const mockedUser = {
        getSession: jest.fn(cb => cb(null, { getRefreshToken: jest.fn(() => 'testToken') })),
        verifyAttribute: jest.fn((type, code, cb) => cb.onFailure(new Error('testError')))
      }
      CognitoUserPool.prototype.getCurrentUser = jest.fn(() => mockedUser)
      return expect(verifyAttribute({ type: 'email', code: '123456' })).rejects.toEqual('testError')
    })

    it('resolves if verifyAttribute succeeds', () => {
      const mockedUser = {
        getSession: jest.fn(cb => cb(null, { getRefreshToken: jest.fn(() => 'testToken') })),
        verifyAttribute: jest.fn((type, code, cb) => cb.onSuccess('success'))
      }
      CognitoUserPool.prototype.getCurrentUser = jest.fn(() => mockedUser)
      return expect(verifyAttribute({ type: 'email', code: '123456' })).resolves.toEqual('success')
    })
  })

  describe('resendAttributeVerificatonCode', () => {
    it('rejects if missing data', () => {
      return expect(resendAttributeVerificationCode({ type: '' })).rejects.toEqual(new Error('Missing parameters'))
    })

    it('rejects if getSession fails', () => {
      const mockedUser = {
        getSession: jest.fn(cb => cb(new Error('testError')))
      }
      CognitoUserPool.prototype.getCurrentUser = jest.fn(() => mockedUser)
      return expect(resendAttributeVerificationCode({ type: 'email' })).rejects.toEqual('testError')
    })

    it('rejects if getAttributeVerificationCode fails', () => {
      const mockedUser = {
        getSession: jest.fn(cb => cb(null, { getRefreshToken: jest.fn(() => 'testToken') })),
        getAttributeVerificationCode: jest.fn((type, cb) => cb.onFailure('testError'))
      }
      CognitoUserPool.prototype.getCurrentUser = jest.fn(() => mockedUser)
      return expect(resendAttributeVerificationCode({ type: 'email' })).rejects.toEqual('testError')
    })

    it('resolves if getAttributeVerificationCode succeeds', () => {
      const mockedUser = {
        getSession: jest.fn(cb => cb(null, { getRefreshToken: jest.fn(() => 'testToken') })),
        getAttributeVerificationCode: jest.fn((tpye, cb) => cb.onSuccess('success'))
      }
      CognitoUserPool.prototype.getCurrentUser = jest.fn(() => mockedUser)
      // Since this does not resolve with a value, simply testing .resolves is sufficient
      return expect(resendAttributeVerificationCode({ type: 'email' })).resolves.toBeUndefined()
    })
  })

  describe('changePassword', () => {
    it('rejects if missing parameters', () => {
      return expect(changePassword({ oldPassword: 'testPass', Password: '' })).rejects.toEqual(new Error('Missing parameters'))
    })

    it('rejects if getSession fails', () => {
      const mockedUser = {
        getSession: jest.fn(cb => cb(new Error('testError')))
      }
      CognitoUserPool.prototype.getCurrentUser = jest.fn(() => mockedUser)
      return expect(changePassword({ oldPassword: 'testOldPass', Password: 'testNewPass' })).rejects.toEqual('testError')
    })

    it('rejects if changePassword fails', () => {
      const mockedUser = {
        getSession: jest.fn(cb => cb(null, { getRefreshToken: jest.fn(() => 'testToken') })),
        changePassword: jest.fn((oldP, newP, cb) => cb(new Error('changePasswordError')))
      }
      CognitoUserPool.prototype.getCurrentUser = jest.fn(() => mockedUser)
      return expect(changePassword({ oldPassword: 'testOldPass', Password: 'testNewPass' })).rejects.toEqual('changePasswordError')
    })

    it('resolves if no errors', () => {
      const mockedUser = {
        getSession: jest.fn(cb => cb(null, { getRefreshToken: jest.fn(() => 'testToken') })),
        changePassword: jest.fn((oldP, newP, cb) => cb(null, 'success'))
      }
      CognitoUserPool.prototype.getCurrentUser = jest.fn(() => mockedUser)
      return expect(changePassword({ oldPassword: 'testOldPass', Password: 'testNewPass' })).resolves.toEqual('success')
    })
  })
})
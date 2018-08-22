import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession
} from 'amazon-cognito-identity-js'

import cfg from '../../config'
const config = cfg()

const userPool = new CognitoUserPool({
  UserPoolId: config.userPoolId,
  ClientId: config.clientAppId
})

export function signupUser(creds: {
  username: string
  password: string
  email: string
  firstName: string
  lastName: string
}) {
  let injectedResolve: Function
  let injectedReject: Function
  return new Promise((resolve, reject) => {
    injectedResolve = resolve
    injectedReject = reject
    const {
      email,
      username: Username,
      password: Password,
      firstName,
      lastName
    } = creds
    if (!email || !Username || !Password) {
      throw new Error('Missing credentials, please try again')
    }
    let attrs: CognitoUserAttribute[] = []
    const emailAttr = new CognitoUserAttribute({
      Name: 'email',
      Value: email
    })
    const firstNameAttr = new CognitoUserAttribute({
      Name: 'given_name',
      Value: firstName
    })
    const lastNameAttr = new CognitoUserAttribute({
      Name: 'family_name',
      Value: lastName
    })
    let attributeList = attrs.concat([emailAttr, firstNameAttr, lastNameAttr])
    userPool.signUp(
      Username,
      Password,
      attributeList,
      null as any,
      (error, result) => {
        if (error) {
          injectedReject({ type: 'SIGNUP', message: error.message })
          return
        }
        injectedResolve(result)
      }
    )
  })
}

export function verifyUser(code: string, creds: { username: string }) {
  let injectedResolve: Function
  let injectedReject: Function
  return new Promise((resolve, reject) => {
    injectedResolve = resolve
    injectedReject = reject
    const { username: Username } = creds
    if (!Username || !code) {
      throw new Error('Missing Parameters')
    }
    const cognitoUser = new CognitoUser({
      Username,
      Pool: userPool
    })
    cognitoUser.confirmRegistration(code, false, (error, result) => {
      if (error) {
        injectedReject({ type: 'VERIFY', message: error.message })
        return
      }
      injectedResolve(result)
    })
  })
}

export function resendVerificationCode(creds: { username: string }) {
  let injectedResolve: Function
  let injectedReject: Function
  return new Promise((resolve, reject) => {
    injectedResolve = resolve
    injectedReject = reject
    const { username: Username } = creds
    if (!Username) {
      throw new Error('Missing credentials')
    }
    const cognitoUser = new CognitoUser({
      Username,
      Pool: userPool
    })
    cognitoUser.resendConfirmationCode((error, result) => {
      if (error) {
        injectedReject({ type: 'RESEND', message: error.message })
        return
      }
      injectedResolve(result)
    })
  })
}

export function sendForgotPassResetCode(params: { email: string }) {
  let injectedResolve: Function
  let injectedReject: Function
  return new Promise((resolve, reject) => {
    injectedResolve = resolve
    injectedReject = reject
    const { email } = params
    if (!email) {
      throw new Error('Missing email address')
    }
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    })
    cognitoUser.forgotPassword({
      onSuccess: () => injectedResolve(),
      onFailure: error =>
        injectedReject({ type: 'FORGOT', message: error.message })
    })
  })
}

export function resetPassword(params: {
  code: string
  email: string
  password: string
}) {
  let injectedResolve: Function
  let injectedReject: Function
  return new Promise((resolve, reject) => {
    injectedResolve = resolve
    injectedReject = reject
    const { code, password, email } = params
    if (!code || !password || !email) {
      throw new Error('Both code and new password must be supplied')
    }
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    })
    cognitoUser.confirmPassword(code, password, {
      onSuccess: () => injectedResolve(),
      onFailure: error =>
        injectedReject({ type: 'RESET', message: error.message })
    })
  })
}

export function loginUser({
  username,
  password
}: {
  username: string
  password: string
}) {
  const Username = username
  const Password = password
  let injectedResolve: Function
  let injectedReject: Function
  return new Promise((resolve, reject) => {
    injectedResolve = resolve
    injectedReject = reject
    if (!Username || !Password) {
      throw new Error('Missing Username or Password')
    }
    const authenticationDetails = new AuthenticationDetails({
      Username,
      Password
    })
    const cognitoUser = new CognitoUser({
      Username,
      Pool: userPool
    })
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: result => {
        cognitoUser.getUserAttributes((error, result) => {
          if (result) {
            const username = cognitoUser.getUsername()
            const emailAttribute = result.filter(
              attr => attr.getName() == 'email'
            )[0]
            const email = emailAttribute ? emailAttribute.getValue() : ''
            const amAttribute = result.filter(
              attr => attr.getName() == 'custom:asset_manager_id'
            )[0]
            const assetManagerId = amAttribute ? amAttribute.getValue() : ''
            injectedResolve({ username, email, assetManagerId })
          } else {
            console.error(error)
          }
        })
      },
      onFailure: error => {
        if (error.code === 'UserNotConfirmedException') {
          const creds = { Username, Password }
          injectedReject({ type: 'UNVERIFIED', message: creds })
        } else {
          injectedReject({ type: 'LOGIN', message: error.message })
        }
      }
    })
  })
}

export function refreshSession() {
  let injectedResolve: Function
  let injectedReject: Function
  return new Promise((resolve, reject) => {
    injectedResolve = resolve
    injectedReject = reject
    const cognitoUser = userPool.getCurrentUser()
    if (!cognitoUser) return injectedReject(new Error('No user in session'))
    cognitoUser.getSession((error: Error, session: CognitoUserSession) => {
      if (error) return injectedReject(new Error(error.message))
      const rToken = session.getRefreshToken()
      cognitoUser.refreshSession(rToken, (error, result) => {
        if (error) return injectedReject(new Error('Error refreshing session'))
        injectedResolve(result)
      })
    })
  })
}

export function logoutUser() {
  const cognitoUser = userPool.getCurrentUser()
  if (!cognitoUser) return
  return cognitoUser.signOut()
}

export function checkSession() {
  let injectedResolve: Function
  let injectedReject: Function
  return new Promise((resolve, reject) => {
    injectedResolve = resolve
    injectedReject = reject
    const cognitoUser = userPool.getCurrentUser()
    if (!cognitoUser) return injectedReject(new Error('No user in session'))
    cognitoUser.getSession((error: Error, session: CognitoUserSession) => {
      if (error) return injectedResolve(false)
      cognitoUser.getUserAttributes((error, result) => {
        if (result) {
          const username = cognitoUser.getUsername()
          const emailAttribute = result.filter(
            attr => attr.getName() == 'email'
          )[0]
          const email = emailAttribute ? emailAttribute.getValue() : ''
          const amAttribute = result.filter(
            attr => attr.getName() == 'custom:asset_manager_id'
          )[0]
          const assetManagerId = amAttribute ? amAttribute.getValue() : ''
          injectedResolve({ username, email, assetManagerId })
        } else {
          injectedReject(new Error('Error checking Session (getUserAttributes'))
        }
      })
    })
  })
}

export function changeAttribute(params: { type: string; attr: string }) {
  let injectedResolve: Function
  let injectedReject: Function
  const { type, attr } = params
  return new Promise((resolve, reject) => {
    injectedResolve = resolve
    injectedReject = reject
    if (!type || !attr) {
      throw new Error('Missing parameters')
    }
    const cognitoUser = userPool.getCurrentUser()
    if (cognitoUser) {
      cognitoUser.getSession((error: Error, result: CognitoUserSession) => {
        if (error) {
          injectedReject(error.message)
          return
        }
        let attributeList = []
        const attribute = { Name: type, Value: attr }
        attributeList.push(attribute)
        cognitoUser.updateAttributes(attributeList, (error, result) => {
          if (error) {
            injectedReject(error.message)
            return
          }
          injectedResolve(result)
        })
      })
    }
  })
}

export function verifyAttribute(params: { type: string; code: string }) {
  let injectedResolve: Function
  let injectedReject: Function
  const { type, code } = params
  return new Promise((resolve, reject) => {
    injectedResolve = resolve
    injectedReject = reject
    if (!type || !code) {
      throw new Error('Missing parameters')
    }
    const cognitoUser = userPool.getCurrentUser()
    if (cognitoUser) {
      cognitoUser.getSession((error: Error, result: CognitoUserSession) => {
        if (error) {
          injectedReject(error.message)
          return
        }
        cognitoUser.verifyAttribute(type, code, {
          onSuccess: result => injectedResolve(result),
          onFailure: error => injectedReject(error.message)
        })
      })
    }
  })
}

export function resendAttributeVerificationCode(params: { type: string }) {
  let injectedResolve: Function
  let injectedReject: Function
  const { type } = params
  return new Promise((resolve, reject) => {
    injectedResolve = resolve
    injectedReject = reject
    if (!type) {
      throw new Error('Missing parameters')
    }
    const cognitoUser = userPool.getCurrentUser()
    if (cognitoUser) {
      cognitoUser.getSession((error: Error, result: CognitoUserSession) => {
        if (error) {
          injectedReject(error.message)
          return
        }
        cognitoUser.getAttributeVerificationCode(type, {
          onSuccess: () => injectedResolve(),
          onFailure: error => injectedReject(error),
          inputVerificationCode: null as any
        })
      })
    }
  })
}

export function changePassword(params: {
  oldPassword: string
  Password: string
}) {
  let injectedResolve: Function
  let injectedReject: Function
  const { oldPassword, Password } = params
  return new Promise((resolve, reject) => {
    injectedResolve = resolve
    injectedReject = reject
    if (!oldPassword || !Password) {
      throw new Error('Missing parameters')
    }
    const cognitoUser = userPool.getCurrentUser()
    if (cognitoUser) {
      cognitoUser.getSession((error: Error, result: CognitoUserSession) => {
        if (error) return injectedReject(error.message)
        cognitoUser.changePassword(oldPassword, Password, (error, result) => {
          if (error) return injectedReject(error.message)
          injectedResolve(result)
        })
      })
    }
  })
}

import { delay } from 'redux-saga'
import {
  all,
  call,
  cancel,
  fork,
  put,
  race,
  select,
  take
} from 'redux-saga/effects'
import { cloneableGenerator, createMockTask } from 'redux-saga/utils'
import { api } from '@amaas/amaas-core-sdk-js'
jest.mock('zE')

import {
  checkSessionSaga,
  checkSessionSagaLoop,
  domainCheckerSaga,
  domainFlowSaga,
  forgotPasswordSaga,
  initiateSignupSaga,
  loginSaga,
  logoutSaga,
  resetPasswordSaga,
  signupSaga,
  verifySaga,
  assumableAMIDSaga,
  sessionInterval,
  zendeskIdentify
} from './'
import {
  checkSession,
  loginUser,
  logoutUser,
  refreshSession,
  resetPassword,
  sendForgotPassResetCode,
  signupUser,
  verifyUser
} from 'utils/auth'
import { sessionSelector } from 'selectors'

import { NEWCOMPANY_SUCCESS } from 'actions/newCompany/types'

// Auth
import {
  authFailed,
  authSuccess,
  loginSuccess,
  loginFailed,
  logoutSuccess,
  requestLogin,
  requestLogout
} from 'actions/session'
import { REQUEST_LOGIN, REQUEST_LOGOUT } from 'actions/session/types'
import { disconnectWS } from 'actions/pubsub'

// Signup
import { signupFailed, signupSuccess } from 'actions/signup'
import { REQUEST_SIGNUP, CANCEL_SIGNUP } from 'actions/signup/types'

// Verify
import { verifySuccess, verifyFailed } from 'actions/verify'
import { REQUEST_VERIFY, VERIFY_SUCCESS } from 'actions/verify/types'

// Domain
import { checkDomainSuccess, checkDomainFailed } from 'actions/checkDomain'
import { REQUEST_CHECKDOMAIN } from 'actions/checkDomain/types'

// Forgot
import { forgotFailed, forgotReset, forgotSuccess } from 'actions/forgot'
import { REQUEST_FORGOT } from 'actions/forgot/types'

// Reset
import { resetPassFailed, resetPassSuccess } from 'actions/reset'
import { REQUEST_RESET_PASS } from 'actions/reset/types'

const mockedHistory = {
  push: jest.fn()
}

declare global {
  interface Window {
    zE: any
  }
}

describe('initiateSignupSaga', () => {
  let gen, action, mockTask
  beforeAll(() => {
    mockTask = createMockTask()
    action = { type: REQUEST_SIGNUP, payload: { history: 'history' } }
    gen = initiateSignupSaga(action)
  })
  it('yields race', () => {
    const yielded = gen.next().value
    expect(yielded).toEqual(
      race({ signup: fork(signupSaga, action), cancel: take(CANCEL_SIGNUP) })
    )
  })

  it('puts requestLogout if cancelled', () => {
    const putted = gen.next({ cancel: true, signup: false }).value
    expect(putted).toEqual(put(requestLogout({ history: 'history' })))
  })
})

describe('domainFlowSaga', () => {
  let gen, action, mockTask
  beforeAll(() => {
    mockTask = createMockTask()
    action = { type: REQUEST_CHECKDOMAIN, payload: { history: 'history' } }
    gen = domainFlowSaga(action)
  })
  it('yields race', () => {
    const raced = gen.next().value
    expect(raced).toEqual(
      race({
        domain: fork(domainCheckerSaga, action),
        cancel: take(CANCEL_SIGNUP)
      })
    )
  })

  it('puts requestLogout if cancelled', () => {
    const cancelled = gen.next({ domain: false, cancel: true }).value
    expect(cancelled).toEqual(put(requestLogout({ history: 'history' })))
  })
})

describe('signupSaga', () => {
  let gen, action
  beforeAll(() => {
    action = {
      type: REQUEST_SIGNUP,
      payload: {
        email: 'testEmail@domain.com',
        password: 'testPass',
        firstName: ' testFirstName ',
        lastName: ' testLastName ',
        history: mockedHistory
      }
    }
    gen = signupSaga(action)
  })

  it('yields a username', () => {
    const yielded = gen.next().value
    expect(yielded).toEqual('testEmail.domain.com')
  })

  it('calls signupUser', () => {
    const called = gen.next('testEmail.domain.com').value
    expect(called).toEqual(
      call(signupUser, {
        username: 'testEmail.domain.com',
        password: 'testPass',
        email: 'testEmail@domain.com',
        firstName: 'testFirstName',
        lastName: 'testLastName'
      })
    )
  })

  it('puts signupSuccess', () => {
    const putted = gen.next().value
    expect(putted).toEqual(put(signupSuccess()))
  })

  it('redirects', () => {
    const redirect = gen.next().value
    expect(redirect).toEqual(
      call(mockedHistory.push, '/a-p/verify/testEmail.domain.com')
    )
  })

  it('waits for verifySuccess', () => {
    const taken = gen.next().value
    expect(taken).toEqual(take(VERIFY_SUCCESS))
  })

  it('puts requestLogin', () => {
    const putted = gen.next().value
    expect(putted).toEqual(
      put(
        requestLogin({
          username: 'testEmail.domain.com',
          password: 'testPass',
          history: mockedHistory,
          nextPath: {
            pathname: '/a-a/domain-check',
            state: { domain: 'domain.com' }
          }
        })
      )
    )
  })

  it('puts signupFailed on throw', () => {
    const thrown = gen.throw({ message: 'testError' }).value
    expect(thrown).toEqual(put(signupFailed('testError')))
  })
})

describe('domainCheckerSaga', () => {
  let gen, payload, action
  beforeAll(() => {
    payload = {
      domain: 'testDomain',
      history: mockedHistory
    }
    action = {
      type: REQUEST_CHECKDOMAIN,
      payload
    }
    gen = domainCheckerSaga(action)
  })

  it('calls api.AssetManagers.insert', () => {
    const called = gen.next().value
    expect(called).toEqual(
      call(api.AssetManagers.insert, {
        assetManager: { assetManagerType: 'Individual' }
      })
    )
  })

  it('calls refreshSession', () => {
    const called = gen.next().value
    expect(called).toEqual(call(refreshSession))
  })

  it('calls checkSession', () => {
    const called = gen.next().value
    expect(called).toEqual(call(checkSession))
  })

  it('puts authSuccess', () => {
    const putted = gen.next('newSession').value
    expect(putted).toEqual(put(authSuccess('newSession')))
  })

  it('calls api.AssetManagers.checkDomains', () => {
    const called = gen.next().value
    expect(called).toEqual(
      call(api.AssetManagers.checkDomains, { domain: payload.domain })
    )
  })

  it('puts checkDomainSuccess', () => {
    const putted = gen.next([{ assetManagerId: 1 }]).value
    expect(putted).toEqual(
      put(checkDomainSuccess({ persist: true, amidToJoin: 1 }))
    )
  })

  it('redirects to join-company if result is truthy', () => {
    const redirect = gen.next().value
    expect(redirect).toEqual(
      call(mockedHistory.push, { pathname: '/a-a/join-company' })
    )
  })

  it('puts checkDomainFailed on error', () => {
    const thrown = gen.throw('testError').value
    expect(thrown).toEqual(put(checkDomainFailed('testError')))
  })
})

describe('loginSaga', () => {
  let data: any = {}
  let payload, action
  beforeAll(() => {
    payload = {
      username: 'testUser',
      password: 'testPass',
      history: mockedHistory,
      nextPath: 'testPath/path'
    }
    action = {
      type: REQUEST_LOGIN,
      payload
    }
    data.gen = cloneableGenerator(loginSaga)(action)
    window.zE = {
      hide: jest.fn()
    }
  })

  it('calls loginUser', () => {
    const yielded = data.gen.next().value
    data.loginError = data.gen.clone()
    data.unverified = data.gen.clone()
    expect(yielded).toEqual(
      call(loginUser, { username: 'testUser', password: 'testPass' })
    )
  })

  it('yields loginFailed if loginUser throws/rejects', () => {
    const thrown = data.loginError.throw('Error').value
    expect(thrown).toEqual(put(loginFailed('Error')))
  })

  it('redirects if err.type is UNVERIFIED', () => {
    const redirected = data.unverified.throw({ type: 'UNVERIFIED' }).value
    expect(redirected).toEqual(call(mockedHistory.push, '/a-p/verify/testUser'))
  })

  it('calls getRelatedAMID', () => {
    const called = data.gen.next({ assetManagerId: 1 }).value
    expect(called).toEqual(call(api.Relationships.getRelatedAMID, { AMId: 1 }))
  })

  it('yields all party APIs to fetch', () => {
    const yielded = data.gen.next([
      {
        assetManagerId: 8,
        relationshipStatus: 'Active',
        relationshipType: 'Employee'
      }
    ]).value
    const fields = ['assetManagerId', 'partyId', 'displayName', 'description']
    const expectedResult = [
      call(api.Parties.fieldsSearch, {
        AMId: 8,
        query: { partyIds: 'AMID8', fields }
      }),
      call(api.Parties.fieldsSearch, {
        AMId: 1,
        query: { partyIds: 'AMID1', fields }
      })
    ]
    expect(yielded).toEqual(all(expectedResult))
  })

  it('puts loginSuccess with the yield from loginUser', () => {
    data.noParents = data.gen.clone()
    const putted = data.gen.next([
      [
        {
          assetManagerId: 8,
          displayName: 'test company'
        }
      ],
      [
        {
          assetManagerId: 1,
          description: 'test full name'
        }
      ]
    ]).value
    expect(putted).toEqual(put(loginSuccess({ assetManagerId: 1 })))
  })

  it('redirects', () => {
    const redirect = data.gen.next().value
    expect(redirect).toEqual(call(mockedHistory.push, 'testPath/path'))
  })

  it('puts loginFailed if loginUser throws', () => {
    data.noRels = data.gen.clone()
    expect(data.gen.throw('Error').value).toEqual(put(loginFailed('Error')))
  })

  it('hides zendesk widget', () => {
    const called = data.gen.next().value
    expect(called).toEqual(call(window.zE.hide))
  })

  it('disconnects WS', () => {
    const putted = data.gen.next().value
    expect(putted).toEqual(put(disconnectWS()))
  })

  it('then calls logoutUser', () => {
    const called = data.gen.next().value
    expect(called).toEqual(call(logoutUser))
  })

  it('then puts logoutSuccess', () => {
    const putted = data.gen.next().value
    expect(putted).toEqual(put(logoutSuccess()))
  })

  /* If there are no relationships */
  it('redirects if err.message is NORELS', () => {
    const thrown = data.noRels.throw({ message: 'NORELS' }).value
    expect(thrown).toEqual(put(loginFailed('NORELS')))
  })

  it('hides zendesk widget', () => {
    const called = data.noRels.next().value
    expect(called).toEqual(call(window.zE.hide))
  })
})

describe('assumableAMIDSaga', () => {
  let data: any = {}
  beforeAll(() => {
    data.gen = cloneableGenerator(assumableAMIDSaga)({ assetManagerId: 1 })
    data.noAMId = cloneableGenerator(assumableAMIDSaga)({ assetManagerId: '' })
  })
  it('returns empty array if received no AMID', () => {
    const returned = data.noAMId.next().value
    expect(returned).toEqual([])
  })

  it('calls getRelatedAMID', () => {
    const called = data.gen.next({ assetManagerId: 1 }).value
    expect(called).toEqual(call(api.Relationships.getRelatedAMID, { AMId: 1 }))
  })

  it('yields all party APIs to fetch', () => {
    const yielded = data.gen.next([
      {
        assetManagerId: 5,
        relationshipStatus: 'Active',
        relationshipType: 'Administrator'
      },
      {
        assetManagerId: 8,
        relationshipStatus: 'Active',
        relationshipType: 'Employee'
      }
    ]).value
    const fields = ['assetManagerId', 'partyId', 'displayName', 'description']
    const expectedResult = [
      call(api.Parties.fieldsSearch, {
        AMId: 5,
        query: { partyIds: 'AMID5', fields }
      }),
      call(api.Parties.fieldsSearch, {
        AMId: 8,
        query: { partyIds: 'AMID8', fields }
      }),
      call(api.Parties.fieldsSearch, {
        AMId: 1,
        query: { partyIds: 'AMID1', fields }
      })
    ]
    expect(yielded).toEqual(all(expectedResult))
  })

  it('returns', () => {
    const expectedResult = [
      {
        assetManagerId: 1,
        relationshipStatus: 'Active',
        relationshipType: undefined,
        name: 'test name'
      },
      {
        assetManagerId: 5,
        relationshipStatus: 'Active',
        relationshipType: 'Administrator',
        name: 'test company 5'
      },
      {
        assetManagerId: 8,
        relationshipStatus: 'Active',
        relationshipType: 'Employee',
        name: 'test company 8'
      }
    ]
    const returned = data.gen.next([
      [{ assetManagerId: 1, description: 'test name' }],
      [{ assetManagerId: 5, displayName: 'test company 5' }],
      [{ assetManagerId: 8, displayName: 'test company 8' }]
    ]).value
    expect(returned).toEqual(expect.arrayContaining(expectedResult))
  })
})

describe('verifySaga', () => {
  let gen
  beforeAll(() => {
    const action = {
      type: REQUEST_VERIFY,
      payload: {
        code: 'testCode',
        username: 'testUser',
        history: mockedHistory
      }
    }
    gen = verifySaga(action)
  })

  it('calls verifyUser', () => {
    const calledVerified = gen.next().value
    expect(calledVerified).toEqual(
      call(verifyUser, 'testCode', { username: 'testUser' })
    )
  })

  it('puts verifySuccess', () => {
    const putted = gen.next().value
    expect(putted).toEqual(put(verifySuccess()))
  })

  it('puts verifyFailed on error', () => {
    const thrown = gen.throw('testError').value
    expect(thrown).toEqual(put(verifyFailed('testError')))
  })
})

describe('forgotPasswordSaga', () => {
  let gen, payload
  beforeAll(() => {
    const action = {
      type: REQUEST_FORGOT,
      payload: {
        email: 'testEmail'
      }
    }
    gen = forgotPasswordSaga(action)
  })

  it('calls sendForgotPassResetCode', () => {
    const called = gen.next().value
    expect(called).toEqual(
      call(sendForgotPassResetCode, { email: 'testEmail' })
    )
  })

  it('puts forgotSuccess', () => {
    const putted = gen.next().value
    expect(putted).toEqual(put(forgotSuccess()))
  })

  it('puts forgotFailed on error', () => {
    const thrown = gen.throw({ message: 'testError' }).value
    expect(thrown).toEqual(put(forgotFailed('testError')))
  })
})

describe('resetPasswordSaga', () => {
  let gen, mockedHistory
  beforeAll(() => {
    mockedHistory = {
      push: jest.fn()
    }
    const action = {
      type: REQUEST_FORGOT,
      payload: {
        code: 'testCode',
        email: 'testEmail',
        password: 'testPass',
        history: mockedHistory
      }
    }
    gen = resetPasswordSaga(action)
  })

  it('calls resetPassword', () => {
    const called = gen.next().value
    expect(called).toEqual(
      call(resetPassword, {
        code: 'testCode',
        email: 'testEmail',
        password: 'testPass'
      })
    )
  })

  it('puts resetPassSuccess', () => {
    const putted = gen.next().value
    expect(putted).toEqual(put(resetPassSuccess()))
  })

  it('puts forgotReset', () => {
    const putted = gen.next().value
    expect(putted).toEqual(put(forgotReset()))
  })

  it('calls history.push with /a-p/login/reset', () => {
    const called = gen.next().value
    expect(called).toEqual(call(mockedHistory.push, '/a-p/login/reset'))
  })

  it('puts resetPassFailed on error', () => {
    const thrown = gen.throw({ message: 'testError' }).value
    expect(thrown).toEqual(put(resetPassFailed('testError')))
  })
})

describe('logoutSaga', () => {
  let gen, mockedHistory
  beforeAll(() => {
    mockedHistory = { push: jest.fn() }
    const action = {
      type: REQUEST_LOGOUT,
      payload: {
        history: mockedHistory
      }
    }
    gen = logoutSaga(action)
    window.zE = {
      hide: jest.fn()
    }
  })
  it('hides zendesk widget', () => {
    const called = gen.next().value
    expect(called).toEqual(call(window.zE.hide))
  })
  it('calls disconnectWS', () => {
    expect(gen.next().value).toEqual(put(disconnectWS()))
  })

  it('calls logoutUser', () => {
    expect(gen.next().value).toEqual(call(logoutUser))
  })

  it('puts logoutSuccess', () => {
    expect(gen.next().value).toEqual(put(logoutSuccess()))
  })

  it('redirects', () => {
    const redirected = gen.next().value
    expect(redirected).toEqual(call(mockedHistory.push, '/a-p/'))
  })
})

describe('checkSessionSaga', () => {
  let data: any = {}
  beforeAll(() => {
    // ({ type: 'testType', payload: {} })
    data.gen = cloneableGenerator(checkSessionSaga)({
      type: 'testType',
      payload: {}
    })
    window.zE = {
      hide: jest.fn()
    }
  })

  it('calls select on state', () => {
    expect(data.gen.next().value).toEqual(select(sessionSelector))
  })

  it('calls checkSession if session.authenticated is true', () => {
    const session = data.gen.next({ authenticated: true }).value
    expect(session).toEqual(call(checkSession))
  })

  it('calls getRelatedAMID if value is true', () => {
    data.sessionValidity = data.gen.clone()
    const called = data.sessionValidity.next({
      assetManagerId: 1,
      username: 'testUsername',
      email: 'testEmail'
    }).value
    expect(called).toEqual(call(api.Relationships.getRelatedAMID, { AMId: 1 }))
  })

  it('yields all party APIs to fetch', () => {
    const yielded = data.sessionValidity.next([
      {
        assetManagerId: 8,
        relationshipStatus: 'Active',
        relationshipType: 'Employee'
      }
    ]).value
    const fields = ['assetManagerId', 'partyId', 'displayName', 'description']
    const expectedResult = [
      call(api.Parties.fieldsSearch, {
        AMId: 8,
        query: { partyIds: 'AMID8', fields }
      }),
      call(api.Parties.fieldsSearch, {
        AMId: 1,
        query: { partyIds: 'AMID1', fields }
      })
    ]
    expect(yielded).toEqual(all(expectedResult))
  })

  it('calls zendeskIdentify', () => {
    const called = data.sessionValidity.next([
      [
        {
          assetManagerId: 8,
          displayName: 'test company'
        }
      ],
      [
        {
          assetManagerId: 1,
          description: 'test name'
        }
      ]
    ]).value
    expect(called).toEqual(call(zendeskIdentify, 'testUsername', 'testEmail'))
  })

  it('puts authSuccess if valid is true', () => {
    data.noRels = data.sessionValidity.clone()
    expect(data.sessionValidity.next().value).toEqual(
      put(
        authSuccess({
          assetManagerId: 1,
          email: 'testEmail',
          username: 'testUsername',
          assumableAMIDs: [
            {
              assetManagerId: 8,
              relationshipStatus: 'Active',
              relationshipType: 'Employee',
              name: 'test company'
            },
            {
              assetManagerId: 1,
              relationshipStatus: 'Active',
              relationshipType: undefined,
              name: 'test name'
            }
          ]
        })
      )
    )
  })

  it('puts authFailed if valid is false', () => {
    const putted = data.gen.next(false).value
    expect(putted).toEqual(put(authFailed()))
  })

  it('hides zendesk widget', () => {
    const called = data.gen.next().value
    expect(called).toEqual(call(window.zE.hide))
  })

  it('yields logoutSaga', () => {
    const yielded = data.gen.next().value
    expect(yielded).toEqual(put(disconnectWS()))
  })

  it('puts authFailed on thrown error', () => {
    expect(data.gen.throw('Error').value).toEqual(put(authFailed()))
  })

  it('yields logoutSaga', () => {
    const logout = data.gen.next().value
    expect(logout).toEqual(call(window.zE.hide))
  })
})

describe('checkSessionSagaLoop', () => {
  let data: any = {},
    mockedHistory
  beforeAll(() => {
    mockedHistory = { push: jest.fn() }
    const action = {
      type: 'testType',
      payload: {
        history: mockedHistory
      }
    }
    data.gen = cloneableGenerator(checkSessionSagaLoop)(action)
  })

  it('selects session', () => {
    const selected = data.gen.next().value
    expect(selected).toEqual(select(sessionSelector))
  })

  it('skips to delay if authenticated state is false', () => {
    data.authenticated = data.gen.clone()
    const called = data.gen.next({ authenticated: false }).value
    expect(called).toEqual(call(delay, sessionInterval))
  })

  it('calls checkSession if authenticated is true', () => {
    const called = data.authenticated.next({ authenticated: true }).value
    expect(called).toEqual(call(checkSession))
  })
})

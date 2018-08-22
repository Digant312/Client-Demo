import uniqBy from 'lodash/uniqBy'
import { Action } from 'redux'
import {
  all,
  call,
  cancel,
  fork,
  put,
  race,
  select,
  take,
  takeLatest
} from 'redux-saga/effects'
import {
  checkSession,
  loginUser,
  logoutUser,
  refreshSession,
  resendVerificationCode,
  resetPassword,
  sendForgotPassResetCode,
  signupUser,
  verifyUser
} from 'utils/auth'
import { delay } from 'redux-saga'
import uuid from 'uuid/v4'
import { api, assetManagers, relationships } from '@amaas/amaas-core-sdk-js'
import { History, Location } from 'history'

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
import {
  REQUEST_AUTHENTICATION,
  REQUEST_LOGIN,
  REQUEST_LOGOUT
} from 'actions/session/types'
import { sessionSelector } from 'selectors'
import { disconnectWS } from 'actions/pubsub'

// Signup
import { signupFailed, signupSuccess } from 'actions/signup'
import { REQUEST_SIGNUP, CANCEL_SIGNUP } from 'actions/signup/types'

// Verify
import {
  verifyFailed,
  verifySuccess,
  resendSuccess,
  resendFailed
} from 'actions/verify'
import {
  REQUEST_VERIFY,
  VERIFY_SUCCESS,
  REQUEST_RESEND
} from 'actions/verify/types'

// Check Domain
import { checkDomainSuccess, checkDomainFailed } from 'actions/checkDomain'
import { REQUEST_CHECKDOMAIN } from 'actions/checkDomain/types'

// Forgot
import { forgotFailed, forgotSuccess, forgotReset } from 'actions/forgot'
import { REQUEST_FORGOT } from 'actions/forgot/types'

// Reset
import { resetPassFailed, resetPassSuccess } from 'actions/reset'
import { REQUEST_RESET_PASS } from 'actions/reset/types'

// NewCompany
import { NEWCOMPANY_SUCCESS } from 'actions/newCompany/types'

import { getAMId } from 'sagas/data'

export const sessionInterval = 3600000

interface IAction extends Action {
  payload: any
}

export function* initiateSignupSaga(action: IAction) {
  const { history } = action.payload
  const { signup, cancel } = yield race({
    signup: fork(signupSaga, action),
    cancel: take(CANCEL_SIGNUP)
  })

  if (cancel) {
    yield put(requestLogout({ history }))
  }
}

export function* signupSaga(action: IAction) {
  let { email, password, firstName, lastName, history } = action.payload
  firstName = firstName.trim()
  lastName = lastName.trim()

  const emailLocal = email.split('@')[0]
  const emailDomain = email.split('@')[1]
  const username = yield `${emailLocal}.${emailDomain}`
  try {
    // 0. Kick off
    yield call(signupUser, { username, password, email, firstName, lastName })
    console.log('%c SIGNING UP...', 'color: #f4aa42')

    yield put(signupSuccess())
    console.log('%c SIGNED UP', 'color: #338225')
    yield call(history.push, `/a-p/verify/${username}`)

    // 1. Wait for successful verification action
    console.log('%c VERIFYING...', 'color: #f4aa42')
    yield take(VERIFY_SUCCESS)
    console.log('%c SUCCESSFULLY VERIFIED', 'color: #338225')

    // 2. Request login and then redirect to the domain checker
    yield put(
      requestLogin({
        username,
        password,
        history,
        nextPath: {
          pathname: '/a-a/domain-check',
          state: { domain: `${email.split('@')[1]}` }
        }
      })
    )
  } catch (e) {
    yield put(signupFailed(e.message || e))
  }
}

export function* domainFlowSaga(action: IAction) {
  const { history } = action.payload

  const { domain, cancel } = yield race({
    domain: fork(domainCheckerSaga, action),
    cancel: take(CANCEL_SIGNUP)
  })

  if (cancel) {
    yield put(requestLogout({ history }))
  }
}

export function* domainCheckerSaga(action: IAction) {
  const { domain, history } = action.payload
  try {
    console.log('%c CREATING NEW ASSET MANAGER...', 'color: #f4aa42')
    const am = yield call(api.AssetManagers.insert, {
      assetManager: { assetManagerType: 'Individual' }
    })

    yield call(refreshSession)
    let newSession = yield call(checkSession)
    if (!newSession) {
      put(checkDomainFailed('No session'))
      return
    }
    yield put(authSuccess(newSession))

    console.log('%c CHECKING EMAIL DOMAIN FOR COMPANIES...', 'color: #f4aa42')
    const result = yield call(api.AssetManagers.checkDomains, { domain })
    if (result.length > 0) {
      yield put(
        checkDomainSuccess({
          persist: true,
          amidToJoin: result[0].assetManagerId
        })
      )
      console.log(
        '%c RECORD FOUND, DIRECT TO JOIN COMPANY PAGE',
        'color: #338225'
      )
      yield call(history.push, { pathname: '/a-a/join-company' })
    } else {
      yield put(checkDomainSuccess({ persist: false }))
      console.log(
        '%c NO RECORDS FOUND, DIRECT TO NEW COMPANY PAGE',
        'color: #f91400'
      )
      yield call(history.push, {
        pathname: '/a-a/new-company',
        state: { domain }
      })
    }
  } catch (e) {
    yield put(checkDomainFailed(e.message || e))
  }
}

export function* loginSaga(action: IAction) {
  const { username, password, history, nextPath } = action.payload
  let profile
  try {
    profile = yield call(loginUser, { username, password })
  } catch (err) {
    if (err.type === 'UNVERIFIED') {
      yield call(history.push, `/a-p/verify/${username}`)
      return
    }
    yield put(loginFailed(err.message || err))
    return
  }
  try {
    const assumableAMIDs = yield* assumableAMIDSaga(profile)
    yield put(loginSuccess({ ...profile }))
    yield call(history.push, nextPath)
  } catch (err) {
    yield put(loginFailed(err.message || err))
    yield* logoutSaga(action)
    if (err.message === 'NORELS') {
      yield call(history.push, '/a-p/login/rel')
    } else {
      yield call(history.push, '/a-p/login')
    }
  }
}

export function* assumableAMIDSaga(profile: {
  assetManagerId?: number | string
}) {
  if (!profile.assetManagerId) return []
  let parents = yield call(api.Relationships.getRelatedAMID, {
    AMId: profile.assetManagerId
  })
  parents = parents.filter(
    (parent: relationships.Relationship) =>
      parent.relationshipStatus === 'Active'
  )
  parents = parents.concat({
    assetManagerId: parseInt(`${profile.assetManagerId}`),
    relationshipStatus: 'Active'
  })

  /* get names */

  // Get the array of calls to fetch party info for each AMID
  const partyList = uniqBy(
    parents,
    'assetManagerId'
  ).map((parent: { assetManagerId: number }) =>
    call(api.Parties.fieldsSearch, {
      AMId: parent.assetManagerId,
      query: {
        partyIds: `AMID${parent.assetManagerId}`,
        fields: ['assetManagerId', 'partyId', 'displayName', 'description']
      }
    })
  )
  let partyNames = yield all(partyList)
  partyNames = partyNames.map((party: any[]) => party[0])
  /* get names */

  return parents.map((rel: relationships.Relationship) => {
    const { displayName, description } = partyNames.find(
      (party: { assetManagerId: number }) =>
        party.assetManagerId === rel.assetManagerId
    )
    return {
      assetManagerId: rel.assetManagerId,
      relationshipStatus: rel.relationshipStatus,
      relationshipType: rel.relationshipType,
      name: displayName || description
    }
  })
}

export function* verifySaga(action: IAction) {
  const { code, username, history } = action.payload
  try {
    /* REMOVE FOR DEV */
    yield call(verifyUser, code, { username })

    yield put(verifySuccess())
  } catch (e) {
    yield put(verifyFailed(e.message || e))
  }
}

export function* resendVerificationCodeSaga(action: IAction) {
  const { username } = action.payload
  try {
    yield call(resendVerificationCode, { username })
    yield put(resendSuccess())
  } catch (e) {
    yield put(resendFailed(e.message || e))
  }
}

export function* forgotPasswordSaga(action: IAction) {
  const { email } = action.payload
  try {
    yield call(sendForgotPassResetCode, { email })
    yield put(forgotSuccess())
  } catch (e) {
    yield put(forgotFailed(e.message || e))
  }
}

export function* resetPasswordSaga(action: IAction) {
  const { code, email, password, history } = action.payload
  try {
    yield call(resetPassword, { code, email, password })
    yield put(resetPassSuccess())
    yield put(forgotReset())
    yield call(history.push, '/a-p/login/reset')
  } catch (e) {
    yield put(resetPassFailed(e.message || e))
  }
}

export function* logoutSaga(action: IAction) {
  try {
    yield call(window.zE.hide)
  } catch (e) {
    console.error(e)
  }
  yield put(disconnectWS())
  yield call(logoutUser)
  yield put(logoutSuccess())
  if (action.payload.history) {
    const { history } = action.payload
    yield call(history.push, '/a-p/')
  }
}

export function* checkSessionSaga(action: IAction) {
  let session = yield select(sessionSelector)
  if (session.authenticated) {
    try {
      let valid = yield call(checkSession)
      if (valid) {
        const assumableAMIDs = yield* assumableAMIDSaga(valid)

        yield call(zendeskIdentify, valid.username, valid.email)

        yield put(authSuccess({ ...valid, assumableAMIDs }))
      } else {
        console.log('checkSession returned false')
        yield put(authFailed())
        yield* logoutSaga(action)
      }
    } catch (e) {
      console.log('Error thrown in saga:', e)
      yield put(authFailed())
      yield* logoutSaga(action)
    }
  }
}

export function* zendeskIdentify(username: string, email: string) {
  try {
    yield call(window.zE.identify, {
      name: username,
      email
    })
    yield call(window.zE.show)
    return
  } catch (err) {
    console.error(err)
  }
}

export function* checkSessionSagaLoop(action: IAction) {
  while (true) {
    yield* checkSessionSaga(action)
    yield call(delay, sessionInterval)
  }
}

/* This is a helper export to make combining all sagas in the rootSaga easier */
export default [
  takeLatest(REQUEST_SIGNUP, initiateSignupSaga),
  takeLatest(REQUEST_LOGIN, loginSaga),
  takeLatest(REQUEST_LOGOUT, logoutSaga),
  takeLatest(REQUEST_AUTHENTICATION, checkSessionSagaLoop),
  takeLatest(REQUEST_VERIFY, verifySaga),
  takeLatest(REQUEST_RESEND, resendVerificationCodeSaga),
  takeLatest(REQUEST_FORGOT, forgotPasswordSaga),
  takeLatest(REQUEST_RESET_PASS, resetPasswordSaga),
  takeLatest(REQUEST_CHECKDOMAIN, domainFlowSaga),
  takeLatest(CANCEL_SIGNUP, logoutSaga)
  /* include all the sagas here */
]

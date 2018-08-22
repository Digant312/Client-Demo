import { Action } from 'redux'
import { delay } from 'redux-saga'
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
  api,
  parties,
  assetManagers,
  IRelationship
} from '@amaas/amaas-core-sdk-js'
import uuid from 'uuid/v4'

import { profileSelector, signupSelector } from 'selectors'
import { refreshSession } from 'utils/auth'

// New Company
import { newCompanySuccess, newCompanyFailed } from 'actions/newCompany'
import { REQUEST_NEWCOMPANY, REDIRECT_TO_TC } from 'actions/newCompany/types'

// Join Company
import { joinCompanyFailed, joinCompanySuccess } from 'actions/joinCompany'
import { REQUEST_JOINCOMPANY } from 'actions/joinCompany/types'

// Cancel flow
import { CANCEL_SIGNUP } from 'actions/signup/types'
import { requestLogout } from 'actions/session'

// Update progress indicator
import { updateSignupProgress } from 'actions/signup'

// Refresh session and store before redirecting to protected section
import { checkSessionSaga } from 'sagas/auth'

import { parseDate } from 'utils/form'

interface IAction extends Action {
  payload: any
}

export const retryTimes = 4
export const delayInterval = 2000

export function* newCompanyFlowSaga(action: IAction) {
  const { history } = action.payload

  const { newCompany, cancel } = yield race({
    newCompany: fork(newCompanySaga, action),
    cancel: take(CANCEL_SIGNUP)
  })

  if (cancel) {
    yield put(requestLogout({ history }))
  }
}

export function* newCompanySaga(action: IAction) {
  yield put(updateSignupProgress(1))
  const { name: companyName, type, history, domain } = action.payload
  const assetManager = yield new assetManagers.AssetManager({
    assetManagerType: type
  })
  try {
    // Get some needed info from state
    const { firstName, lastName } = yield select(signupSelector)
    const { assetManagerId } = yield select(profileSelector)

    // Create the company AM
    const { assetManagerId: companyAMID } = yield call(
      api.AssetManagers.insert,
      { assetManager }
    )

    // refresh the token so it contains adminof
    yield call(refreshSession)

    // Get the refreshed profile info
    const profile = yield select(profileSelector)

    // Inser the Party info about the company
    const partyInfo = yield new parties.AssetManager({
      assetManagerId: companyAMID,
      partyId: `AMID${companyAMID}`,
      displayName: companyName
    })
    yield call(api.Parties.insert, {
      AMId: companyAMID,
      party: partyInfo
    }) // company self info

    // Insert the domain info
    const domainInfo = yield new assetManagers.Domain({
      assetManagerId: companyAMID,
      domain,
      isPrimary: true
    })
    yield call(api.AssetManagers.insertDomain, {
      AMId: companyAMID,
      domain: domainInfo
    })

    yield put(updateSignupProgress(30))

    // Call the register api
    yield call(api.Relationships.register, { AMId: companyAMID })

    yield put(updateSignupProgress(55))

    // get the demo account amid
    const { demoAccount, demoAccountTimeout } = yield race({
      demoAccount: call(waitForAccountCreation),
      demoAccountTimeout: call(delay, 60000)
    })
    // wait for positions on the demo account
    if (demoAccount) {
      yield put(updateSignupProgress(80))

      const { assetManagerId: demoAMId } = demoAccount.find(
        (rel: any) => rel.assetManagerId !== companyAMID
      ) || { assetManagerId: null }
      if (demoAMId) {
        const { demoData, demoDataTimeout } = yield race({
          demoData: call(waitForDemoData, demoAMId),
          demoDataTimeout: call(delay, 60000)
        })

        if (demoData) {
          yield put(updateSignupProgress(95))

          yield* checkSessionSaga(action)
          yield put(newCompanySuccess())
          yield put(updateSignupProgress(100))
          yield call(history.push, '/a-a/portfolio')
          return
        }
      }
    }
    yield put(newCompanyFailed('Account creation error'))
  } catch (e) {
    yield put(newCompanyFailed(e.message || e))
  }
}

export function* joinCompanyFlowSaga(action: IAction) {
  const { history } = action.payload

  const { joinCompany, cancel } = yield race({
    joinCompany: fork(joinCompanySaga, action),
    cancel: take(CANCEL_SIGNUP)
  })

  if (cancel) {
    yield put(requestLogout({ history }))
  }
}

export function* joinCompanySaga(action: IAction) {
  const { message, history } = action.payload

  // Get some needed state info
  const signupState = yield select(signupSelector)
  const profile = yield select(profileSelector)
  const AMId = signupState.amidToJoin

  try {
    // Call the register API with companyToJoin AMID
    yield call(api.Relationships.register, { AMId })

    const { relationships, timeout } = yield race({
      relationships: call(waitForAccountCreation),
      timeout: call(delay, 60000)
    })

    if (relationships) {
      yield* checkSessionSaga(action) // Refresh the store before redirecting
      yield put(joinCompanySuccess())
      yield call(history.push, '/a-a/portfolio')
    } else {
      put(joinCompanyFailed('Account creation timeout'))
    }
  } catch (e) {
    yield put(joinCompanyFailed(e.message || e))
  }
}

export function* waitForAccountCreation() {
  // Get the user's AMID
  const { assetManagerId } = yield select(profileSelector)

  // Check if there is Employee relationship on a retry loop
  while (true) {
    console.log(
      `%c Checking relationships for AMID ${assetManagerId}`,
      'color: #f4aa42'
    )
    try {
      const relatedAMIDs = yield call(api.Relationships.getRelatedAMID, {
        AMId: parseInt(assetManagerId)
      })
      const hasDemoRel = relatedAMIDs.filter(
        (rel: IRelationship) => rel.relationshipType === 'Employee'
      )
      if (hasDemoRel.length < 2) {
        yield call(delay, delayInterval)
      } else {
        console.log('%c Found 2 Employee relationship types', 'color: #338225')
        return hasDemoRel
      }
    } catch (e) {
      yield call(delay, delayInterval)
    }
  }
}

export function* waitForDemoData(companyAMId: number) {
  while (true) {
    console.log(
      `%c Checking demo data for AMID ${companyAMId}`,
      'color: #f4aa42'
    )
    try {
      yield call(delay, 2000)
      const dateToday = parseDate('yyyy-mm-dd')(new Date())
      let positions = yield call(api.Positions.search, {
        AMId: companyAMId,
        query: { positionDate: dateToday }
      }) as any
      if (!Array.isArray(positions)) positions = [positions]
      if (positions.length >= 1) {
        console.log('%c Position found', 'color: #338225')
        return positions
      }
    } catch (err) {
      yield call(delay, delayInterval)
    }
  }
}

export function* redirectToTCSaga(action: IAction) {
  const { history, name, type, regulated, domain } = action.payload
  yield call(history.push, '/a-a/terms-and-conditions', {
    name,
    type,
    regulated,
    domain
  })
}

/* Helper export to make combining all sagas in rootSaga easier */
export default [
  takeLatest(REQUEST_NEWCOMPANY, newCompanyFlowSaga),
  takeLatest(REQUEST_JOINCOMPANY, joinCompanyFlowSaga),
  takeLatest(REDIRECT_TO_TC, redirectToTCSaga)
  /* include all the sagas here */
]

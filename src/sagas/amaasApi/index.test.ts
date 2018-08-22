import { call, cancel, fork, put, race, select, take } from 'redux-saga/effects'
import { createMockTask, cloneableGenerator } from 'redux-saga/utils'
import { delay } from 'redux-saga'
import uuid from 'uuid/v4'
import { api, parties, assetManagers } from '@amaas/amaas-core-sdk-js'

import {
  insertRelationshipRequest,
  joinCompanyFlowSaga,
  joinCompanySaga,
  newCompanyFlowSaga,
  newCompanySaga,
  waitForAccountCreation,
  waitForDemoData,
  delayInterval,
  retryTimes,
  redirectToTCSaga
} from './'
import { profileSelector, sessionSelector, signupSelector } from 'selectors'
import { refreshSession } from 'utils/auth'

// New Company
import { newCompanySuccess, newCompanyFailed } from 'actions/newCompany'
import { REQUEST_NEWCOMPANY, REDIRECT_TO_TC } from 'actions/newCompany/types'

//Join Company
import { joinCompanyFailed, joinCompanySuccess } from 'actions/joinCompany'
import { REQUEST_JOINCOMPANY } from 'actions/joinCompany/types'

// Cancel flow
import { CANCEL_SIGNUP } from 'actions/signup/types'
import { requestLogout } from 'actions/session'

// Update progress indicator
import { updateSignupProgress } from 'actions/signup'

const mockedHistory = {
  push: jest.fn()
}

const mockedUuid = 'abcdefghijklmnopqrstuvwxyz123456'

describe('newCompanyFlowSaga', () => {
  let gen, action, mockTask
  beforeAll(() => {
    mockTask = createMockTask()
    action = { type: CANCEL_SIGNUP, payload: { history: 'history' } }
    gen = newCompanyFlowSaga(action)
  })
  it('yields race', () => {
    const raced = gen.next().value
    expect(raced).toEqual(
      race({
        newCompany: fork(newCompanySaga, action),
        cancel: take(CANCEL_SIGNUP)
      })
    )
  })

  it('puts requestLogout if cancelled', () => {
    const cancelled = gen.next({ newCompany: false, cancel: true }).value
    expect(cancelled).toEqual(put(requestLogout({ history: 'history' })))
  })
})

describe('newCompanySaga', () => {
  let gen
  beforeAll(() => {
    const action = {
      type: REQUEST_NEWCOMPANY,
      payload: {
        name: 'testName',
        type: 'Individual',
        history: mockedHistory,
        domain: 'testDomain'
      }
    }
    gen = newCompanySaga(action)
  })

  it('puts signup progress', () => {
    const putted = gen.next().value
    expect(putted).toEqual(put(updateSignupProgress(1)))
  })

  it('yields an Asset Manager object', () => {
    const yielded = gen.next().value
    expect(yielded).toEqual(
      new assetManagers.AssetManager({ assetManagerType: 'Individual' })
    )
  })

  it('selects signupSelector state', () => {
    const selected = gen.next('AM').value
    expect(selected).toEqual(select(signupSelector))
  })

  it('selects assetManagerId', () => {
    const selected = gen.next({ firstName: 'John', lastName: 'Smith' }).value
    expect(selected).toEqual(select(profileSelector))
  })

  it('calls api.AssetManagers.insert', () => {
    const called = gen.next({ assetManagerId: 88 }).value
    expect(called).toEqual(
      call(api.AssetManagers.insert, { assetManager: 'AM' as any })
    )
  })

  it('calls refreshSession', () => {
    const called = gen.next({ assetManagerId: 1 /* company's AMID */ }).value
    expect(called).toEqual(call(refreshSession))
  })

  it('selects profile state slice', () => {
    const selected = gen.next().value
    expect(selected).toEqual(select(profileSelector))
  })

  it('yields a Party object', () => {
    const yielded = gen.next().value
    const expectedResult = new parties.AssetManager({
      assetManagerId: 1,
      partyId: 'AMID1',
      displayName: 'testName'
    })
    expect(yielded).toEqual(expectedResult)
  })

  it('calls insert party', () => {
    const called = gen.next('partyInfo').value
    expect(called).toEqual(
      call(api.Parties.insert, { AMId: 1, party: 'partyInfo' as any })
    )
  })

  it('yields a domain object', () => {
    const yielded = gen.next().value
    const expectedResult = new assetManagers.Domain({
      assetManagerId: 1,
      domain: 'testDomain',
      isPrimary: true
    })
    expect(yielded).toEqual(expectedResult)
  })

  it('calls insertDomain', () => {
    const called = gen.next('domainInfo').value
    expect(called).toEqual(
      call(api.AssetManagers.insertDomain, {
        AMId: 1,
        domain: 'domainInfo' as any
      })
    )
  })

  it('puts updateSignupProgress', () => {
    const putted = gen.next().value
    expect(putted).toEqual(put(updateSignupProgress(30)))
  })

  it('calls api.Relationships.register', () => {
    const called = gen.next().value
    expect(called).toEqual(call(api.Relationships.register, { AMId: 1 }))
  })

  it('puts updateSignupProgress', () => {
    const putted = gen.next().value
    expect(putted).toEqual(put(updateSignupProgress(55)))
  })

  it('races between waitForAccountCreation and 60s timeout', () => {
    const raced = gen.next().value
    expect(raced).toEqual(
      race({
        demoAccount: call(waitForAccountCreation),
        demoAccountTimeout: call(delay, 60000)
      })
    )
  })

  it('puts updateSignupProgress', () => {
    const putted = gen.next({ demoAccount: [{ assetManagerId: 90 }] }).value
    expect(putted).toEqual(put(updateSignupProgress(80)))
  })

  it('races between demoData and demoDataTimeout', () => {
    const raced = gen.next().value
    expect(raced).toEqual(
      race({
        demoData: call(waitForDemoData, 90),
        demoDataTimeout: call(delay, 60000)
      })
    )
  })

  it('puts updateSignupProgress', () => {
    const putted = gen.next({ demoData: true }).value
    expect(putted).toEqual(put(updateSignupProgress(95)))
  })

  it('selects profileSelector', () => {
    const selected = gen.next().value
    expect(selected).toEqual(select(sessionSelector))
  })

  it('puts newCompanySuccess', () => {
    const putted = gen.next({ authenticated: false }).value
    expect(putted).toEqual(put(newCompanySuccess()))
  })

  it('puts updateSignupProgress', () => {
    const putted = gen.next({ demoData: true }).value
    expect(putted).toEqual(put(updateSignupProgress(100)))
  })

  it('redirects', () => {
    const redirect = gen.next().value
    expect(redirect).toEqual(call(mockedHistory.push, '/a-a/portfolio'))
  })

  it('puts newCompanyFailed', () => {
    const thrown = gen.throw({ message: 'testError' }).value
    expect(thrown).toEqual(put(newCompanyFailed('testError')))
  })
})

describe('joinCompanyFlowSaga', () => {
  let gen, action, mockTask
  beforeAll(() => {
    mockTask = createMockTask()
    action = { type: CANCEL_SIGNUP, payload: { history: 'history' } }
    gen = joinCompanyFlowSaga(action)
  })
  it('yields race', () => {
    const raced = gen.next().value
    expect(raced).toEqual(
      race({
        joinCompany: fork(joinCompanySaga, action),
        cancel: take(CANCEL_SIGNUP)
      })
    )
  })

  it('puts requestLogout if cancelled', () => {
    const cancelled = gen.next({ joinCompany: false, cancel: true }).value
    expect(cancelled).toEqual(put(requestLogout({ history: 'history' })))
  })
})

describe('joinCompanySaga', () => {
  let gen
  beforeAll(() => {
    const action = {
      type: REQUEST_JOINCOMPANY,
      payload: {
        message: 'testMessage',
        history: mockedHistory
      }
    }
    gen = joinCompanySaga(action)
  })
  it('selects signupSelector', () => {
    const selected = gen.next().value
    expect(selected).toEqual(select(signupSelector))
  })

  it('selects profileSelector', () => {
    const selected = gen.next({
      amidToJoin: 1,
      firstName: 'John',
      lastName: 'Smith'
    }).value
    expect(selected).toEqual(select(profileSelector))
  })

  it('calls api.Relationships.register', () => {
    const called = gen.next().value
    expect(called).toEqual(call(api.Relationships.register, { AMId: 1 }))
  })

  it('races between relationships and timeout', () => {
    const raced = gen.next().value
    expect(raced).toEqual(
      race({
        relationships: call(waitForAccountCreation),
        timeout: call(delay, 60000)
      })
    )
  })

  it('selects sessionSelector', () => {
    const selected = gen.next({ relationships: true }).value
    expect(selected).toEqual(select(sessionSelector))
  })

  it('puts joinCompanySuccess', () => {
    const putted = gen.next({ assetManagerId: 88 }).value
    expect(putted).toEqual(put(joinCompanySuccess()))
  })

  it('redirects', () => {
    const redirect = gen.next().value
    expect(redirect).toEqual(call(mockedHistory.push, '/a-a/portfolio'))
  })

  it('puts joinCompanyFailed on error', () => {
    const thrown = gen.throw({ message: 'testError' }).value
    expect(thrown).toEqual(put(joinCompanyFailed('testError')))
  })
})

describe('waitForAccountCreation', () => {
  let data: any = {}
  beforeAll(() => {
    data.gen = cloneableGenerator(waitForAccountCreation)()
  })

  it('selects profile', () => {
    const selected = data.gen.next().value
    expect(selected).toEqual(select(profileSelector))
  })

  it('calls api.Relationships.getRelatedAMID', () => {
    const called = data.gen.next({ assetManagerId: 88 }).value
    expect(called).toEqual(call(api.Relationships.getRelatedAMID, { AMId: 88 }))
  })

  it('returns if there is are 2 or more Employee relationships', () => {
    data.relExists = data.gen.clone()
    const returned = data.relExists.next([
      { relationshipType: 'Employee' },
      { relationshipType: 'Employee' }
    ]).done
    expect(returned).toBeTruthy()
  })

  it('calls delay if there is no Employee relationship', () => {
    const called = data.gen.next([]).value
    expect(called).toEqual(call(delay, delayInterval))
  })

  it('calls delay if error is thrown', () => {
    const thrown = data.gen.throw().value
    expect(thrown).toEqual(call(delay, delayInterval))
  })
})

describe('redirectToTCSaga', () => {
  let gen, action
  beforeAll(() => {
    action = {
      type: REDIRECT_TO_TC,
      payload: {
        name: 'Test Capital',
        type: 'Venture Capital',
        domain: 'argomi.com',
        history: mockedHistory
      }
    }
    gen = redirectToTCSaga(action)
  })
  it('calls history.push', () => {
    const called = gen.next().value
    expect(called).toEqual(
      call(mockedHistory.push, '/a-a/terms-and-conditions', {
        name: 'Test Capital',
        type: 'Venture Capital',
        domain: 'argomi.com'
      })
    )
  })
})

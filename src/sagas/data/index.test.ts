import { delay } from 'redux-saga'
import { call, put, race, select, take } from 'redux-saga/effects'
import { cloneableGenerator } from 'redux-saga/utils'
import { api } from '@amaas/amaas-core-sdk-js'
import moment from 'moment'

import * as actions from 'actions/data'
import { connectToWS, disconnectWS } from 'actions/pubsub'
import * as sagas from './'
import { profileSelector } from 'selectors'
import { fetchTransactions } from '../api'
import { AUTHENTICATION_SUCCESS } from 'actions/session/types'
import { FETCH_TRANSACTIONS } from 'actions/data/types'

describe('getAMId', () => {
  let data: any = {}
  beforeAll(() => {
    data.assumed = cloneableGenerator<boolean>(sagas.getAMId)(true)
    data.notAssumed = cloneableGenerator(sagas.getAMId)()
  })

  // Assumed=true
  it('selects profile', () => {
    const selected = data.assumed.next().value
    expect(selected).toEqual(select(profileSelector))
  })

  it('returns assumedAMID if available', () => {
    data.assumedAvailable = data.assumed.clone()
    const returned = data.assumedAvailable.next({ assumedAMID: 5 }).value
    expect(returned).toEqual(5)
  })

  it('moves to race if assumedAMID is not available', () => {
    const raced = data.assumed.next({}).value
    expect(raced).toEqual(
      race({
        authed: take(AUTHENTICATION_SUCCESS),
        timeout: call(delay, 10000)
      })
    )
  })

  // Assumed=false
  it('selects profile', () => {
    const selected = data.notAssumed.next().value
    expect(selected).toEqual(select(profileSelector))
  })

  it('returns assetManagerId if available', () => {
    data.AMIDAvailable = data.notAssumed.clone()
    const returned = data.AMIDAvailable.next({ assetManagerId: 1 }).value
    expect(returned).toEqual(1)
  })

  it('moves to race if assetManagerId is not available', () => {
    const raced = data.notAssumed.next({}).value
    expect(raced).toEqual(
      race({
        authed: take(AUTHENTICATION_SUCCESS),
        timeout: call(delay, 10000)
      })
    )
  })

  // Race
  it('selects profile if race completes with authed', () => {
    data.timeout = data.notAssumed.clone()
    const notAssumedSelected = data.notAssumed.next({ authed: true }).value
    const assumedSelected = data.assumed.next({ authed: true }).value
    expect(notAssumedSelected).toEqual(select(profileSelector))
    expect(assumedSelected).toEqual(select(profileSelector))
  })

  // assumed=false
  it('returns assetManagerId if available', () => {
    data.noAMID = data.notAssumed.clone()
    const returned = data.notAssumed.next({ assetManagerId: 1 }).value
    expect(returned).toEqual(1)
  })

  //assumed=true
  it('returns assumedAMID if available', () => {
    data.noAssumedAMID = data.assumed.clone()
    const returned = data.assumed.next({ assumedAMID: 5 }).value
    expect(returned).toEqual(5)
  })

  // Still missing profile data
  // assumed=false
  it('throws if still no amid', () => {
    const willThrow = () => {
      data.noAMID.next({}).value
    }
    expect(willThrow).toThrowError('Could not retrieve Asset Manager ID')
  })

  //assumed=true
  it('throws if still no amid', () => {
    const willThrow = () => {
      data.noAssumedAMID.next({}).value
    }
    expect(willThrow).toThrowError('Could not retrieve Asset Manager ID')
  })

  // timeout
  it('throws if timeout', () => {
    const catcher = () => {
      const thrown = data.timeout.next({ authed: false })
    }
    expect(catcher).toThrowError('Could not retrieve Asset Manager ID')
  })
})

describe('establishWSConnection', () => {
  let gen
  beforeAll(() => {
    gen = sagas.establishWSConnection()
  })

  it('selects profile', () => {
    const selected = gen.next().value
    expect(selected).toEqual(select(profileSelector))
  })

  it('calls getCredentialsForPubSub', () => {
    const called = gen.next({ assetManagerId: 1 }).value
    expect(called).toEqual(
      call(api.AssetManagers.getCredentialsForPubSub, { AMId: 1 })
    )
  })

  it('puts connectToWS', () => {
    const credentials = {
      Credentials: {
        AccessKeyId: 'testAccessKey',
        SecretAccessKey: 'testSecretAccessKey',
        SessionToken: 'testSessionToken'
      },
      topics: ['topic1']
    }
    const config = {
      accessKeyId: credentials.Credentials.AccessKeyId,
      secretKey: credentials.Credentials.SecretAccessKey,
      sessionToken: credentials.Credentials.SessionToken,
      topics: credentials.topics
    }
    const putted = gen.next(credentials).value
    expect(putted).toEqual(put(connectToWS(config)))
  })

  it('puts disconnectWS on throw', () => {
    const putted = gen.throw(new Error('error')).value
    expect(putted).toEqual(put(disconnectWS()))
  })
})

describe('fetchAssetsSaga', () => {
  let gen, query

  beforeAll(() => {
    query = { fields: ['description', 'displayName'] }
    gen = sagas.fetchAssetsSaga({ type: 'FETCH_ASSET', payload: { query } })
  })

  it('selects profile', () => {
    const selected = gen.next().value
    expect(selected).toEqual(select(profileSelector))
  })

  it('retrieves assets', () => {
    const called = gen.next({ assumedAMID: 5 }).value
    expect(called).toEqual(call(api.Assets.search, { AMId: 5, query }))
  })

  it('puts fetchAssetsSuccess with result', () => {
    const putted = gen.next([{ issueDate: '2017-12-30' }]).value
    expect(putted).toEqual(
      put(actions.fetchAssetsSuccess([{ issueDate: moment.utc('2017-12-30') }]))
    )
  })

  it('should put fetchAssetsFailed if Assets.retrieve fails', () => {
    const thrown = gen.throw('Error').value
    expect(thrown).toEqual(put(actions.fetchAssetsFailed('Error')))
  })
})

describe('fetchBooksSaga', () => {
  let data: any = {}

  beforeAll(() => {
    data.gen = cloneableGenerator(sagas.fetchBooksSaga)()
  })

  it('selects profile', () => {
    const selected = data.gen.next().value
    expect(selected).toEqual(select(profileSelector))
  })

  it('retrieves books', () => {
    const called = data.gen.next({ assumedAMID: 5 }).value
    data.noBooks = data.gen.clone()
    expect(called).toEqual(call(api.Books.retrieve, { AMId: 5 }))
  })

  it('puts empty array if no books', () => {
    const putted = data.noBooks.next([]).value
    expect(putted).toEqual(put(actions.fetchBooksSuccess([])))
  })

  it('yields getPartyInfoForList (owners)', () => {
    const yielded = data.gen.next([{ ownerId: 'AMID88', partyId: 'AMID99' }])
      .value
    const query = {
      partyIds: ['AMID88'],
      fields: ['partyId', 'givenNames', 'surname', 'displayName', 'description']
    }
    expect(yielded).toEqual(call(api.Parties.fieldsSearch, { AMId: 5, query }))
  })

  it('yields getPartyInfoForList (parties)', () => {
    const yielded = data.gen.next([
      { partyId: 'AMID88', displayName: 'Test Owner 88' }
    ]).value
    const query = {
      partyIds: ['AMID99'],
      fields: ['partyId', 'givenNames', 'surname', 'displayName', 'description']
    }
    expect(yielded).toEqual(call(api.Parties.fieldsSearch, { AMId: 5, query }))
  })

  it('puts fetchBooksSuccess with result', () => {
    const putted = data.gen.next([
      { partyId: 'AMID99', displayName: 'Test Party 99' }
    ]).value
    const expectedResult = [
      {
        ownerId: 'AMID88',
        partyId: 'AMID99',
        ownerName: 'Test Owner 88',
        partyName: 'Test Party 99'
      }
    ]
    expect(putted).toEqual(put(actions.fetchBooksSuccess(expectedResult)))
  })

  it('should put fetchBooksFailed if Books.retrieve fails', () => {
    const thrown = data.gen.throw('Error').value
    expect(thrown).toEqual(put(actions.fetchBooksFailed('Error')))
  })
})

describe('fetchBookPermissionsSaga', () => {
  let gen

  beforeAll(() => {
    gen = sagas.fetchBookPermissionsSaga({
      type: 'testType',
      payload: { bookId: 'TEST' }
    })
  })

  it('selects profile', () => {
    const selected = gen.next().value
    expect(selected).toEqual(select(profileSelector))
  })

  it('retrieves book permissions', () => {
    const called = gen.next({ assumedAMID: 5 }).value
    expect(called).toEqual(
      call(api.Books.getPermissions, { AMId: 5, bookId: 'TEST' })
    )
  })

  it('calls api.Parties.fieldsSearch', () => {
    const called = gen.next([{ userAssetManagerId: 88 }]).value
    const query = {
      partyIds: ['AMID88'],
      fields: ['partyId', 'givenNames', 'surname', 'displayName', 'description']
    }
    expect(called).toEqual(call(api.Parties.fieldsSearch, { AMId: 5, query }))
  })

  it('puts fetchBookPermissionsSuccess with result', () => {
    const putted = gen.next([{ partyId: 'AMID88', description: 'John Smith' }])
      .value
    expect(putted).toEqual(
      put(
        actions.fetchBookPermissionsSuccess([
          { userAssetManagerId: 88, name: 'John Smith' }
        ])
      )
    )
  })

  it('should put fetchBookPermissionsFailed if Books.retrieve fails', () => {
    const thrown = gen.throw('Error').value
    expect(thrown).toEqual(put(actions.fetchBookPermissionsFailed('Error')))
  })
})

describe('fetchDomains saga', () => {
  let gen
  beforeAll(() => {
    gen = sagas.fetchDomainsSaga()
  })

  it('selects profile', () => {
    const selected = gen.next().value
    expect(selected).toEqual(select(profileSelector))
  })

  it('retrieves domains', () => {
    const called = gen.next({ assumedAMID: 5 }).value
    expect(called).toEqual(call(api.AssetManagers.searchDomains, { AMId: 5 }))
  })

  it('puts fetchDomainsSuccess with result', () => {
    const putted = gen.next(['testDomain']).value
    expect(putted).toEqual(put(actions.fetchDomainsSuccess(['testDomain'])))
  })

  it('should put fetchDomainsFailed if Books.retrieve fails', () => {
    const thrown = gen.throw('Error').value
    expect(thrown).toEqual(put(actions.fetchDomainsFailed('Error')))
  })
})

describe('fetchMonitorSaga', () => {
  let gen

  beforeAll(() => {
    gen = sagas.fetchMonitorSaga()
  })

  it('selects profile', () => {
    const selected = gen.next().value
    expect(selected).toEqual(select(profileSelector))
  })

  it('retrieves monitor items', () => {
    const called = gen.next({ assumedAMID: 5 }).value
    expect(called).toEqual(call(api.Monitor.retrieveItems, { AMId: 5 }))
  })

  it('puts fetchMonitorSuccess with result', () => {
    const putted = gen.next(['testItem']).value
    expect(putted).toEqual(put(actions.fetchMonitorSuccess(['testItem'])))
  })

  it('should put fetchMonitorFailed if Monitor.retrieveItems fails', () => {
    const thrown = gen.throw('Error').value
    expect(thrown).toEqual(put(actions.fetchMonitorFailed('Error')))
  })
})

describe('fetchPartiesSaga', () => {
  let gen, query
  beforeAll(() => {
    query = { partyTypes: 'Fund' }
    gen = sagas.fetchPartiesSaga({ type: 'testType', payload: { query } })
  })

  it('selects profile', () => {
    const selected = gen.next().value
    expect(selected).toEqual(select(profileSelector))
  })

  it('retrieves parties', () => {
    const called = gen.next({ assumedAMID: 5 }).value
    expect(called).toEqual(call(api.Parties.search, { AMId: 5, query }))
  })

  it('puts fetchParties with result', () => {
    const putted = gen.next([{ dateOfBirth: '2017-12-31' }]).value
    expect(putted).toEqual(
      put(actions.fetchPartiesSuccess([{ dateOfBirth: moment.utc('2017-12-31') }]))
    )
  })

  it('should put fetchPartiesFailed if Parties.retrieve fails', () => {
    const thrown = gen.throw('Error').value
    expect(thrown).toEqual(put(actions.fetchPartiesFailed('Error')))
  })
})

describe('fetchPositionsSaga', () => {
  let data: any = {}
  beforeAll(() => {
    data.gen = cloneableGenerator(sagas.fetchPositionsSaga)({
      type: 'testType',
      payload: { query: { positionDate: '2017-01-01' } }
    })
  })

  it('selects profile', () => {
    const selected = data.gen.next().value
    expect(selected).toEqual(select(profileSelector))
  })

  it('retrieves positions', () => {
    const called = data.gen.next({ assumedAMID: 5 }).value
    data.noPos = data.gen.clone()
    expect(called).toEqual(
      call(api.Positions.search, {
        AMId: 5,
        query: { positionDate: '2017-01-01' }
      })
    )
  })

  it('puts empty array if there are no positions', () => {
    const putted = data.noPos.next([]).value
    expect(putted).toEqual(put(actions.fetchPositionsSuccess([])))
  })

  it('calls api.Assets.search', () => {
    const called = data.gen.next([{ assetId: 'abc' }]).value
    const query = {
      assetIds: ['abc'],
      fields: [
        'assetId',
        'displayName',
        'references',
        'assetClass',
        'assetType'
      ]
    }
    expect(called).toEqual(call(api.Assets.fieldsSearch, { AMId: 5, query }))
  })

  it('puts fetchPositonsSuccess with result', () => {
    const putted = data.gen.next([
      {
        assetId: 'abc',
        displayName: 'test displayName',
        references: { ISIN: { referenceValue: 'NISI' } },
        assetClass: 'Equity',
        assetType: 'Equity'
      }
    ]).value
    expect(putted).toEqual(
      put(
        actions.fetchPositionsSuccess([
          {
            assetId: 'abc',
            displayName: 'test displayName',
            ISIN: 'NISI',
            assetClass: 'Equity',
            assetType: 'Equity',
            assetPrimaryReference: ''
          }
        ])
      )
    )
  })

  it('should put fetchPositionsFailed if Positions.retrieve fails', () => {
    const thrown = data.gen.throw('Error').value
    expect(thrown).toEqual(put(actions.fetchPositionsFailed('Error')))
  })
})

describe('fetchRelationshipsSaga', () => {
  let gen
  beforeAll(() => {
    gen = sagas.fetchRelationshipsSaga()
  })

  it('selects profile', () => {
    const selected = gen.next().value
    expect(selected).toEqual(select(profileSelector))
  })

  it('retrieves relationships', () => {
    const called = gen.next({ assumedAMID: 5 }).value
    expect(called).toEqual(call(api.Relationships.retrieve, { AMId: 5 }))
  })

  it('calls api.Parties.fieldsSearch', () => {
    const called = gen.next([{ relatedId: 88 }]).value
    const query = {
      partyIds: ['AMID88'],
      fields: ['partyId', 'givenNames', 'surname', 'displayName', 'description']
    }
    expect(called).toEqual(call(api.Parties.fieldsSearch, { AMId: 5, query }))
  })

  it('puts fetchRelationshipsSuccess with result', () => {
    const putted = gen.next([{ partyId: 'AMID88', description: 'John Smith' }])
      .value
    expect(putted).toEqual(
      put(
        actions.fetchRelationshipsSuccess([
          { relatedId: 88, relName: 'John Smith' }
        ])
      )
    )
  })

  it('should put fetchRelationshipsFailed if Relationships.retrieve fails', () => {
    const thrown = gen.throw('Error').value
    expect(thrown).toEqual(put(actions.fetchRelationshipsFailed('Error')))
  })
})

describe('fetchTransactionsSaga', () => {
  let data: any = {},
    action
  beforeAll(() => {
    action = {
      type: FETCH_TRANSACTIONS,
      payload: {
        query: {
          pageNo: ['1'],
          pageSize: ['10']
        }
      }
    }
    data.gen = cloneableGenerator(sagas.fetchTransactionsSaga)(action)
  })

  it('selects profile', () => {
    const selected = data.gen.next().value
    expect(selected).toEqual(select(profileSelector))
  })

  it('calls fetchTransactions', () => {
    const transactions = data.gen.next({ assumedAMID: 5 }).value
    data.noTrans = data.gen.clone()
    expect(transactions).toEqual(
      call(api.Transactions.search, { AMId: 5, query: action.payload.query })
    )
  })

  it('puts empty array if there are no transactions', () => {
    const putted = data.noTrans.next([]).value
    expect(putted).toEqual(put(actions.fetchTransactionsSuccess([])))
  })

  it('calls api.Assets.fieldsSearch', () => {
    const called = data.gen.next([
      {
        assetId: 'def',
        transactionDate: '2017-12-30',
        settlementDate: '2017-12-31'
      }
    ]).value
    const query = {
      assetIds: ['def'],
      fields: [
        'assetId',
        'displayName',
        'references',
        'assetClass',
        'assetType'
      ]
    }
    expect(called).toEqual(call(api.Assets.fieldsSearch, { AMId: 5, query }))
  })

  it('puts fetchTransactionsSuccess with result', () => {
    const putted = data.gen.next([
      {
        assetId: 'def',
        displayName: 'test displayName',
        references: {
          Ticker: { referenceValue: 'TKR', referencePrimary: true },
          ISIN: { referenceValue: null }
        },
        assetType: 'Equity'
      }
    ]).value
    expect(putted).toEqual(
      put(
        actions.fetchTransactionsSuccess([
          {
            assetId: 'def',
            assetType: 'Equity',
            displayName: 'test displayName',
            assetPrimaryReference: 'TKR',
            ISIN: null,
            transactionDate: moment.utc('2017-12-30'),
            settlementDate: moment.utc('2017-12-31')
          }
        ])
      )
    )
  })

  it('should put fetchTransactions failed if fetchTransactions fails', () => {
    const thrown = data.gen.throw('Error').value
    expect(thrown).toEqual(put(actions.fetchTransactionsFailed('Error')))
  })
})

describe('fetchTransactionVersionSaga', () => {
  let gen, failedGen, action, emptyAction
  beforeAll(() => {
    emptyAction = {
      type: 'testType',
      payload: {}
    }
    action = {
      type: 'testType',
      payload: { transactionId: 'testTransID', version: 8 }
    }
    failedGen = sagas.fetchTransactionVersionSaga(emptyAction)
    gen = sagas.fetchTransactionVersionSaga(action)
  })

  it('puts fetchTransactionsFailed if payload data is missing', () => {
    const putted = failedGen.next().value
    expect(putted).toEqual(
      put(
        actions.fetchTransactionsFailed(
          'Missing transactionId or version number'
        )
      )
    )
  })

  it('selects profile', () => {
    const selected = gen.next().value
    expect(selected).toEqual(select(profileSelector))
  })

  it('calls api.Transaction.retrieve', () => {
    const called = gen.next({ assumedAMID: 88 }).value
    expect(called).toEqual(
      call(api.Transactions.retrieve, {
        AMId: 88,
        resourceId: 'testTransID',
        query: { version: 8 }
      })
    )
  })

  it('calls api.Assets.fieldsSearch', () => {
    const called = gen.next({ assetId: 'def' }).value
    const query = {
      assetIds: ['def'],
      fields: [
        'assetId',
        'displayName',
        'references',
        'assetClass',
        'assetType'
      ]
    }
    expect(called).toEqual(call(api.Assets.fieldsSearch, { AMId: 88, query }))
  })

  it('puts fetchTransactionsSuccess with result', () => {
    const putted = gen.next([
      {
        assetId: 'def',
        assetClass: 'Equity',
        assetType: 'Equity',
        displayName: 'test displayName',
        references: {
          Ticker: { referenceValue: 'TKR', referencePrimary: true },
          ISIN: { referenceValue: null }
        }
      }
    ]).value
    expect(putted).toEqual(
      put(
        actions.fetchTransactionsSuccess([
          {
            assetId: 'def',
            displayName: 'test displayName',
            assetPrimaryReference: 'TKR',
            ISIN: null,
            assetClass: 'Equity',
            assetType: 'Equity'
          }
        ])
      )
    )
  })

  it('should put fetchTransactions failed if fetchTransactions fails', () => {
    const thrown = gen.throw('Error').value
    expect(thrown).toEqual(put(actions.fetchTransactionsFailed('Error')))
  })
})

describe('getAssetInfoForList', () => {
  let gen
  beforeAll(() => {
    gen = sagas.getAssetInfoForList(88, [{ assetId: 'abc' }])
  })

  it('calls api.Assets.fieldsSearch', () => {
    const called = gen.next().value
    const expectedQuery = {
      assetIds: ['abc'],
      fields: [
        'assetId',
        'displayName',
        'references',
        'assetClass',
        'assetType'
      ]
    }
    expect(called).toEqual(
      call(api.Assets.fieldsSearch, { AMId: 88, query: expectedQuery })
    )
  })

  it('returns merged collection object', () => {
    const returned = gen.next([
      {
        assetId: 'abc',
        displayName: 'test displayName',
        references: {
          Ticker: { referenceValue: 'TKR', referencePrimary: true }
        },
        assetClass: 'Equity',
        assetType: 'Equity'
      }
    ]).value
    expect(returned).toEqual([
      {
        assetId: 'abc',
        displayName: 'test displayName',
        assetPrimaryReference: 'TKR',
        ISIN: null,
        assetClass: 'Equity',
        assetType: 'Equity'
      }
    ])
  })
})

describe('getPartyInfoForList', () => {
  let data: any = {}
  let list = ['party1', 'party2']
  beforeAll(() => {
    data.gen = cloneableGenerator(sagas.getPartyInfoForList)(88, list)
  })
  it('calls api.Parties.fieldsSearch', () => {
    const called = data.gen.next().value
    data.givenNamesSurname = data.gen
      .clone()
      .next([{ partyId: 'TEST', givenNames: 'John', surname: 'Smith' }])
    data.displayName = data.gen
      .clone()
      .next([
        { partyId: 'TEST', surname: 'Smith', displayName: 'test displayName' }
      ])
    data.description = data.gen
      .clone()
      .next([
        { partyId: 'TEST', surname: 'Smith', description: 'test description' }
      ])
    const query = {
      partyIds: list,
      fields: ['partyId', 'givenNames', 'surname', 'displayName', 'description']
    }
    expect(called).toEqual(call(api.Parties.fieldsSearch, { AMId: 88, query }))
  })

  it('returns full name', () => {
    const returned = data.givenNamesSurname.value
    const expectedResult = [{ partyId: 'TEST', name: 'John Smith' }]
    expect(returned).toEqual(expectedResult)
  })

  it('returns displayName if no givenName or surname', () => {
    const returned = data.displayName.value
    const expectedResult = [{ partyId: 'TEST', name: 'test displayName' }]
    expect(returned).toEqual(expectedResult)
  })

  it('returns description if no givenName or surname or displayname', () => {
    const returned = data.description.value
    const expectedResult = [{ partyId: 'TEST', name: 'test description' }]
    expect(returned).toEqual(expectedResult)
  })
})

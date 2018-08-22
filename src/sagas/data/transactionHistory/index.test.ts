import { all, call, put, select } from 'redux-saga/effects'
import { api } from '@amaas/amaas-core-sdk-js'

import {
  fetchTransactionsForGridSaga,
  fetchSingleTransactionVersion,
  transactionFields
} from './'
import { profileSelector } from 'selectors'
import {
  fetchTransactionHistoryForGridFailed,
  fetchTransactionHistoryForGridSuccess,
  fetchTransactionHistoryForExpandedRowFailed,
  fetchTransactionHistoryForExpandedRowSuccess
} from 'actions/data/transactionHistory'

const mockTransactions = [
  { assetId: 'asset1', version: 1 },
  { assetId: 'asset2', version: 2 }
]

const mockAssetInfo = [
  {
    assetId: 'asset1',
    assetClass: 'Equity',
    assetType: 'Equity',
    displayName: 'Asset One',
    references: {
      Ticker: { referenceValue: 'A1', referencePrimary: true },
      ISIN: { referenceValue: 'ISIN1', referencePrimary: false }
    }
  },
  {
    assetId: 'asset2',
    assetClass: 'ForeignExchange',
    assetType: 'ForeignExchangeSpot',
    displayName: 'Asset Two',
    references: {
      Ticker: { referenceValue: 'A2', referencePrimary: true },
      ISIN: { referenceValue: 'ISIN2', referencePrimary: false }
    }
  }
]

const mockEnrichedTransactions = [
  {
    assetId: 'asset1',
    version: 1,
    assetPrimaryReference: 'A1',
    ISIN: 'ISIN1',
    displayName: 'Asset One',
    assetClass: 'Equity',
    assetType: 'Equity'
  },
  {
    assetId: 'asset2',
    version: 2,
    assetPrimaryReference: 'A2',
    ISIN: 'ISIN2',
    displayName: 'Asset Two',
    assetClass: 'ForeignExchange',
    assetType: 'ForeignExchangeSpot'
  }
]

describe('fetchTransactionHistoryForGrid', () => {
  let gen, action
  beforeAll(() => {
    action = {
      type: 'testType',
      payload: { transactionId: 'testTransID' }
    }
    gen = fetchTransactionsForGridSaga(action)
  })

  it('selects profileSelector', () => {
    const selected = gen.next().value
    expect(selected).toEqual(select(profileSelector))
  })

  it('calls api.Transaction.retrieve', () => {
    const called = gen.next({ assumedAMID: 88 }).value
    expect(called).toEqual(
      call(api.Transactions.retrieve, { AMId: 88, resourceId: 'testTransID' })
    )
  })

  it('yields array of promises', () => {
    const yielded = gen.next({ version: 2 }).value
    expect(yielded).toEqual(
      all([
        call(api.Transactions.retrieve, {
          AMId: 88,
          resourceId: 'testTransID',
          query: { version: 1, fields: transactionFields }
        }),
        call(api.Transactions.retrieve, {
          AMId: 88,
          resourceId: 'testTransID',
          query: { version: 2, fields: transactionFields }
        })
      ])
    )
  })

  it('calls api.Assets.fieldsSearch', () => {
    const called = gen.next(mockTransactions).value
    expect(called).toEqual(
      call(api.Assets.fieldsSearch, {
        AMId: 88,
        query: {
          assetIds: ['asset1', 'asset2'],
          fields: [
            'assetId',
            'displayName',
            'references',
            'assetClass',
            'assetType'
          ]
        }
      })
    )
  })

  it('puts fetchTransactionHistoryForGridSuccess', () => {
    const putted = gen.next(mockAssetInfo).value
    expect(putted).toEqual(
      put(fetchTransactionHistoryForGridSuccess(mockEnrichedTransactions))
    )
  })

  it('puts fetchTransactionHistoryForGridFailed', () => {
    const thrown = gen.throw().value
    expect(thrown).toEqual(
      put(fetchTransactionHistoryForGridFailed('Error fetching Transactions'))
    )
  })
})

describe('fetchSingleTransactionVersion', () => {
  let gen, action
  beforeAll(() => {
    action = {
      type: 'testType',
      payload: { transactionId: 'testTransID', version: 2 }
    }
    gen = fetchSingleTransactionVersion(action)
  })

  it('selects profileSelector', () => {
    const selected = gen.next().value
    expect(selected).toEqual(select(profileSelector))
  })

  it('calls api.Transaction.retrieve', () => {
    const called = gen.next({ assumedAMID: 88 }).value
    const query = { version: 2 }
    expect(called).toEqual(
      call(api.Transactions.retrieve, {
        AMId: 88,
        resourceId: 'testTransID',
        query
      })
    )
  })

  it('calls api.Assets.fieldsSearch', () => {
    const called = gen.next(mockTransactions[1]).value
    expect(called).toEqual(
      call(api.Assets.fieldsSearch, {
        AMId: 88,
        query: {
          assetIds: ['asset2'],
          fields: [
            'assetId',
            'displayName',
            'references',
            'assetClass',
            'assetType'
          ]
        }
      })
    )
  })

  it('puts fetchTransactionHistoryForGridSuccess', () => {
    const putted = gen.next([mockAssetInfo[1]]).value
    expect(putted).toEqual(
      put(
        fetchTransactionHistoryForExpandedRowSuccess(
          mockEnrichedTransactions[1]
        )
      )
    )
  })

  it('puts fetchTransactionHistoryForGridFailed', () => {
    const thrown = gen.throw().value
    expect(thrown).toEqual(
      put(
        fetchTransactionHistoryForExpandedRowFailed(
          'Error fetching Transaction'
        )
      )
    )
  })
})

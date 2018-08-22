import { transactions } from '@amaas/amaas-core-sdk-js'

import * as types from './types'
import * as actions from './'

const mockTransaction = new transactions.Transaction({ assetManagerId: 88 })

describe('actions for grid', () => {
  it('creates an action to fetch Transctions for grid', () => {
    const expectedResult = {
      type: types.FETCH_TRANSACTIONS_FOR_HISTORY_GRID,
      payload: { transactionId: 'testTransID' }
    }
    expect(actions.fetchTransactionHistoryForGrid('testTransID')).toEqual(
      expectedResult
    )
  })

  it('creates action for successful fetch for grid', () => {
    const expectedResult = {
      type: types.FETCH_TRANSACTIONS_FOR_HISTORY_GRID_SUCCESS,
      payload: { data: [mockTransaction] }
    }
    expect(
      actions.fetchTransactionHistoryForGridSuccess([mockTransaction])
    ).toEqual(expectedResult)
  })

  it('creates action for failed fetch for grid', () => {
    const expectedResult = {
      type: types.FETCH_TRANSACTIONS_FOR_HISTORY_GRID_FAILED,
      payload: { error: 'Error' }
    }
    expect(actions.fetchTransactionHistoryForGridFailed('Error')).toEqual(
      expectedResult
    )
  })
})

describe('actions for expanded row', () => {
  it('creates an action to fetch the single transaction', () => {
    const expectedResult = {
      type: types.FETCH_TRANSACTION_FOR_HISTORY_EXPANDED,
      payload: { transactionId: 'testTransID', version: 1 }
    }
    expect(
      actions.fetchTransactionHistoryForExpandedRow('testTransID', 1)
    ).toEqual(expectedResult)
  })

  it('creates action for successful fetch for expanded row', () => {
    const expectedResult = {
      type: types.FETCH_TRANSACTION_FOR_HISTORY_EXPANDED_SUCCESS,
      payload: { data: mockTransaction }
    }
    expect(
      actions.fetchTransactionHistoryForExpandedRowSuccess(mockTransaction)
    ).toEqual(expectedResult)
  })

  it('creates action for failed fetch for expanded row', () => {
    const expectedResult = {
      type: types.FETCH_TRANSACTION_FOR_HISTORY_EXPANDED_FAILED,
      payload: { error: 'Error' }
    }
    expect(
      actions.fetchTransactionHistoryForExpandedRowFailed('Error')
    ).toEqual(expectedResult)
  })
})

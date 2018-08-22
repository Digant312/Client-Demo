import { gridReducer, expandedReducer } from './'
import * as types from 'actions/data/transactionHistory/types'

const initialGridState = {
  fetchingTransactions: false,
  transactions: [],
  fetchTransactionsError: ''
}

describe('gridReducer', () => {
  it('returns initialState for unknown action', () => {
    const expectedResult = initialGridState
    expect(gridReducer(initialGridState, { type: undefined })).toEqual(
      expectedResult
    )
  })

  it('sets for FETCH', () => {
    const expectedResult = {
      fetchingTransactions: true,
      transactions: [],
      fetchTransactionsError: ''
    }
    expect(
      gridReducer(initialGridState, {
        type: types.FETCH_TRANSACTIONS_FOR_HISTORY_GRID
      })
    ).toEqual(expectedResult)
  })

  it('sets for SUCCESS', () => {
    const expectedResult = {
      fetchingTransactions: false,
      transactions: [{ transactionId: 'testTransactionId' }],
      fetchTransactionsError: ''
    }
    expect(
      gridReducer(initialGridState, {
        type: types.FETCH_TRANSACTIONS_FOR_HISTORY_GRID_SUCCESS,
        payload: { data: [{ transactionId: 'testTransactionId' }] }
      })
    ).toEqual(expectedResult)
  })

  it('sets for FAILED', () => {
    const expectedResult = {
      fetchingTransactions: false,
      transactions: [],
      fetchTransactionsError: 'Error'
    }
    expect(
      gridReducer(initialGridState, {
        type: types.FETCH_TRANSACTIONS_FOR_HISTORY_GRID_FAILED,
        payload: { error: 'Error' }
      })
    ).toEqual(expectedResult)
  })
})

const initialExpandedRowState = {
  fetchingTransaction: false,
  transaction: undefined,
  fetchTransactionError: ''
}

describe('expandedReducer', () => {
  it('returns initialState for unknown action', () => {
    const expectedResult = initialExpandedRowState
    expect(
      expandedReducer(initialExpandedRowState, { type: undefined })
    ).toEqual(expectedResult)
  })

  it('sets for FETCH', () => {
    const expectedResult = {
      fetchingTransaction: true,
      transaction: undefined,
      fetchTransactionError: ''
    }
    expect(
      expandedReducer(initialExpandedRowState, {
        type: types.FETCH_TRANSACTION_FOR_HISTORY_EXPANDED
      })
    ).toEqual(expectedResult)
  })

  it('sets for SUCCESS', () => {
    const expectedResult = {
      fetchingTransaction: false,
      transaction: { transactionId: 'testTransactionId' },
      fetchTransactionError: ''
    }
    expect(
      expandedReducer(initialExpandedRowState, {
        type: types.FETCH_TRANSACTION_FOR_HISTORY_EXPANDED_SUCCESS,
        payload: { data: { transactionId: 'testTransactionId' } }
      })
    ).toEqual(expectedResult)
  })

  it('sets for FAILED', () => {
    const expectedResult = {
      fetchingTransaction: false,
      transaction: undefined,
      fetchTransactionError: 'Error'
    }
    expect(
      expandedReducer(initialExpandedRowState, {
        type: types.FETCH_TRANSACTION_FOR_HISTORY_EXPANDED_FAILED,
        payload: { error: 'Error' }
      })
    ).toEqual(expectedResult)
  })
})

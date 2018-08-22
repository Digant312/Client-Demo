import { combineReducers } from 'redux'
import { transactions } from '@amaas/amaas-core-sdk-js'

import {
  ITransactionHistoryExpandedRowAction,
  ITransactionHistoryGridAction
} from 'actions/data/transactionHistory'
import * as types from 'actions/data/transactionHistory/types'

/* Reducer for the TransactionHistory Grid */

interface ITransactionHistoryGridState {
  fetchingTransactions: boolean
  transactions: (transactions.Transaction & {
    assetClass: string
    assetType: string
  })[]
  fetchTransactionsError: string
}

const initialGridState: ITransactionHistoryGridState = {
  fetchingTransactions: false,
  transactions: [],
  fetchTransactionsError: ''
}

export const gridReducer = (
  state: ITransactionHistoryGridState = initialGridState,
  action: ITransactionHistoryGridAction
) => {
  switch (action.type) {
    case types.FETCH_TRANSACTIONS_FOR_HISTORY_GRID:
      return {
        ...state,
        fetchingTransactions: true,
        fetchTransactionsError: ''
      }
    case types.FETCH_TRANSACTIONS_FOR_HISTORY_GRID_SUCCESS:
      return {
        ...state,
        fetchingTransactions: false,
        transactions: action.payload.data,
        fetchTransactionsError: ''
      }
    case types.FETCH_TRANSACTIONS_FOR_HISTORY_GRID_FAILED:
      return {
        ...state,
        fetchingTransactions: false,
        fetchTransactionsError: action.payload.error
      }
    default:
      return state
  }
}

/* Reducer for the Expanded Transaction */

interface ITransactionHistoryExpandedRowState {
  fetchingTransaction: boolean
  transaction?: transactions.Transaction & { assetType: string }
  fetchTransactionError: string
}

const initialExpandedRowState: ITransactionHistoryExpandedRowState = {
  fetchingTransaction: false,
  transaction: undefined,
  fetchTransactionError: ''
}

export const expandedReducer = (
  state: ITransactionHistoryExpandedRowState = initialExpandedRowState,
  action: ITransactionHistoryExpandedRowAction
) => {
  switch (action.type) {
    case types.FETCH_TRANSACTION_FOR_HISTORY_EXPANDED:
      return { ...state, fetchingTransaction: true, fetchTransactionError: '' }
    case types.FETCH_TRANSACTION_FOR_HISTORY_EXPANDED_SUCCESS:
      return {
        ...state,
        fetchingTransaction: false,
        transaction: action.payload.data,
        fetchTransactionError: ''
      }
    case types.FETCH_TRANSACTION_FOR_HISTORY_EXPANDED_FAILED:
      return {
        ...state,
        fetchingTransaction: false,
        fetchTransactionError: action.payload.error
      }
    default:
      return state
  }
}

export interface ITransactionHistoryState {
  transactionHistoryGrid: ITransactionHistoryGridState
  transactionHistoryExpandedRow: ITransactionHistoryExpandedRowState
}

export default combineReducers({
  transactionHistoryGrid: gridReducer,
  transactionHistoryExpandedRow: expandedReducer
})

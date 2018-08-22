import { Action } from 'redux'
import { transactions } from '@amaas/amaas-core-sdk-js'

import * as types from './types'

export interface ITransactionHistoryGridAction extends Action {
  payload: {
    data?: transactions.Transaction[]
    error?: string
    transactionId?: string
  }
}

export interface ITransactionHistoryExpandedRowAction extends Action {
  payload: {
    data?: transactions.Transaction
    error?: string
    transactionId?: string
    version?: number
  }
}

export const fetchTransactionHistoryForGrid = (transactionId: string) => ({
  type: types.FETCH_TRANSACTIONS_FOR_HISTORY_GRID,
  payload: { transactionId }
})

export const fetchTransactionHistoryForGridSuccess = (
  data: transactions.Transaction[]
) => ({
  type: types.FETCH_TRANSACTIONS_FOR_HISTORY_GRID_SUCCESS,
  payload: { data }
})

export const fetchTransactionHistoryForGridFailed = (error: string) => ({
  type: types.FETCH_TRANSACTIONS_FOR_HISTORY_GRID_FAILED,
  payload: { error }
})

export const fetchTransactionHistoryForExpandedRow = (
  transactionId: string,
  version: number
) => ({
  type: types.FETCH_TRANSACTION_FOR_HISTORY_EXPANDED,
  payload: { transactionId, version }
})

export const fetchTransactionHistoryForExpandedRowSuccess = (
  data: transactions.Transaction
) => ({
  type: types.FETCH_TRANSACTION_FOR_HISTORY_EXPANDED_SUCCESS,
  payload: { data }
})

export const fetchTransactionHistoryForExpandedRowFailed = (error: string) => ({
  type: types.FETCH_TRANSACTION_FOR_HISTORY_EXPANDED_FAILED,
  payload: { error }
})

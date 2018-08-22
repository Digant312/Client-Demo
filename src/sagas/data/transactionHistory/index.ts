import { all, call, put, takeLatest } from 'redux-saga/effects'
import { api, transactions } from '@amaas/amaas-core-sdk-js'

import * as actions from 'actions/data/transactionHistory'
import * as types from 'actions/data/transactionHistory/types'
import { parseError } from 'utils/error'

import { getAMId, parseTransaction } from 'sagas/data'

export const transactionFields = [
  'assetManagerId',
  'transactionDate',
  'references',
  'displayName',
  'transactionType',
  'transactionAction',
  'quantity',
  'price',
  'grossSettlement',
  'netSettlement',
  'transactionCurrency',
  'settlementCurrency',
  'assetBookId',
  'counterpartyBookId',
  'transactionId',
  'assetId',
  'settlementDate',
  'version'
]

export function* fetchTransactionsForGridSaga(
  action: actions.ITransactionHistoryGridAction
) {
  try {
    const AMId = yield* getAMId(true)
    const latestTransaction = yield call(api.Transactions.retrieve, {
      AMId,
      resourceId: action.payload.transactionId
    })
    const numberOfVersions: number = latestTransaction.version || 0
    const callArray = new Array(numberOfVersions).fill(0).map((_, i) => {
      const query = { version: i + 1, fields: transactionFields }
      return call(api.Transactions.retrieve, {
        AMId,
        resourceId: action.payload.transactionId,
        query
      })
    })
    const allVersionsOfTransaction = yield all(callArray)
    const parsedTransactions = yield* parseTransaction({
      AMId,
      transactions: allVersionsOfTransaction,
      dateKeys: ['transactionDate', 'settlementDate']
    })
    yield put(actions.fetchTransactionHistoryForGridSuccess(parsedTransactions))
  } catch (e) {
    const error = (e && parseError(e)) || 'Error fetching Transactions'
    yield put(actions.fetchTransactionHistoryForGridFailed(error))
  }
}

export function* fetchSingleTransactionVersion(
  action: actions.ITransactionHistoryExpandedRowAction
) {
  try {
    const query = { version: action.payload.version }
    const AMId = yield* getAMId(true)
    const transaction = yield call(api.Transactions.retrieve, {
      AMId,
      resourceId: action.payload.transactionId,
      query
    })
    const parsedTransaction = yield* parseTransaction({
      AMId,
      transactions: [transaction],
      dateKeys: ['transactionDate', 'settlementDate']
    })
    yield put(
      actions.fetchTransactionHistoryForExpandedRowSuccess(parsedTransaction[0])
    )
  } catch (e) {
    const error = (e && parseError(e)) || 'Error fetching Transaction'
    yield put(actions.fetchTransactionHistoryForExpandedRowFailed(error))
  }
}

export default [
  takeLatest(
    types.FETCH_TRANSACTIONS_FOR_HISTORY_GRID,
    fetchTransactionsForGridSaga
  ),
  takeLatest(
    types.FETCH_TRANSACTION_FOR_HISTORY_EXPANDED,
    fetchSingleTransactionVersion
  )
]

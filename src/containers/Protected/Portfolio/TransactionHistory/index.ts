import { connect } from 'react-redux'
import { transactions } from '@amaas/amaas-core-sdk-js'

import TransactionHistory, {
  ITransactionHistoryMapProps,
  ITransactionHistoryDispatchProps,
  ITranasctionHistoryOwnProps
} from 'components/Protected/Portfolio/TransactionHistory'
import { IState } from 'reducers'
import {
  dataSelector,
  profileSelector,
  transactionHistoryGridSelector,
  transactionHistoryExpandedRowSelector
} from 'selectors'
import {
  fetchTransactionHistoryForGrid,
  fetchTransactionHistoryForExpandedRow
} from 'actions/data/transactionHistory'

const mapStateToProps = (state: IState) => ({
  dateFormat: profileSelector(state).dateFormat,
  assumedAMID: profileSelector(state).assumedAMID,
  fetchingTransactionsForGrid: transactionHistoryGridSelector(state)
    .fetchingTransactions,
  transactionsInGrid: transactionHistoryGridSelector(state).transactions,
  fetchTransactionsForGridError: transactionHistoryGridSelector(state)
    .fetchTransactionsError,
  fetchingTransactionForExpandedRow: transactionHistoryExpandedRowSelector(
    state
  ).fetchingTransaction,
  transactionForExpandedRow: transactionHistoryExpandedRowSelector(state)
    .transaction,
  fetchingTransactionForExpandedRowError: transactionHistoryExpandedRowSelector(
    state
  ).fetchTransactionError
})

const mapDispatchToProps = (dispatch: Function) => ({
  fetchTransactionsForGrid: (transactionId: string) =>
    dispatch(fetchTransactionHistoryForGrid(transactionId)),
  fetchTransactionForExpandedRow: (transactionId: string, version: number) =>
    dispatch(fetchTransactionHistoryForExpandedRow(transactionId, version))
})

export default connect<
  ITransactionHistoryMapProps,
  ITransactionHistoryDispatchProps,
  ITranasctionHistoryOwnProps
>(mapStateToProps, mapDispatchToProps)(TransactionHistory)

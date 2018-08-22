import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { transactions } from '@amaas/amaas-core-sdk-js'

import Transactions from 'components/Protected/Portfolio/TransactionsList'
import { fetchTransactions } from 'actions/data'
import { IState } from 'reducers'
import { dateFormats } from 'reducers/profile'
import { formValueSelector } from 'redux-form'
import { bookSelectorSelector, dataSelector, profileSelector } from 'selectors'

interface IMapStateProps {
  dateFormat: dateFormats
  assumedAMID: string
  transactionsFetching: boolean
  transactions: (transactions.Transaction & {
    assetClass: string
    assetType: string
  })[]
  fetchError: string
}

interface IMapDispatchProps {
  fetchTransactions: Function
}

const formSelector = formValueSelector('transactionStatusDropDownForm')

const mapStateToProps = (
  state: IState,
  ownProps: RouteComponentProps<{}> & { assetType: string; initialValues: any }
) => {
  const visibleBooks = bookSelectorSelector(state)
    .filter(book => book.visible)
    .map(book => book.bookId)
  return {
    transactionStatusDropDownField: formSelector(
      state,
      'transactionStatusDropDownField'
    ),
    dateFormat: profileSelector(state).dateFormat,
    assumedAMID: profileSelector(state).assumedAMID,
    transactionsFetching: dataSelector(state).transactions.fetching,
    transactions: dataSelector(state).transactions.data.filter(trans => {
      return visibleBooks.indexOf(trans.assetBookId as string) !== -1
    }),
    fetchError: dataSelector(state).transactions.error
  }
}

const mapDispatchToProps = (dispatch: Function) => ({
  fetchTransactions: (query?: any) => dispatch(fetchTransactions(query))
})

export default connect(mapStateToProps, mapDispatchToProps)(Transactions)

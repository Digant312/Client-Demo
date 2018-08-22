import { connect } from 'react-redux'

import EquityHeader from 'components/Protected/Portfolio/EditTransaction/Fields/equityHeader'
import { IState } from 'reducers'
import {
  profileSelector,
  transactionFormAssetSelector,
  transactionFormTransactionSelector
} from 'selectors'

const mapStateToProps = (state: IState) => {
  const asset = transactionFormAssetSelector(state).asset as any
  const transaction = transactionFormTransactionSelector(state).transaction

  return {
    darkProfile: profileSelector(state).darkProfile,
    fetchingAsset: transactionFormAssetSelector(state).fetchingAsset,
    fetchingTransaction: transactionFormTransactionSelector(state)
      .fetchingTransaction,
    asset,
    transaction,
    fetchAssetError: transactionFormAssetSelector(state).fetchError,
    dateFormat: profileSelector(state).dateFormat
  }
}

export default connect(mapStateToProps)(EquityHeader)

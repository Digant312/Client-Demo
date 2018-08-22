import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'

import EquityFormController, {
  IEquityFormControllerProps
} from 'components/Protected/Portfolio/EditTransaction/Controllers/equityFormController'
import {
  fetchAssetForForm,
  fetchTransactionForForm
} from 'actions/data/transactionForm'
import { IState } from 'reducers'
import { profileSelector, transactionFormTransactionSelector } from 'selectors'

export interface IMapStateProps {
  assumedAMID: string
  transactionForForm: any
  assetBookId: string
  parties: any[]
  transactionAction: string
}

const mapStateToProps = (
  state: IState,
  ownProps: IEquityFormControllerProps
) => {
  const equityFormSelector = formValueSelector(ownProps.formName)
  const assetBookId = equityFormSelector(state, 'assetBookId')
  const parties = equityFormSelector(state, 'parties')
  const transactionAction = equityFormSelector(state, 'transactionAction')

  return {
    assumedAMID: profileSelector(state).assumedAMID,
    transactionForForm: transactionFormTransactionSelector(state).transaction,
    assetBookId,
    parties,
    transactionAction
  }
}

export default connect(mapStateToProps)(EquityFormController)

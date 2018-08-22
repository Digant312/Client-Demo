import { connect } from 'react-redux'

import GenericFormController, {
  IGenericFormControllerProps
} from 'components/Protected/Portfolio/EditTransaction/Controllers/genericFormController'
import {
  fetchAssetForForm,
  fetchTransactionForForm
} from 'actions/data/transactionForm'
import { IState } from 'reducers'
import { transactionFormTransactionSelector } from 'selectors'

export interface IMapStateProps {
  transactionForForm: any
}

const mapStateToProps = (
  state: IState,
  ownProps: IGenericFormControllerProps
) => ({
  transactionForForm: transactionFormTransactionSelector(state).transaction
})

export default connect(mapStateToProps)(GenericFormController)

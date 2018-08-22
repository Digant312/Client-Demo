import { connect } from 'react-redux'
import { formValueSelector, FormProps } from 'redux-form'
import { transactions } from '@amaas/amaas-core-sdk-js'
import { Moment } from 'moment'

import FXFormController from 'components/Protected/Portfolio/EditTransaction/Controllers/fxFormController'
import { IState } from 'reducers'
import {
  transactionFormDeliverableSelector,
  transactionFormAssetSelector
} from 'selectors'
import {
  clearAssetForForm,
  fetchAssetForForm,
  fxFormAction,
  requestFXFormDeliverableStatus
} from 'actions/data/transactionForm'

const selector = formValueSelector('fxTransactionForm')

interface IFXFormControllerOwnProps extends FormProps<{}, {}, {}> {
  formName: string
  transaction: transactions.Transaction
  type: 'New' | 'Edit' | 'ReadOnly'
  assetType: string
  children: any
}

const mapStateToProps = (
  state: IState,
  ownProps: IFXFormControllerOwnProps
) => {
  const { asset } = transactionFormAssetSelector(state) as any
  let fixingDate: undefined | Moment = undefined
  if (asset) {
    fixingDate = asset.fixingDate
  }
  return {
    rates: selector(state, 'rates') || [],
    spotOrForward: selector(state, 'spotOrForward'),
    assetPrimaryReference: selector(state, 'assetPrimaryReference'),
    deliverable: transactionFormDeliverableSelector(state).deliverable,
    fixingDate: selector(state, 'fixingDate') || fixingDate,
    valueDate: selector(state, 'settlementDate')
  }
}

const mapDispatchToProps = (dispatch: Function) => ({
  fxFormAction: (data: {
    actionType: string
    transactionId?: string
    transaction?: any
  }) => dispatch(fxFormAction({ formName: 'fxTransactionForm', ...data })),
  fetchAssetForForm: (assetPrimaryReference: string) =>
    dispatch(fetchAssetForForm(assetPrimaryReference)),
  setDeliverableStatus: (assetPrimaryReference: string) =>
    dispatch(requestFXFormDeliverableStatus(assetPrimaryReference)),
  clearAssetForForm: () => dispatch(clearAssetForForm())
})

export default connect(mapStateToProps, mapDispatchToProps)(FXFormController)

import React from 'react'
import { reduxForm, FormProps } from 'redux-form'
import { transactions } from '@amaas/amaas-core-sdk-js'
import TransactionFormController from 'containers/Protected/Portfolio/EditTransaction/Controllers'
import { IMapStateProps } from 'containers/Protected/Portfolio/EditTransaction/Controllers/equityFormController'

export interface ICashFormControllerProps {
  formName: string
  transaction: transactions.CashTransaction
  type: 'Edit' | 'New' | 'ReadOnly'
  assetType: string
  children: any
}

class CashFormController extends React.Component<
  ICashFormControllerProps & IMapStateProps & FormProps<{}, {}, {}>
> {
 render() {
    return <TransactionFormController {...this.props} />
  }
}

export default reduxForm({
  form: 'cashTransactionForm'
})(CashFormController)

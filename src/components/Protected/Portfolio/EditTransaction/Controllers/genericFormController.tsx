import React from 'react'
import { reduxForm, FormProps } from 'redux-form'
import { transactions } from '@amaas/amaas-core-sdk-js'

import TransactionFormController from 'containers/Protected/Portfolio/EditTransaction/Controllers'
import { ITransactionFormControllerProps } from 'components/Protected/Portfolio/EditTransaction/Controllers'
import { IMapStateProps } from 'containers/Protected/Portfolio/EditTransaction/Controllers/equityFormController'

export interface IGenericFormControllerProps {
  formName: string
  transaction: transactions.Transaction
  type: 'Edit' | 'New' | 'ReadOnly'
  assetType: string
  children: any
}

class GenericFormController extends React.Component<
  IGenericFormControllerProps & IMapStateProps & FormProps<{}, {}, {}>
> {
  render() {
    return <TransactionFormController {...this.props} />
  }
}

export default reduxForm({ form: 'genericTransactionForm' })(
  GenericFormController
)

import React from 'react'
import { reduxForm, FormProps } from 'redux-form'
import numeral from 'numeral'
import { transactions } from '@amaas/amaas-core-sdk-js'

import TransactionFormController from 'containers/Protected/Portfolio/EditTransaction/Controllers'
import { ITransactionFormControllerProps } from 'components/Protected/Portfolio/EditTransaction/Controllers'
import { IMapStateProps } from 'containers/Protected/Portfolio/EditTransaction/Controllers/futureFormController'

export interface IFutureFormControllerProps {
  formName: string
  transaction: transactions.Transaction
  type: 'Edit' | 'New' | 'ReadOnly'
  assetType: string
  children: any
}

class FutureFormController extends React.Component<
  IFutureFormControllerProps & IMapStateProps & FormProps<{}, {}, {}>
> {
  constructor() {
    super()
    this.calculateFutureGrossSettlement = this.calculateFutureGrossSettlement.bind(
      this
    )
  }

  calculateFutureGrossSettlement(
    quantity: string | number,
    price: string | number,
    additionalValues: any[]
  ): Numeral {
    return numeral(quantity)
      .multiply(numeral(price).value())
      .multiply(numeral(this.props.pointValue).value())
  }

  render() {
    return (
      <TransactionFormController
        {...this.props}
        overrideCalculateGrossSettlement={this.calculateFutureGrossSettlement}
      />
    )
  }
}

export default reduxForm({ form: 'futureTransactionForm' })(
  FutureFormController
)

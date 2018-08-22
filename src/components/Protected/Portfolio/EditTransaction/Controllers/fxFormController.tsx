import React from 'react'
import { reduxForm, FormProps } from 'redux-form'
import { transactions } from '@amaas/amaas-core-sdk-js'
import moment, { Moment } from 'moment'
import momentBusiness from 'moment-business'

import { addOrRemoveChildField } from 'utils/form'

import TransactionFormController from 'containers/Protected/Portfolio/EditTransaction/Controllers'
import { ITransactionFormControllerProps } from 'components/Protected/Portfolio/EditTransaction/Controllers'

interface IFXTransFormControllerProps extends FormProps<{}, {}, {}> {
  rates: any[]
  spotOrForward: 'ForeignExchangeSpot' | 'ForeignExchangeForward'
  fixingDate: Moment
  valueDate: Moment
  assetPrimaryReference: string
  formName: string
  transaction: transactions.Transaction
  type: 'New' | 'Edit' | 'ReadOnly'
  assetType: string
  children: any
  deliverable: boolean | undefined
  fxFormAction: (
    data: { actionType: string; transactionId?: string; transaction?: any }
  ) => void
  fetchAssetForForm: (assetPrimaryReference: string) => void
  setDeliverableStatus: (assetPrimaryReference: string) => void
  clearAssetForForm: () => void
}

class FXFormController extends React.Component<IFXTransFormControllerProps> {
  constructor() {
    super()
    this.handleFormAction = this.handleFormAction.bind(this)
  }
  componentWillReceiveProps(nextProps: IFXTransFormControllerProps) {
    const assetPrimaryReferenceChanged =
      this.props.assetPrimaryReference !== nextProps.assetPrimaryReference
    const valueDateChanged =
      (this.props.valueDate &&
        nextProps.valueDate &&
        !this.props.valueDate.isSame(nextProps.valueDate)) ||
      (!this.props.valueDate && nextProps.valueDate)
    if (assetPrimaryReferenceChanged) {
      if (!nextProps.assetPrimaryReference) {
        return this.props.clearAssetForForm()
      }
      this.props.fetchAssetForForm(nextProps.assetPrimaryReference)
      this.props.setDeliverableStatus(nextProps.assetPrimaryReference)
    }
    if (valueDateChanged && this.props.change && this.props.type === 'New') {
      const valueDate = moment(nextProps.valueDate)
      const defaultFixingDate = momentBusiness.subtractWeekDays(valueDate, 2)
      this.props.change('fixingDate', defaultFixingDate)
    }
  }

  handleFormAction(data: any) {
    this.props.fxFormAction(data)
  }

  render() {
    return (
      <TransactionFormController
        {...this.props}
        additionalFormFields={{
          spotOrForward: this.props.assetType,
          fixingDate: this.props.fixingDate
        }}
        handleFormAction={this.handleFormAction}
      />
    )
  }
}

export default reduxForm({ form: 'fxTransactionForm' })(FXFormController)

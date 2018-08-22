import React from 'react'
import { FormProps, reduxForm } from 'redux-form'
import { api, books, transactions } from '@amaas/amaas-core-sdk-js'
import numeral from 'numeral'

import {
  calculateGrossSettlement,
  calculateNetSettlement,
  calculateTotalNetAffectingCharges,
  addOrRemoveChildField
} from 'utils/form'
import {
  IMapStateProps,
  IMapDispatchProps
} from 'containers/Protected/Portfolio/EditTransaction/Controllers'

export interface ITransactionFormControllerOwnProps
  extends FormProps<any, {}, {}> {
  formName: string
  type: 'Edit' | 'New' | 'ReadOnly'
  transaction?: any
  assetType?: string
  children: any
  handleFormAction?: (
    params: { actionType: string; transactionId?: string; transaction?: any }
  ) => void
  additionalFormFields?: any
}

export interface ITransactionFormControllerProps
  extends ITransactionFormControllerOwnProps {
  hasPropChanged?: (
    thisProps: any,
    nextProps: any
  ) => (propName: string) => boolean
  addOrRemoveChildField?: (
    thisProps: any,
    nextProps: any
  ) => (
    childType: string
  ) => (childName: string) => (addOrRemove: 'add' | 'remove') => void
  overrideCalculateTotalNetAffectingCharges?: (charges: any[]) => Numeral
  overrideCalculateGrossSettlement?: (
    quantity: string | number,
    price: string | number,
    additionalValues: any[]
  ) => Numeral
  additionalGrossSettlementArgs?: any[]
  overrideCalculateNetSettlement?: (
    grossSettlement: string | number,
    charges: string | number,
    transactionAction: string
  ) => Numeral
}

class TransactionFormController extends React.Component<
  ITransactionFormControllerProps & IMapStateProps & IMapDispatchProps,
  {}
> {
  constructor() {
    super()
    this.calculateSettlement = this.calculateSettlement.bind(this)
    this.getCounterpartyBookPartyId = this.getCounterpartyBookPartyId.bind(this)
    this.handleFormAction = this.handleFormAction.bind(this)
  }
  componentDidMount() {
    const { transactionId, assetId } = this.props.transaction
    if (transactionId && assetId) {
      // the form data already has a transactionId and assetId (i.e. it is an edit/readonly form)
      this.props.fetchTransactionForForm(transactionId)
      this.props.fetchAssetForForm(assetId)
    } else {
      // the form data is empty (new transaction form)
      this.props.initialize && this.props.initialize(this.props.transaction) // initialize with the default values
    }
  }

  componentWillReceiveProps(
    nextProps: ITransactionFormControllerProps &
      IMapStateProps &
      IMapDispatchProps
  ) {
    if (!this.props.change) return
    const hasPropChanged = this.hasPropChanged(this.props, nextProps)
    const quantityChanged = hasPropChanged('quantity')
    const priceChanged = hasPropChanged('price')
    const chargesChanged = hasPropChanged('charges')
    const additionalGrossSettlementVariablesChanged = hasPropChanged(
      'additionalGrossSettlementArgs'
    )
    const transactionActionChanged = hasPropChanged('transactionAction')
    const assetIdChanged = hasPropChanged('assetId')
    const counterpartyBookIdChanged = hasPropChanged('counterpartyBookId')
    const transactionForFormChanged = hasPropChanged('transactionForForm')
    const transactionCurrencyChanged = hasPropChanged('transactionCurrency')
    const {
      charges,
      quantity,
      price,
      transactionAction,
      additionalGrossSettlementArgs
    } = nextProps

    if (
      quantityChanged ||
      priceChanged ||
      chargesChanged ||
      transactionActionChanged ||
      additionalGrossSettlementVariablesChanged
    ) {
      this.calculateSettlement(
        charges,
        quantity,
        price,
        transactionAction,
        additionalGrossSettlementArgs
      )
    }

    if (transactionActionChanged && this.props.transactionAction) {
      const updateRebateRate = addOrRemoveChildField(this.props, nextProps)(
        'rates'
      )('Rebate Rate')
      const updateBorrowingRate = addOrRemoveChildField(this.props, nextProps)(
        'rates'
      )('Borrowing Cost')
      // if new action is buy type, remove rebate rate and borrowing cost
      if (
        nextProps.transactionAction === 'Buy' ||
        nextProps.transactionAction === 'Short Cover'
      ) {
        updateBorrowingRate('remove')
        updateRebateRate('remove')
      }
      // if new action is sell type and previous action is not sell type, add rebate rate and borrowing cost
      if (
        nextProps.transactionAction === 'Sell' ||
        nextProps.transactionAction === 'Short Sell'
      ) {
        const assetTypesWithoutRebateBorrowingRate = [
          'ForeignExchange',
          'ForeignExchangeSpot',
          'ForeignExchangeForward',
          'Future'
        ]
        if (
          this.props.transactionAction === 'Sell' ||
          this.props.transactionAction === 'Short Sell' ||
          assetTypesWithoutRebateBorrowingRate.indexOf(
            this.props.assetType || ''
          ) !== -1
        )
          return
        updateRebateRate('add', { rateValue: '0' })
        updateBorrowingRate('add', { rateValue: '0' })
      }
    }

    if (assetIdChanged) {
      if (!nextProps.assetId) {
        return this.props.clearAssetForForm()
      }
      this.props.fetchAssetForForm(nextProps.assetId)
    }

    if (transactionCurrencyChanged && this.props.change) {
      this.props.change('transactionCurrency', nextProps.transactionCurrency)
      this.props.change('settlementCurrency', nextProps.transactionCurrency)
    }

    if (counterpartyBookIdChanged) {
      this.getCounterpartyBookPartyId(this.props, nextProps)
    }

    if (
      transactionForFormChanged &&
      nextProps.transactionForForm &&
      this.props.initialize
    ) {
      this.props.initialize({
        ...nextProps.transactionForForm,
        ...this.props.additionalFormFields
      })
    }
  }

  componentWillUnmount() {
    this.props.clearActionErrors()
    this.props.clearAssetForForm() // clear asset info in store
    this.props.clearTransactionForForm() // clear transaction info in store
  }

  async getCounterpartyBookPartyId(thisProps: any, nextProps: any) {
    const book = (await api.Books.retrieve({
      AMId: parseInt(this.props.assumedAMID),
      resourceId: nextProps.counterpartyBookId
    })) as any
    const partyId = book.partyId

    addOrRemoveChildField(thisProps, nextProps)('parties')(
      'Counterparty'
    )('add', { partyId })
  }

  calculateSettlement(
    charges: any,
    price: any,
    quantity: any,
    transactionAction: string,
    additionalGrossSettlementArgs?: any[]
  ) {
    if (!this.props.change) return

    const resolvedCalculateNetAffecting =
      this.props.overrideCalculateTotalNetAffectingCharges ||
      calculateTotalNetAffectingCharges
    const resolvedCalculateGrossSettlement =
      this.props.overrideCalculateGrossSettlement || calculateGrossSettlement
    const resolvedCalculateNetSettlement =
      this.props.overrideCalculateNetSettlement || calculateNetSettlement

    let netAffectingCharges = numeral(0)
    if (charges) {
      netAffectingCharges = resolvedCalculateNetAffecting(charges)
    }
    const calculatedGrossSettlement = resolvedCalculateGrossSettlement(
      quantity,
      price,
      additionalGrossSettlementArgs
    ).value()
    const calculatedNetSettlement = resolvedCalculateNetSettlement(
      calculatedGrossSettlement,
      netAffectingCharges.value(),
      transactionAction
    ).value()
    this.props.change('grossSettlement', calculatedGrossSettlement)
    this.props.change('netSettlement', calculatedNetSettlement)
  }

  hasPropChanged(thisProps: any, nextProps: any) {
    return (propName: string) => {
      if (
        Array.isArray(thisProps[propName]) ||
        Array.isArray(nextProps[propName])
      ) {
        for (let prop in thisProps[propName]) {
          if (thisProps[propName] !== nextProps[propName]) return true
        }
        return false
      }
      return thisProps[propName] !== nextProps[propName]
    }
  }

  handleFormAction(params: {
    actionType: string
    transactionId?: string
    transaction?: any
  }) {
    let resolvedFormActionFunction = this.props.requestTransactionFormAction
    if (
      this.props.handleFormAction &&
      typeof this.props.handleFormAction === 'function'
    ) {
      resolvedFormActionFunction = this.props.handleFormAction
    }
    resolvedFormActionFunction(params)
  }

  render() {
    const { children: Child, ...otherProps } = this.props
    return <Child {...otherProps} onFormAction={this.handleFormAction} />
  }
}

export default TransactionFormController

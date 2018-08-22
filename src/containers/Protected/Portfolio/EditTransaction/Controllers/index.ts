import { connect } from 'react-redux'
import {
  formValueSelector,
  getFormMeta,
  FormProps,
  getFormValues
} from 'redux-form'
import { books, transactions } from '@amaas/amaas-core-sdk-js'
import numeral from 'numeral'

import TransactionFormController, {
  ITransactionFormControllerProps
} from 'components/Protected/Portfolio/EditTransaction/Controllers'
import { IState } from 'reducers'
import {
  dataSelector,
  profileSelector,
  transactionFormAssetSelector,
  transactionFormTransactionSelector,
  transactionFormActionSelector
} from 'selectors'
import { fetchTransactions } from 'actions/data'
import {
  calculateGrossSettlement,
  calculateNetSettlement,
  calculateTotalNetAffectingCharges
} from 'utils/form'
import {
  fetchAssetForForm,
  fetchTransactionForForm,
  transactionFormActionRequest,
  clearTransactionForForm,
  clearAssetForForm,
  transactionFormActionClear
} from 'actions/data/transactionForm'

export interface IMapStateProps {
  dateFormat: string
  assumedAMID: string
  darkProfile: boolean
  books: books.Book[]
  assetId: string
  quantity: string
  price: string
  charges: any[]
  parties: any[]
  rates: any[]
  counterpartyBookId: string
  transactionAction: string
  settlementCurrency: string
  formMetaState: any
  transactionCurrency?: string
  fetchingTransactionForForm: boolean
  transactionForForm: any
  fetchTransactionError: string
  formActionWorking: boolean
  formActionError: string
}

export interface IMapDispatchProps {
  fetchAssetForForm: (assetId: string) => void
  fetchTransactionForForm: (transactionId: string) => void
  requestTransactionFormAction: (
    {
      actionType,
      transactionId,
      transaction
    }: {
      actionType: string
      transactionId?: string
      transaction?: any
    }
  ) => void
  clearAssetForForm: () => void
  clearTransactionForForm: () => void
  clearActionErrors: () => void
}

const mapStateToProps = (state: IState, ownProps: any) => {
  const transactionForForm = transactionFormTransactionSelector(state)
    .transaction
  const selector = formValueSelector(ownProps.formName)
  const metaSelector = getFormMeta<any>(ownProps.formName)
  const assetId = selector(state, 'assetId')
  const quantity = selector(state, 'quantity') || 0
  const price = selector(state, 'price') || 0
  const counterpartyBookId = selector(state, 'counterpartyBookId')
  const charges = selector(state, 'charges')
  const parties = selector(state, 'parties')
  const rates = selector(state, 'rates')
  const transactionAction = selector(state, 'transactionAction')
  const settlementCurrency = selector(state, 'settlementCurrency')
  const formMetaState = metaSelector(state)
  const assetOnTransactionForm = transactionFormAssetSelector(state).asset || {
    currency: ''
  }
  const transactionCurrency = assetOnTransactionForm.currency

  return {
    dateFormat: profileSelector(state).dateFormat,
    assumedAMID: profileSelector(state).assumedAMID,
    darkProfile: profileSelector(state).darkProfile,
    books: dataSelector(state).books.data,
    assetId,
    quantity,
    price,
    charges,
    parties,
    rates,
    counterpartyBookId,
    transactionAction,
    settlementCurrency,
    formMetaState,
    fetchingTransactionForForm: transactionFormTransactionSelector(state)
      .fetchingTransaction,
    transactionForForm,
    fetchTransactionError: transactionFormTransactionSelector(state).fetchError,
    transactionCurrency,
    formActionWorking: transactionFormActionSelector(state).working,
    formActionError: transactionFormActionSelector(state).error
  }
}

const mapDispatchToProps = (dispatch: Function) => ({
  fetchAssetForForm: (assetId: string) => dispatch(fetchAssetForForm(assetId)),
  fetchTransactionForForm: (transactionId: string) =>
    dispatch(fetchTransactionForForm(transactionId)),
  requestTransactionFormAction: ({
    formName,
    actionType,
    transactionId,
    transaction
  }: {
    formName: string
    actionType: string
    transactionId?: string
    transaction?: any
  }) =>
    dispatch(
      transactionFormActionRequest({
        formName,
        actionType,
        transactionId,
        transaction
      })
    ),
  clearAssetForForm: () => dispatch(clearAssetForForm()),
  clearTransactionForForm: () => dispatch(clearTransactionForForm()),
  clearActionErrors: () => dispatch(transactionFormActionClear())
})

export default connect<
  IMapStateProps,
  IMapDispatchProps,
  ITransactionFormControllerProps
>(mapStateToProps, mapDispatchToProps)(TransactionFormController)

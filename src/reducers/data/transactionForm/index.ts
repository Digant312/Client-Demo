import { combineReducers } from 'redux'
import { assets, transactions } from '@amaas/amaas-core-sdk-js'
import { Moment } from 'moment'
import {
  ITransactionDeliverableAction,
  ITransactionFormAssetAction,
  ITransactionFormTransactionAction,
  ITransactionFormActionAction
} from 'actions/data/transactionForm'
import * as types from 'actions/data/transactionForm/types'

/* Reducer for the actual transaction */
interface ITransactionFormTransactionState {
  fetchingTransaction: boolean
  transaction?: transactions.Transaction & {
    createdTime: Moment
    updatedTime: Moment
    executionTime: Moment
  }
  fetchError: string
}
const initialTransactionState = {
  fetchingTransaction: false,
  transaction: undefined,
  fetchError: ''
}
export const transactionFormTransaction = (
  state: ITransactionFormTransactionState = initialTransactionState,
  action: ITransactionFormTransactionAction
) => {
  switch (action.type) {
    case types.FETCH_TRANSACTION_FOR_FORM:
      return { ...state, fetchingTransaction: true, fetchError: '' }
    case types.FETCH_TRANSACTION_FOR_FORM_SUCCESS:
      return {
        ...state,
        fetchingTransaction: false,
        transaction: action.payload.data,
        fetchError: ''
      }
    case types.FETCH_TRANSACTION_FOR_FORM_FAILED:
      return {
        ...state,
        fetchingTransaction: false,
        fetchError: action.payload.error
      }
    case types.CLEAR_TRANSACTION_FOR_FORM:
      return initialTransactionState
    default:
      return state
  }
}

/* Reducer for the asset on the transaction */
interface ITransactionFormAssetState {
  fetchingAsset: boolean
  asset?: assets.AssetClassTypes
  fetchError: string
}
const initialAssetState = {
  fetchingAsset: false,
  asset: undefined,
  fetchError: ''
}
export const transactionFormAsset = (
  state: ITransactionFormAssetState = initialAssetState,
  action: ITransactionFormAssetAction
) => {
  switch (action.type) {
    case types.FETCH_ASSET_FOR_FORM:
      return { ...state, fetchingAsset: true, fetchError: '' }
    case types.FETCH_ASSET_FOR_FORM_SUCCESS:
      return {
        ...state,
        fetchingAsset: false,
        asset: action.payload.data,
        fetchError: ''
      }
    case types.FETCH_ASSET_FOR_FORM_FAILED:
      return {
        ...state,
        fetchingAsset: false,
        fetchError: action.payload.error
      }
    case types.CLEAR_ASSET_FOR_FORM:
      return initialAssetState
    default:
      return state
  }
}

/* Reducer for transaction form actions */
interface ITransactionFormActionState {
  working: boolean
  error: string
}
const initialFormActionState = {
  working: false,
  error: ''
}
export const transactionFormAction = (
  state: ITransactionFormActionState = initialFormActionState,
  action: ITransactionFormActionAction
) => {
  switch (action.type) {
    case types.TRANSACTION_FORM_ACTION:
    case types.FX_FORM_ACTION:
      return { ...state, working: true, error: '' }
    case types.TRANSACTION_FORM_ACTION_SUCCESS:
      return { ...state, working: false, error: '' }
    case types.TRANSACTION_FORM_ACTION_FAILED:
      return { ...state, working: false, error: action.payload.error }
    case types.TRANSACTION_FORM_ACTION_CLEAR:
      return initialFormActionState
    default:
      return state
  }
}

/* Reducer for whether the FX pair is deliverable (not very nice going here but OK for now) */
interface ITransactionDeliverableStatusState {
  fetching: boolean
  deliverable?: boolean
  error?: string
}
const initialDeliverableState = {
  fetching: false,
  deliverable: undefined,
  error: undefined
}
export const transactionDeliverableStatus = (
  state: ITransactionDeliverableStatusState = initialDeliverableState,
  action: ITransactionDeliverableAction
) => {
  switch (action.type) {
    case types.REQUEST_DELIVERABLE_STATUS:
      return { ...state, fetching: true, error: undefined }
    case types.DELIVERABLE_STATUS_SUCCESS:
      return {
        ...state,
        fetching: false,
        deliverable: action.payload.deliverable
      }
    case types.DELIVERABLE_STATUS_FAILED:
      return { ...state, fetching: false, error: action.payload.error }
    case types.CLEAR_ASSET_FOR_FORM:
      return initialDeliverableState
    default:
      return state
  }
}

export interface ITransactionFormState {
  transactionFormTransaction: ITransactionFormTransactionState
  transactionFormAsset: ITransactionFormAssetState
  transactionFormAction: ITransactionFormActionState
  transactionDeliverableStatus: ITransactionDeliverableStatusState
}

export default combineReducers({
  transactionFormTransaction,
  transactionFormAsset,
  transactionFormAction,
  transactionDeliverableStatus
})

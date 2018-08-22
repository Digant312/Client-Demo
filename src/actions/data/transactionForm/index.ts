import { Action } from 'redux'
import { assets, transactions } from '@amaas/amaas-core-sdk-js'

import * as types from './types'

/* Transaction action creators */
export interface ITransactionFormTransactionAction extends Action {
  payload: {
    transactionId?: string
    data?: transactions.Transaction
    error?: string
  }
}

export const fetchTransactionForForm = (
  transactionId: string
): ITransactionFormTransactionAction => ({
  type: types.FETCH_TRANSACTION_FOR_FORM,
  payload: { transactionId }
})

export const fetchTransactionForFormSuccess = (
  data: transactions.Transaction
): ITransactionFormTransactionAction => ({
  type: types.FETCH_TRANSACTION_FOR_FORM_SUCCESS,
  payload: { data }
})

export const fetchTransactionForFormFailed = (
  error: string
): ITransactionFormTransactionAction => ({
  type: types.FETCH_TRANSACTION_FOR_FORM_FAILED,
  payload: { error }
})

export const clearTransactionForForm = () => ({
  type: types.CLEAR_TRANSACTION_FOR_FORM,
  payload: {}
})

/* Asset action creators */
export interface ITransactionFormAssetAction extends Action {
  payload: {
    assetId?: string
    data?: assets.AssetClassTypes
    error?: string
  }
}

export const fetchAssetForForm = (
  assetId: string
): ITransactionFormAssetAction => ({
  type: types.FETCH_ASSET_FOR_FORM,
  payload: { assetId }
})

export const fetchAssetForFormSuccess = (
  data: assets.AssetClassTypes
): ITransactionFormAssetAction => ({
  type: types.FETCH_ASSET_FOR_FORM_SUCCESS,
  payload: { data }
})

export const fetchAssetForFormFailed = (
  error: string
): ITransactionFormAssetAction => ({
  type: types.FETCH_ASSET_FOR_FORM_FAILED,
  payload: { error }
})

export const clearAssetForForm = () => ({
  type: types.CLEAR_ASSET_FOR_FORM,
  payload: {}
})

/* Form action - insert, amend or cancel */
export interface ITransactionFormActionAction extends Action {
  payload: {
    formName: string
    actionType?: string
    transactionId?: string
    transaction?: any
    error?: string
  }
}

export const transactionFormActionRequest = ({
  formName,
  actionType,
  transactionId,
  transaction
}: {
  formName: string
  actionType: string
  transactionId?: string
  transaction?: any
}) => ({
  type: types.TRANSACTION_FORM_ACTION,
  payload: { formName, actionType, transactionId, transaction }
})

export const transactionFormActionSuccess = () => ({
  type: types.TRANSACTION_FORM_ACTION_SUCCESS,
  payload: {}
})

export const transactionFormActionFailed = (error: string) => ({
  type: types.TRANSACTION_FORM_ACTION_FAILED,
  payload: { error }
})

export const transactionFormActionClear = () => ({
  type: types.TRANSACTION_FORM_ACTION_CLEAR,
  payload: {}
})

/* One of action for fx form action */
export const fxFormAction = (params: {
  formName: string
  actionType: string
  transactionId?: string
  transaction?: any
}) => ({
  type: types.FX_FORM_ACTION,
  payload: { ...params }
})

/* To check whether the selected FX pair is deliverable */
export interface ITransactionDeliverableAction extends Action {
  payload: {
    assetPrimaryReference?: string
    deliverable?: string
    error?: string
  }
}
export const requestFXFormDeliverableStatus = (
  assetPrimaryReference: string
) => ({
  type: types.REQUEST_DELIVERABLE_STATUS,
  payload: { assetPrimaryReference }
})
export const fxDeliverableStatusSuccess = (deliverable?: boolean) => ({
  type: types.DELIVERABLE_STATUS_SUCCESS,
  payload: { deliverable }
})
export const fxDeliverableStatusFailed = (error: string) => ({
  type: types.DELIVERABLE_STATUS_FAILED,
  payload: { error }
})

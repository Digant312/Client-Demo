import { reset } from 'redux-form'
import { call, put, select, takeLatest } from 'redux-saga/effects'
import { api, assets } from '@amaas/amaas-core-sdk-js'
import moment from 'moment'

import { fetchTransactions } from 'actions/data'
import * as actions from 'actions/data/transactionForm'
import * as types from 'actions/data/transactionForm/types'
import { parseError } from 'utils/error'
import { convertToAMaaSDate, getPrimaryChild } from 'utils/form'
import { getAMId, parseTransaction } from 'sagas/data'
import { profileSelector } from 'selectors'
import {
  errorToast,
  successToast
} from 'components/Shared/ArgomiToastContainer'

export function* fetchTransaction(
  action: actions.ITransactionFormTransactionAction
) {
  if (!action.payload.transactionId) {
    yield put(actions.fetchTransactionForFormFailed('Missing Transaction ID'))
    return
  }

  try {
    const AMId = yield* getAMId(true)
    const transaction = yield call(api.Transactions.retrieve, {
      AMId,
      resourceId: action.payload.transactionId
    })
    const parsedTransaction = yield* parseTransaction({
      AMId,
      transactions: [transaction],
      dateKeys: [
        'transactionDate',
        'settlementDate',
        'createdTime',
        'updatedTime'
      ]
    })
    return parsedTransaction
  } catch (err) {
    const error = (err && parseError(err)) || 'Error fetching Transaction'
    yield put(actions.fetchTransactionForFormFailed(error))
  }
}

export function convertToFormValues(transaction: any, children: string[]) {
  const convertedChildren = children.map(childType => {
    if (transaction[childType]) {
      return {
        [childType]: Object.keys(transaction[childType]).map(name => ({
          name,
          ...transaction[childType][name]
        }))
      }
    }
  })
  const reducedChildren = convertedChildren.reduce((arr: any, curr: any) => {
    return { ...arr, ...curr }
  }, {})
  return { ...transaction, ...reducedChildren }
}

export function convertLinksToFormValues(transaction: any) {
  if (!transaction.links) return transaction
  const links = Object.keys(transaction.links).map(name => ({
    name,
    links: transaction.links[name].map((link: any) => ({
      ...link
    }))
  }))
  return { ...transaction, links }
}

export function* fetchTransactionForForm(
  action: actions.ITransactionFormTransactionAction
) {
  try {
    const transaction = yield* fetchTransaction(action)
    const linksConverted = convertLinksToFormValues(transaction[0])
    const childrenConverted = convertToFormValues(linksConverted, [
      'charges',
      'codes',
      'comments',
      'parties',
      'rates',
      'references'
    ])
    yield put(actions.fetchTransactionForFormSuccess(childrenConverted))
  } catch (err) {
    const error = parseError(err) || 'Error fetching transaction'
    yield put(actions.fetchTransactionForFormFailed(error))
  }
}

export function* fetchAssetForForm(
  action: actions.ITransactionFormAssetAction
) {
  if (!action.payload.assetId) {
    yield put(actions.fetchAssetForFormFailed('No Asset ID'))
    return
  }
  try {
    const AMId = yield* getAMId(true)
    let asset = yield call(api.Assets.retrieve, {
      AMId,
      resourceId: action.payload.assetId
    })

    if (asset.fixingDate) {
      asset = { ...asset, fixingDate: moment(asset.fixingDate) }
    }

    // @Note: Don't get the primary reference of the underlying asset ID for now
    /*
    if (asset.underlyingAssetId) {
      const underlying = yield call(api.Assets.retrieve, {
        AMId,
        resourceId: asset.underlyingAssetId
      })
      const { referenceValue: underlyingPrimaryReference } = getPrimaryChild(
        underlying.references,
        'referencePrimary'
      )
      asset = { ...asset, underlyingPrimaryReference }
    }
    */

    yield put(actions.fetchAssetForFormSuccess(asset))
  } catch (err) {
    const error = parseError(err) || 'Error fetching Asset'
    yield put(actions.fetchAssetForFormFailed(error))
  }
}

export function* transactionFormActionSaga(
  action: actions.ITransactionFormActionAction
) {
  switch (action.payload.actionType) {
    case 'insert':
      yield* insertTransactionSaga(
        action.payload.transaction,
        action.payload.formName
      )
      break
    case 'amend':
      yield* amendTransactionSaga(action.payload.transaction)
      break
    case 'cancel':
      if (action.payload.transactionId) {
        yield* cancelTransactionSaga(action.payload.transactionId)
      }
      break
    default:
      yield put(
        actions.transactionFormActionFailed(
          `Error in action: ${action.payload.actionType}`
        )
      )
  }
}

export function* insertTransactionSaga(
  transactionFormValues: any,
  formName: string
) {
  try {
    const AMId = yield* getAMId(true)
    const convertedTransaction = yield* convertTransactionToAMaaS(
      transactionFormValues
    )
    yield call(api.Transactions.insert, {
      AMId,
      transaction: convertedTransaction
    })
    yield put(actions.transactionFormActionSuccess())
    yield call(successToast, 'Success')
    yield put(reset(formName))
  } catch (err) {
    console.error(err)
    const error = parseError(err) || 'Error inserting Transaction'
    yield call(errorToast, error)
    yield put(actions.transactionFormActionFailed(error))
  }
}

export function* amendTransactionSaga(transactionFormValues: any) {
  try {
    const AMId = yield* getAMId(true)
    const convertedTransaction = yield* convertTransactionToAMaaS(
      transactionFormValues
    )
    yield call(api.Transactions.amend, {
      AMId,
      resourceId: transactionFormValues.transactionId,
      transaction: convertedTransaction
    })
    yield put(actions.transactionFormActionSuccess())
    yield put(fetchTransactions())
  } catch (err) {
    console.error(err)
    const error = parseError(err) || 'Error amending Transaction'
    yield call(errorToast, error)
    yield put(actions.transactionFormActionFailed(error))
  }
}

export function* cancelTransactionSaga(transactionId: string) {
  try {
    const AMId = yield* getAMId(true)
    yield call(api.Transactions.cancel, { AMId, resourceId: transactionId })
    yield put(actions.transactionFormActionSuccess())
    yield put(fetchTransactions())
  } catch (err) {
    const error = parseError(err) || 'Error cancelling Transaction'
    yield call(errorToast, error)
    yield put(actions.transactionFormActionFailed(error))
  }
}

export function* convertTransactionToAMaaS(transaction: any) {
  const transactionChargesWithCurrency = addCurrencyToCharges(transaction)

  const transactionWithSanitisedNumbers = sanitiseNumbers(
    transactionChargesWithCurrency,
    ['quantity', 'price', 'grossSettlement', 'netSettlement']
  )

  const transactionWithConvertedDates = convertDatesToAMaaSFormat(
    transactionWithSanitisedNumbers,
    ['transactionDate', 'settlementDate']
  )

  const transactionWithConvertedLinks = childLinksToObject(
    transactionWithConvertedDates
  )

  const transactionWithConvertedChildren = childArrayToObject(
    transactionWithConvertedLinks,
    ['references', 'codes', 'comments', 'parties', 'rates', 'charges']
  )

  return transactionWithConvertedChildren
}

export function sanitiseNumbers(transaction: any, numberFields: string[]) {
  let sanitisedNumbers: any = {}
  let charges = transaction.charges
  numberFields.map(field => {
    if (transaction[field]) {
      let number = transaction[field].toString
        ? transaction[field].toString()
        : transaction[field]
      sanitisedNumbers[field] = number.replace(/,/g, '')
    }
  })

  if (transaction.charges) {
    charges = transaction.charges.map((charge: { chargeValue: string }) => {
      let chargeValue = charge.chargeValue.toString
        ? charge.chargeValue.toString()
        : charge.chargeValue
      const sanitisedCharge = chargeValue.replace(/,/g, '')
      return { ...charge, chargeValue: sanitisedCharge }
    })
  }

  return { ...transaction, ...sanitisedNumbers, charges }
}

export function addCurrencyToCharges(transaction: any) {
  const charges = transaction.charges || []
  const chargesWithCurrency = charges.map((charge: object) => ({
    ...charge,
    currency: transaction.settlementCurrency
  }))
  return { ...transaction, charges: chargesWithCurrency }
}

export function convertDatesToAMaaSFormat(transaction: any, dates: string[]) {
  let convertedDates: any = {}
  dates.map(date => {
    if (transaction[date]) {
      let resolvedDate
      if (transaction[date].format) {
        resolvedDate = transaction[date].format('YYYY-MM-DD')
      } else {
        throw new Error(
          'Invalid date value; no format() function available. All dates should be moment objects'
        )
      }
      convertedDates[date] = resolvedDate
    }
  })
  return { ...transaction, ...convertedDates }
}

export const childArrayToObject = (transaction: any, children: string[]) => {
  let convertedChildren: any = {}
  children.map(child => {
    if (transaction[child]) {
      convertedChildren[child] = transaction[
        child
      ].reduce((arr: any, curr: any) => {
        const { name, ...rest } = curr
        arr[name] = rest
        return arr
      }, {})
    } else {
      convertedChildren[child] = {}
    }
  })
  return { ...transaction, ...convertedChildren }
}

export const childLinksToObject = (transaction: any) => {
  if (!transaction.links) return { ...transaction, links: {} }
  const resolvedLinks = transaction.links || []
  const links = resolvedLinks.reduce((arr: any, curr: any) => {
    const { name, ...rest } = curr
    arr[name] = rest.links
    return arr
  }, {})
  return { ...transaction, links }
}

export function* fxFormActionSaga(
  action: actions.ITransactionFormActionAction
) {
  // @Note: If cancel, skip all the asset creation code
  if (action.payload.actionType === 'cancel') {
    yield* transactionFormActionSaga(action)
    return
  }

  try {
    const AMId = yield* getAMId(true)

    let resolvedAssetId: string
    let asset: any
    const { transaction } = action.payload
    const underlyingId = transaction.assetPrimaryReference
    const { settlementDate, fixingDate } = transaction

    const { dateFormat } = yield select(profileSelector)

    //@Note: Formatting Moment Object to String
    const formattedSettlementDate = settlementDate.format('YYYY-MM-DD')
    const convertedSettlementDate = formattedSettlementDate.replace(/-/g, '')

    let formattedFixingDate: string
    if (fixingDate) {
      formattedFixingDate = fixingDate.format('YYYY-MM-DD')
    }

    switch (transaction.spotOrForward) {
      case 'ForeignExchangeSpot':
        asset = new assets.ForeignExchangeSpot({
          assetManagerId: AMId,
          assetId: `SPT${underlyingId}${convertedSettlementDate}`,
          underlying: underlyingId,
          maturityDate: formattedSettlementDate,
          countryCodes: [],
          fungible: true,
          references: {
            'CCY Pair': {
              referenceValue: underlyingId,
              referencePrimary: true
            }
          }
        }) // not all these should be required by TS
        break
      case 'ForeignExchangeForward':
        asset = new assets.ForeignExchangeForward({
          assetManagerId: AMId,
          assetId: `FWD${underlyingId}${convertedSettlementDate}`,
          underlying: underlyingId,
          maturityDate: formattedSettlementDate,
          countryCodes: [],
          fungible: true,
          forwardRate: transaction.price,
          fixingDate,
          references: {
            'CCY Pair': { referenceValue: underlyingId, referencePrimary: true }
          }
        })
        break
      default:
        yield put(
          actions.transactionFormActionFailed(
            `Unsupported Asset Type: ${transaction.spotOrForward}`
          )
        )
        return
    }
    const upserted = yield call(api.Assets.upsert, { AMId, asset })
    resolvedAssetId = upserted.assetId

    let transactionRates = transaction.rates || []
    transactionRates = [
      ...transactionRates,
      { name: 'Forward Rate', rateValue: transaction.price }
    ]

    // Change the asset ID to the SPT/FWD version
    // Add the forward rate into rates
    const resolvedTransaction = {
      ...transaction,
      assetId: resolvedAssetId,
      rates: transactionRates
    }
    const resolvedAction = {
      ...action,
      payload: { ...action.payload, transaction: resolvedTransaction }
    }
    yield* transactionFormActionSaga(resolvedAction)
  } catch (err) {
    console.error(err)
    const error = parseError(err) || 'Error inserting FX Transaction'
    yield put(actions.transactionFormActionFailed(error))
  }
}

export function* getDeliverableStatusSaga(
  action: actions.ITransactionDeliverableAction
) {
  if (!action.payload.assetPrimaryReference) return
  try {
    const counterCurrency = action.payload.assetPrimaryReference.slice(3)
    if (counterCurrency.length !== 3) {
      yield put(
        actions.fxDeliverableStatusFailed(
          `Incorrect currency format: ${counterCurrency}`
        )
      )
      return
    }
    const AMId = yield call(getAMId, false)
    const currencyData = yield call(api.Assets.fuzzySearch, {
      AMId: parseInt(AMId),
      query: {
        query: counterCurrency,
        assetType: 'Currency',
        fuzzy: false,
        fields: 'assetId'
      }
    })
    interface HitObject {
      assetId: string
      deliverable?: boolean
    }
    const { hits }: { hits: HitObject | HitObject[] } = currencyData
    let deliverable: boolean | undefined
    if (Array.isArray(hits)) {
      const currency = hits.find(hit => hit.assetId === counterCurrency) || {
        deliverable: undefined
      }
      deliverable = currency.deliverable
    } else {
      deliverable = hits.deliverable
    }
    yield put(actions.fxDeliverableStatusSuccess(deliverable))
  } catch (e) {
    const error = parseError(e) || 'Error fetching deliverable status'
    yield put(actions.fxDeliverableStatusFailed(error))
  }
}

export default [
  takeLatest(types.REQUEST_DELIVERABLE_STATUS, getDeliverableStatusSaga),
  takeLatest(types.FETCH_TRANSACTION_FOR_FORM, fetchTransactionForForm),
  takeLatest(types.FETCH_ASSET_FOR_FORM, fetchAssetForForm),
  takeLatest(types.TRANSACTION_FORM_ACTION, transactionFormActionSaga),
  takeLatest(types.FX_FORM_ACTION, fxFormActionSaga)
]

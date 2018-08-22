import uniq from 'lodash/uniq'
import { delay } from 'redux-saga'
import { call, put, race, select, take, takeLatest } from 'redux-saga/effects'
import { Action } from 'redux'
import moment from 'moment'
import { api, books, transactions } from '@amaas/amaas-core-sdk-js'

import * as actions from 'actions/data'
import { fetchTransactions as fetchTrans } from '../api'
import * as types from 'actions/data/types'
import { profileSelector } from 'selectors'
import { connectToWS, disconnectWS } from 'actions/pubsub'
import { REQUEST_CONNECTION } from 'actions/pubsub/types'
import { AUTHENTICATION_SUCCESS } from 'actions/session/types'
import { parseError } from 'utils/error'
import { getPrimaryChild, parseAMaaSDate } from 'utils/form'

interface IAction extends Action {
  payload: any
}

export function* establishWSConnection() {
  try {
    const AMId = yield* getAMId()
    const credentials = yield call(api.AssetManagers.getCredentialsForPubSub, {
      AMId
    })
    if (!credentials.topics)
      return console.log(
        `No available subscriptions for AMID ${AMId}: will not establish websocket connection`
      )
    const { Credentials, topics } = credentials
    const {
      AccessKeyId: accessKeyId,
      SecretAccessKey: secretKey,
      SessionToken: sessionToken
    } = Credentials
    const config = Object.assign(
      {},
      { accessKeyId, secretKey, sessionToken, topics }
    )
    yield put(connectToWS(config))
  } catch (e) {
    console.error('Error establishing WS connection')
    yield put(disconnectWS())
  }
}

// This defaults to selecting the users own AMID unless assumed = true, then it will select the assumedAMID
export function* getAMId(assumed: boolean = false) {
  let profile = yield select(profileSelector)
  if (assumed && profile.assumedAMID) return parseInt(profile.assumedAMID)
  if (!assumed && profile.assetManagerId)
    return parseInt(profile.assetManagerId)
  const { authed, timeout } = yield race({
    authed: take(AUTHENTICATION_SUCCESS),
    timeout: call(delay, 10000)
  })
  if (authed) {
    profile = yield select(profileSelector)
    if (assumed && profile.assumedAMID) return parseInt(profile.assumedAMID)
    if (!assumed && profile.assetManagerId)
      return parseInt(profile.assetManagerId)
    throw new Error('Could not retrieve Asset Manager ID')
  } else {
    throw new Error('Could not retrieve Asset Manager ID')
  }
}

export function* fetchAssetsSaga(action: IAction) {
  const { query } = action.payload
  try {
    let AMId = yield* getAMId(true)
    const assets = yield call(api.Assets.search, { AMId, query })
    const assetsWithFormattedDate = convertToMomentJs(assets, [
      'issueDate',
      'expiryDate',
      'maturityDate'
    ])
    yield put(actions.fetchAssetsSuccess(assetsWithFormattedDate))
  } catch (error) {
    yield put(actions.fetchAssetsFailed(error.message || error.toString()))
  }
}

export function* fetchBooksSaga() {
  try {
    const AMId = yield* getAMId(true)
    const books = yield call(api.Books.retrieve, { AMId })

    const ownerList = uniq<string>(
      books.map((book: books.Book) => book.ownerId)
    )
    const partyList = uniq<string>(
      books.map((book: books.Book) => book.partyId)
    )

    const ownerNameList = yield* getPartyInfoForList(parseInt(AMId), ownerList)
    const partyNameList = yield* getPartyInfoForList(parseInt(AMId), partyList)

    const namedBooks = books.map((book: books.Book) => {
      const ownerName = ownerNameList.filter(
        (owner: { partyId: string; name: string }) =>
          owner.partyId === `${book.ownerId}`
      )[0] || { name: '' }
      const partyName = partyNameList.filter(
        (party: { partyId: string; name: string }) =>
          party.partyId === book.partyId
      )[0] || { name: '' }
      return { ...book, ownerName: ownerName.name, partyName: partyName.name }
    })

    yield put(actions.fetchBooksSuccess(namedBooks))
  } catch (error) {
    yield put(actions.fetchBooksFailed(error.message || error.toString()))
  }
}

export function* fetchBookPermissionsSaga(action: IAction) {
  try {
    const { bookId } = action.payload
    const AMId = yield* getAMId(true)
    const bookPermissions = yield call(api.Books.getPermissions, {
      AMId,
      bookId
    })
    const partyIdList = uniq<string>(
      bookPermissions.map(
        (permission: { userAssetManagerId: number }) =>
          `AMID${permission.userAssetManagerId}`
      )
    )

    const nameList = yield* getPartyInfoForList(parseInt(AMId), partyIdList)
    const mergedBookPermissions = bookPermissions.map(
      (permission: { userAssetManagerId: number }) => {
        const { name } = nameList.filter(
          (name: { partyId: string }) =>
            name.partyId === `AMID${permission.userAssetManagerId}`
        )[0] || { name: '' }
        return { ...permission, name }
      }
    )

    yield put(actions.fetchBookPermissionsSuccess(mergedBookPermissions))
  } catch (error) {
    yield put(
      actions.fetchBookPermissionsFailed(
        parseError(error) || error.message || error.toString()
      )
    )
  }
}

export function* fetchDomainsSaga() {
  try {
    const AMId = yield* getAMId(true)
    const domains = yield call(api.AssetManagers.searchDomains, {
      AMId
    })
    yield put(actions.fetchDomainsSuccess(domains))
  } catch (error) {
    yield put(actions.fetchDomainsFailed(error.message || error.toString()))
  }
}

export function* fetchMonitorSaga() {
  try {
    const AMId = yield* getAMId(true)
    const items = yield call(api.Monitor.retrieveItems, { AMId })
    yield put(actions.fetchMonitorSuccess(items))
  } catch (error) {
    yield put(actions.fetchMonitorFailed(error.message || error.toString()))
  }
}

export function* fetchActivitiesSaga() {
  try {
    const AMId = yield* getAMId(true)
    const items = yield call(api.Monitor.retrieveActivities, { AMId })
    yield put(actions.fetchActivitiesSuccess(items))
  } catch (error) {
    yield put(actions.fetchActivitiesFailed(error.message || error.toString()))
  }
}

export function* fetchPartiesSaga(action: IAction) {
  const { query } = action.payload
  try {
    const AMId = yield* getAMId(true)
    const parties = yield call(api.Parties.search, { AMId, query })
    const partiesWithFormattedDate = convertToMomentJs(parties, ['dateOfBirth'])
    yield put(actions.fetchPartiesSuccess(partiesWithFormattedDate))
  } catch (error) {
    yield put(actions.fetchPartiesFailed(error.message || error.toString()))
  }
}

export function* fetchPositionsSaga(action: IAction) {
  const { query } = action.payload
  try {
    const AMId = yield* getAMId(true)

    const positions: ({
      assetId: string
    } & transactions.Position)[] = yield call(api.Positions.search, {
      AMId,
      query
    })
    const positionsWithAssetInfo = yield* getAssetInfoForList(
      parseInt(AMId),
      positions
    )
    yield put(actions.fetchPositionsSuccess(positionsWithAssetInfo))
  } catch (error) {
    yield put(actions.fetchPositionsFailed(error.message || error.toString()))
  }
}

export function* fetchRelationshipsSaga() {
  try {
    const AMId = yield* getAMId(true)
    const rels = yield call(api.Relationships.retrieve, { AMId })
    const partyIds = uniq<string>(
      rels.map((rel: { relatedId: number }) => `AMID${rel.relatedId}`)
    )
    const relNames = yield* getPartyInfoForList(AMId, partyIds)
    const mergedRelationsips = rels.map((rel: { relatedId: string }) => {
      const relName = relNames.filter(
        (relName: { partyId: string }) =>
          relName.partyId === `AMID${rel.relatedId}`
      )[0] || { name: '' }
      return { ...rel, relName: relName.name }
    })
    yield put(actions.fetchRelationshipsSuccess(mergedRelationsips))
  } catch (error) {
    yield put(
      actions.fetchRelationshipsFailed(error.message || error.toString())
    )
  }
}

export function* fetchTransactionsSaga(action: IAction) {
  let { query } = action.payload
  try {
    const AMId = yield* getAMId(true)

    const transactions = yield call(api.Transactions.search, { AMId, query })
    const parsedTransactions = yield* parseTransaction({
      AMId: parseInt(AMId),
      transactions,
      dateKeys: ['transactionDate', 'settlementDate']
    })
    yield put(actions.fetchTransactionsSuccess(parsedTransactions))
  } catch (error) {
    yield put(
      actions.fetchTransactionsFailed(error.message || error.toString())
    )
  }
}

export function* parseTransaction({
  AMId,
  transactions,
  dateKeys
}: {
  AMId: number
  transactions: any[]
  dateKeys: string[]
}) {
  const transactionsWithAssetInfo = yield* getAssetInfoForList(
    AMId,
    transactions
  )
  const res = convertToMomentJs(transactionsWithAssetInfo, dateKeys)
  return res
}

export function* fetchTransactionVersionSaga(action: IAction) {
  const { transactionId, version } = action.payload
  if (!transactionId || !version)
    return put(
      actions.fetchTransactionsFailed('Missing transactionId or version number')
    )
  const query = { version }
  try {
    const AMId = yield* getAMId(true)

    const transaction = yield call(api.Transactions.retrieve, {
      AMId,
      resourceId: transactionId,
      query
    })
    const transactionsWithAssetInfo = yield* getAssetInfoForList(
      parseInt(AMId),
      [transaction]
    )
    const transactionsWithFormattedDate = convertToMomentJs(
      transactionsWithAssetInfo,
      ['transactionDate', 'settlementDate']
    )
    yield put(actions.fetchTransactionsSuccess(transactionsWithFormattedDate))
  } catch (error) {
    yield put(
      actions.fetchTransactionsFailed(error.message || error.toString())
    )
  }
}

export function* getAssetInfoForList(
  AMId: number,
  coll: { assetId: string; [propName: string]: any }[]
) {
  if (!coll.length) return []
  const assetIds = uniq<string>(
    coll.map(member => member.assetId as string).filter(member => member)
  )
  const assetQuery = {
    assetIds,
    fields: ['assetId', 'displayName', 'references', 'assetClass', 'assetType']
  }
  try {
    const assetInfo = yield call(api.Assets.fieldsSearch, {
      AMId,
      query: assetQuery
    })
    return coll.map(member => {
      const assetForPosition = assetInfo.filter(
        (asset: { assetId: string; displayName: string; references: any }) =>
          asset.assetId === member.assetId
      )[0]
      const {
        displayName,
        references,
        assetClass,
        assetType,
        ...rest
      } = assetForPosition
      const { references: memberRef, ...otherFields } = member

      const { referenceValue: assetPrimaryReference } = getPrimaryChild(
        references,
        'referencePrimary'
      ) || { referenceValue: '' }
      const { referenceValue: ISINRef } = references.ISIN || {
        referenceValue: null
      }
      const flattenedReferences = {
        assetPrimaryReference,
        ISIN: ISINRef
      }
      return {
        ...otherFields,
        references: memberRef,
        displayName,
        assetClass,
        assetType,
        ...flattenedReferences
      }
    })
  } catch (e) {
    console.log(e)
    throw new Error('Error retrieving Asset info')
  }
}

export function* getPartyInfoForList(AMId: number, list: string[]) {
  if (!list.length) return []
  const query = {
    partyIds: list,
    fields: ['partyId', 'givenNames', 'surname', 'displayName', 'description']
  }
  try {
    const parties: {
      partyId: string
      givenNames?: string
      surname?: string
      displayName?: string
      description?: string
    }[] = yield call(api.Parties.fieldsSearch, { AMId, query })
    return parties.map(party => {
      const { partyId, givenNames, surname, displayName, description } = party
      const name = givenNames && surname && `${givenNames} ${surname}`
      return {
        partyId,
        name: name || displayName || description || 'No name found'
      }
    })
  } catch (e) {
    throw new Error('Error fetching Party Info')
  }
}

export function convertToMomentJs(list: any[], dates: string[]) {
  if (!list.length) return []
  return list.map((el: any) => {
    let datesObj: any = {}
    dates.map(date => {
      if (el[date]) datesObj[date] = moment.utc(el[date])
    })
    return { ...el, ...datesObj }
  })
}

export function* convertDateToUserConfig(list: any[], dates: string[]) {
  if (!list.length) return []
  const { dateFormat } = yield select(profileSelector)
  return list.map((el: any) => {
    let datesObj: any = {}
    dates.map(date => {
      if (el[date]) {
        datesObj[date] = parseAMaaSDate(dateFormat)(el[date])
      }
    })
    return { ...el, ...datesObj }
  })
}

/* This is a helper export to make combining all sagas in the rootSaga easier */
export default [
  takeLatest(REQUEST_CONNECTION, establishWSConnection),
  takeLatest(types.FETCH_ASSETS, fetchAssetsSaga),
  takeLatest(types.FETCH_BOOKS, fetchBooksSaga),
  takeLatest(types.FETCH_BOOK_PERMISSIONS, fetchBookPermissionsSaga),
  takeLatest(types.FETCH_DOMAINS, fetchDomainsSaga),
  takeLatest(types.FETCH_MONITOR, fetchMonitorSaga),
  takeLatest(types.FETCH_ACTIVITIES, fetchActivitiesSaga),
  takeLatest(types.FETCH_PARTIES, fetchPartiesSaga),
  takeLatest(types.FETCH_POSITIONS, fetchPositionsSaga),
  takeLatest(types.FETCH_RELATIONSHIPS, fetchRelationshipsSaga),
  takeLatest(types.FETCH_TRANSACTIONS, fetchTransactionsSaga),
  takeLatest(types.FETCH_TRANSACTIONS_SINGLE, fetchTransactionVersionSaga)
  /* include all the sagas here */
]

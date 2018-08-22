import {
  assetManagers,
  assets,
  books as AMBooks,
  monitor,
  parties,
  relationships,
  transactions
} from '@amaas/amaas-core-sdk-js'

import * as actionTypes from './types'
import actGenerator from './actionTypeGenerators'

const assetTypes = actGenerator('assets')
const bookTypes = actGenerator('books')
const bookPermissionTypes = actGenerator('bookPermissions')
const domainTypes = actGenerator('domains')
const monitorTypes = actGenerator('monitor')
const activityTypes = actGenerator('activities')
const partyTypes = actGenerator('parties')
const positionTypes = actGenerator('positions')
const relationshipTypes = actGenerator('relationships')
const transactionTypes = actGenerator('transactions')

// Assets
export const fetchAssets = (query?: object) => ({
  type: assetTypes.request,
  payload: { query }
})

export const fetchAssetsSuccess = (assets: assets.AssetClassTypes[]) => ({
  type: assetTypes.success,
  payload: { data: assets }
})

export const fetchAssetsFailed = (error: string) => ({
  type: assetTypes.failed,
  payload: { error }
})

// Books
export const fetchBooks = () => ({
  type: bookTypes.request
})

export const fetchBooksSuccess = (books: AMBooks.Book[]) => ({
  type: bookTypes.success,
  payload: { data: books }
})

export const fetchBooksFailed = (error: string) => ({
  type: bookTypes.failed,
  payload: { error }
})

// Book permissions
export const fetchBookPermissions = (bookId: string) => ({
  type: bookPermissionTypes.request,
  payload: { bookId }
})

export const fetchBookPermissionsSuccess = (
  bookPermissions: AMBooks.BookPermission[]
) => ({
  type: bookPermissionTypes.success,
  payload: { data: bookPermissions }
})

export const fetchBookPermissionsFailed = (error: string) => ({
  type: bookPermissionTypes.failed,
  payload: { error }
})

// Domains
export const fetchDomains = () => ({
  type: domainTypes.request
})

export const fetchDomainsSuccess = (domains: assetManagers.Domain[]) => ({
  type: domainTypes.success,
  payload: { data: domains }
})

export const fetchDomainsFailed = (error: string) => ({
  type: domainTypes.failed,
  payload: { error }
})

// Monitor
export const fetchMonitor = () => ({
  type: monitorTypes.request
})

export const fetchMonitorSuccess = (mon: monitor.Item[]) => ({
  type: monitorTypes.success,
  payload: { data: mon }
})

export const fetchMonitorFailed = (error: string) => ({
  type: monitorTypes.failed,
  payload: { error }
})

// Activity
export const fetchActivities = (query?: object) => ({
  type: activityTypes.request,
  payload: { query }
})

export const fetchActivitiesSuccess = (activities: monitor.Activity[]) => ({
  type: activityTypes.success,
  payload: { data: activities }
})

export const fetchActivitiesFailed = (error: string) => ({
  type: activityTypes.failed,
  payload: { error }
})

// Parties
export const fetchParties = (query?: object) => ({
  type: partyTypes.request,
  payload: { query }
})

export const fetchPartiesSuccess = (party: parties.PartiesClassType[]) => ({
  type: partyTypes.success,
  payload: { data: party }
})

export const fetchPartiesFailed = (error: string) => ({
  type: partyTypes.failed,
  payload: { error }
})

// Positions
export const fetchPositions = (query?: {
  [queryKey: string]: string | string[]
}) => ({
  type: positionTypes.request,
  payload: { query }
})

export const fetchPositionsSuccess = (pos: transactions.Position[]) => ({
  type: positionTypes.success,
  payload: { data: pos }
})

export const fetchPositionsFailed = (error: string) => ({
  type: positionTypes.failed,
  payload: { error }
})

// Relationships
export const fetchRelationships = () => ({
  type: relationshipTypes.request
})

export const fetchRelationshipsSuccess = (
  rels: relationships.Relationship[]
) => ({
  type: relationshipTypes.success,
  payload: { data: rels }
})

export const fetchRelationshipsFailed = (error: string) => ({
  type: relationshipTypes.failed,
  payload: { error }
})

// Transactions
interface IQueryParams {
  [queryKey: string]: any[]
}
export const fetchTransactions = (query?: IQueryParams[]) => ({
    type: transactionTypes.request,
    payload: { query }
})

export const fetchTransactionSingle = (
  transactionId: string,
  version: number
) => ({
  type: transactionTypes.request,
  payload: { transactionId, version }
})

export const fetchTransactionsSuccess = (
  trans: transactions.Transaction[]
) => ({
  type: transactionTypes.success,
  payload: { data: trans }
})

export const fetchTransactionsFailed = (error: string) => ({
  type: transactionTypes.failed,
  payload: { error }
})

export const clearData = () => ({
  type: actionTypes.CLEAR_DATA,
  payload: {}
})

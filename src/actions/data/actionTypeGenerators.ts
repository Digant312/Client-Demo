import * as types from './types'

export type IDataTypes =
  | 'assets'
  | 'books'
  | 'bookPermissions'
  | 'domains'
  | 'monitor'
  | 'activities'
  | 'parties'
  | 'positions'
  | 'relationships'
  | 'transactions'

export default (dataType: IDataTypes) => {
  switch (dataType) {
    case 'assets':
      return {
        request: types.FETCH_ASSETS,
        success: types.FETCH_ASSETS_SUCCESS,
        failed: types.FETCH_ASSETS_FAILED,
        clearData: types.CLEAR_DATA
      }
    case 'books':
      return {
        request: types.FETCH_BOOKS,
        success: types.FETCH_BOOKS_SUCCESS,
        failed: types.FETCH_BOOKS_FAILED,
        clearData: types.CLEAR_DATA
      }
    case 'bookPermissions':
      return {
        request: types.FETCH_BOOK_PERMISSIONS,
        success: types.FETCH_BOOK_PERMISSIONS_SUCCESS,
        failed: types.FETCH_BOOK_PERMISSIONS_FAILED,
        clearData: types.CLEAR_DATA
      }
    case 'domains':
      return {
        request: types.FETCH_DOMAINS,
        success: types.FETCH_DOMAINS_SUCCESS,
        failed: types.FETCH_DOMAINS_FAILED,
        clearData: types.CLEAR_DATA
      }
    case 'monitor':
      return {
        request: types.FETCH_MONITOR,
        success: types.FETCH_MONITOR_SUCCESS,
        failed: types.FETCH_MONITOR_FAILED,
        clearData: types.CLEAR_DATA
      }
    case 'activities':
      return {
        request: types.FETCH_ACTIVITIES,
        success: types.FETCH_ACTIVITIES_SUCCESS,
        failed: types.FETCH_ACTIVITIES_FAILED,
        clearData: types.CLEAR_DATA
      }
    case 'parties':
      return {
        request: types.FETCH_PARTIES,
        success: types.FETCH_PARTIES_SUCCESS,
        failed: types.FETCH_PARTIES_FAILED,
        clearData: types.CLEAR_DATA
      }
    case 'positions':
      return {
        request: types.FETCH_POSITIONS,
        success: types.FETCH_POSITIONS_SUCCESS,
        failed: types.FETCH_POSITIONS_FAILED,
        clearData: types.CLEAR_DATA
      }
    case 'relationships':
      return {
        request: types.FETCH_RELATIONSHIPS,
        success: types.FETCH_RELATIONSHIPS_SUCCESS,
        failed: types.FETCH_RELATIONSHIPS_FAILED,
        clearData: types.CLEAR_DATA
      }
    case 'transactions':
      return {
        request: types.FETCH_TRANSACTIONS,
        success: types.FETCH_TRANSACTIONS_SUCCESS,
        failed: types.FETCH_TRANSACTIONS_FAILED,
        clearData: types.CLEAR_DATA
      }
    default:
      return {
        request: undefined,
        success: undefined,
        failed: undefined,
        clearData: undefined
      }
  }
}

import actGenerator from './actionTypeGenerators'
import * as types from './types'

describe('Action Type Generator', () => {
  it('should return asset action types', () => {
    const expectedResult = {
      request: types.FETCH_ASSETS,
      success: types.FETCH_ASSETS_SUCCESS,
      failed: types.FETCH_ASSETS_FAILED,
      clearData: types.CLEAR_DATA
    }
    expect(actGenerator('assets')).toEqual(expectedResult)
  })

  it('should return book action types', () => {
    const expectedResult = {
      request: types.FETCH_BOOKS,
      success: types.FETCH_BOOKS_SUCCESS,
      failed: types.FETCH_BOOKS_FAILED,
      clearData: types.CLEAR_DATA
    }
    expect(actGenerator('books')).toEqual(expectedResult)
  })

  it('should return book permission action types', () => {
    const expectedResult = {
      request: types.FETCH_BOOK_PERMISSIONS,
      success: types.FETCH_BOOK_PERMISSIONS_SUCCESS,
      failed: types.FETCH_BOOK_PERMISSIONS_FAILED,
      clearData: types.CLEAR_DATA
    }
    expect(actGenerator('bookPermissions')).toEqual(expectedResult)
  })

  it('should return domain action types', () => {
    const expectedResult = {
      request: types.FETCH_DOMAINS,
      success: types.FETCH_DOMAINS_SUCCESS,
      failed: types.FETCH_DOMAINS_FAILED,
      clearData: types.CLEAR_DATA
    }
    expect(actGenerator('domains')).toEqual(expectedResult)
  })

  it('should return monitor action types', () => {
    const expectedResult = {
      request: types.FETCH_MONITOR,
      success: types.FETCH_MONITOR_SUCCESS,
      failed: types.FETCH_MONITOR_FAILED,
      clearData: types.CLEAR_DATA
    }
    expect(actGenerator('monitor')).toEqual(expectedResult)
  })

  it('should return parties action types', () => {
    const expectedResult = {
      request: types.FETCH_PARTIES,
      success: types.FETCH_PARTIES_SUCCESS,
      failed: types.FETCH_PARTIES_FAILED,
      clearData: types.CLEAR_DATA
    }
    expect(actGenerator('parties')).toEqual(expectedResult)
  })

  it('should return positions action types', () => {
    const expectedResult = {
      request: types.FETCH_POSITIONS,
      success: types.FETCH_POSITIONS_SUCCESS,
      failed: types.FETCH_POSITIONS_FAILED,
      clearData: types.CLEAR_DATA
    }
    expect(actGenerator('positions')).toEqual(expectedResult)
  })

  it('should return relationships action types', () => {
    const expectedResult = {
      request: types.FETCH_RELATIONSHIPS,
      success: types.FETCH_RELATIONSHIPS_SUCCESS,
      failed: types.FETCH_RELATIONSHIPS_FAILED,
      clearData: types.CLEAR_DATA
    }
    expect(actGenerator('relationships')).toEqual(expectedResult)
  })

  it('should return transaction action types', () => {
    const expectedResult = {
      request: types.FETCH_TRANSACTIONS,
      success: types.FETCH_TRANSACTIONS_SUCCESS,
      failed: types.FETCH_TRANSACTIONS_FAILED,
      clearData: types.CLEAR_DATA
    }
    expect(actGenerator('transactions')).toEqual(expectedResult)
  })

  it('should return undefined for unknown action type', () => {
    const expectedResult = {
      request: undefined,
      success: undefined,
      failed: undefined,
      clearData: undefined
    }
    expect(actGenerator(undefined)).toEqual(expectedResult)
  })
})
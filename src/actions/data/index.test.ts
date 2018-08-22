import actGenerator from './actionTypeGenerators'
import * as types from './types'
import * as actions from './'

jest.mock('./actionTypeGenerators', () => jest.fn(mockedGenerator))

describe('assets action creators', () => {
  it('should create an action to fetch Assets', () => {
    const expectedResult = {
      type: 'testRequest',
      payload: { query: { fields: 'description' } }
    }
    expect(actions.fetchAssets({ fields: 'description' })).toEqual(
      expectedResult
    )
  })

  it('should create an action for successful fetch', () => {
    const expectedResult = {
      type: 'testSuccess',
      payload: { data: ['asset1', 'asset2'] }
    }
    expect(actions.fetchAssetsSuccess(['asset1', 'asset2'] as any)).toEqual(
      expectedResult
    )
  })

  it('should create an action for failed fetch', () => {
    const expectedResult = {
      type: 'testFailed',
      payload: { error: 'testError' }
    }
    expect(actions.fetchAssetsFailed('testError')).toEqual(expectedResult)
  })
})

describe('books action creators', () => {
  it('should create an action to fetch Books', () => {
    const expectedResult = {
      type: 'testRequest'
    }
    expect(actions.fetchBooks()).toEqual(expectedResult)
  })

  it('should create an action for successful fetch', () => {
    const expectedResult = {
      type: 'testSuccess',
      payload: { data: ['book1', 'book2'] }
    }
    expect(actions.fetchBooksSuccess(['book1', 'book2'] as any)).toEqual(
      expectedResult
    )
  })

  it('should create an action for failed fetch', () => {
    const expectedResult = {
      type: 'testFailed',
      payload: { error: 'testError' }
    }
    expect(actions.fetchBooksFailed('testError')).toEqual(expectedResult)
  })
})

describe('book permissions action creators', () => {
  it('should create an action to fetch Book Permissions', () => {
    const expectedResult = {
      type: 'testRequest',
      payload: { bookId: 'TESTID' }
    }
    expect(actions.fetchBookPermissions('TESTID')).toEqual(expectedResult)
  })

  it('should create an action for successful fetch', () => {
    const expectedResult = {
      type: 'testSuccess',
      payload: { data: ['book1', 'book2'] }
    }
    expect(
      actions.fetchBookPermissionsSuccess(['book1', 'book2'] as any)
    ).toEqual(expectedResult)
  })

  it('should create an action for failed fetch', () => {
    const expectedResult = {
      type: 'testFailed',
      payload: { error: 'testError' }
    }
    expect(actions.fetchBookPermissionsFailed('testError')).toEqual(
      expectedResult
    )
  })
})

describe('domains action creators', () => {
  it('should create an action to fetch Books', () => {
    const expectedResult = {
      type: 'testRequest'
    }
    expect(actions.fetchDomains()).toEqual(expectedResult)
  })

  it('should create an action for successful fetch', () => {
    const expectedResult = {
      type: 'testSuccess',
      payload: { data: ['domain1', 'domain2'] }
    }
    expect(actions.fetchDomainsSuccess(['domain1', 'domain2'] as any)).toEqual(
      expectedResult
    )
  })

  it('should create an action for failed fetch', () => {
    const expectedResult = {
      type: 'testFailed',
      payload: { error: 'testError' }
    }
    expect(actions.fetchDomainsFailed('testError')).toEqual(expectedResult)
  })
})

describe('monitor action creators', () => {
  it('should create an action to fetch Monitor Items', () => {
    const expectedResult = {
      type: 'testRequest'
    }
    expect(actions.fetchMonitor()).toEqual(expectedResult)
  })

  it('should create an action for successful fetch', () => {
    const expectedResult = {
      type: 'testSuccess',
      payload: { data: ['item1', 'item2'] }
    }
    expect(actions.fetchMonitorSuccess(['item1', 'item2'] as any)).toEqual(
      expectedResult
    )
  })

  it('should create an action for failed fetch', () => {
    const expectedResult = {
      type: 'testFailed',
      payload: { error: 'testError' }
    }
    expect(actions.fetchMonitorFailed('testError')).toEqual(expectedResult)
  })
})

describe('parties action creators', () => {
  it('should create an action to fetch Parties', () => {
    const expectedResult = {
      type: 'testRequest',
      payload: {}
    }
    expect(actions.fetchParties()).toEqual(expectedResult)
  })

  it('should create an action for successful fetch', () => {
    const expectedResult = {
      type: 'testSuccess',
      payload: { data: ['party1', 'party2'] }
    }
    expect(actions.fetchPartiesSuccess(['party1', 'party2'] as any)).toEqual(
      expectedResult
    )
  })

  it('should create an action for failed fetch', () => {
    const expectedResult = {
      type: 'testFailed',
      payload: { error: 'testError' }
    }
    expect(actions.fetchPartiesFailed('testError')).toEqual(expectedResult)
  })
})

describe('positions action creators', () => {
  it('should create an action to fetch Positions', () => {
    const expectedResult = {
      type: 'testRequest',
      payload: { query: undefined }
    }
    expect(actions.fetchPositions()).toEqual(expectedResult)
  })

  it('should create an action for successful fetch', () => {
    const expectedResult = {
      type: 'testSuccess',
      payload: { data: ['pos1', 'pos2'] }
    }
    expect(actions.fetchPositionsSuccess(['pos1', 'pos2'] as any)).toEqual(
      expectedResult
    )
  })

  it('should create an action for failed fetch', () => {
    const expectedResult = {
      type: 'testFailed',
      payload: { error: 'testError' }
    }
    expect(actions.fetchPositionsFailed('testError')).toEqual(expectedResult)
  })
})

describe('relationships action creators', () => {
  it('should create an action to fetch Relationships', () => {
    const expectedResult = {
      type: 'testRequest'
    }
    expect(actions.fetchRelationships()).toEqual(expectedResult)
  })

  it('should create an action for successful fetch', () => {
    const expectedResult = {
      type: 'testSuccess',
      payload: { data: ['rel1', 'rel2'] }
    }
    expect(actions.fetchRelationshipsSuccess(['rel1', 'rel2'] as any)).toEqual(
      expectedResult
    )
  })

  it('should create an action for failed fetch', () => {
    const expectedResult = {
      type: 'testFailed',
      payload: { error: 'testError' }
    }
    expect(actions.fetchRelationshipsFailed('testError')).toEqual(
      expectedResult
    )
  })
})

describe('transactions action creators', () => {
  it('should create an action to fetch Transactions', () => {
    const expectedResult = {
      type: 'testRequest',
      payload: {
        query: [
          {
            assetClasses: ['Equity']
          }
        ]
      }
    }
    expect(actions.fetchTransactions([{ assetClasses: ['Equity'] }])).toEqual(
      expectedResult
    )
  })

  it('should create an action for successful fetch', () => {
    const expectedResult = {
      type: 'testSuccess',
      payload: { data: ['trans1', 'trans2'] }
    }
    expect(
      actions.fetchTransactionsSuccess(['trans1', 'trans2'] as any)
    ).toEqual(expectedResult)
  })

  it('should create an action for failed fetch', () => {
    const expectedResult = {
      type: 'testFailed',
      payload: { error: 'testError' }
    }
    expect(actions.fetchTransactionsFailed('testError')).toEqual(expectedResult)
  })

  it('should create an action to retrieve a single transaction', () => {
    const expectedResult = {
      type: 'testRequest',
      payload: { transactionId: 'testID', version: 8 }
    }
    expect(actions.fetchTransactionSingle('testID', 8)).toEqual(expectedResult)
  })
})

describe('clearData', () => {
  it('should create an action to clear data', () => {
    const expectedResult = {
      type: types.CLEAR_DATA,
      payload: {}
    }
    expect(actions.clearData()).toEqual(expectedResult)
  })
})

export function mockedGenerator(dataType) {
  return {
    request: 'testRequest',
    success: 'testSuccess',
    failed: 'testFailed'
  }
}

import {
  transactionDeliverableStatus,
  transactionFormAsset,
  transactionFormTransaction,
  transactionFormAction
} from './'
import * as types from 'actions/data/transactionForm/types'

describe('transaction reducer', () => {
  const initialState = {
    fetchingTransaction: false,
    transaction: undefined,
    fetchError: ''
  }
  it('returns initialState for unknown action', () => {
    expect(
      transactionFormTransaction(initialState, { type: undefined })
    ).toEqual(initialState)
  })

  it('returns for request fetch', () => {
    const expectedState = {
      ...initialState,
      fetchingTransaction: true
    }
    expect(
      transactionFormTransaction(initialState, {
        type: types.FETCH_TRANSACTION_FOR_FORM
      })
    ).toEqual(expectedState)
  })

  it('returns for successful fetch', () => {
    const expectedState = {
      ...initialState,
      transaction: 'testTrans'
    }
    expect(
      transactionFormTransaction(initialState, {
        type: types.FETCH_TRANSACTION_FOR_FORM_SUCCESS,
        payload: { data: 'testTrans' }
      })
    ).toEqual(expectedState)
  })

  it('returns for failed fetch', () => {
    const expectedState = {
      ...initialState,
      fetchError: 'Error'
    }
    expect(
      transactionFormTransaction(initialState, {
        type: types.FETCH_TRANSACTION_FOR_FORM_FAILED,
        payload: { error: 'Error' }
      })
    ).toEqual(expectedState)
  })

  it('returns for clear transaction', () => {
    const expectedState = initialState
    const dirtyState = {
      ...initialState,
      transaction: { assetManagerId: 88 } as any
    }
    expect(
      transactionFormTransaction(dirtyState, {
        type: types.CLEAR_TRANSACTION_FOR_FORM,
        payload: {}
      })
    ).toEqual(expectedState)
  })
})

describe('asset reducer', () => {
  const initialState = {
    fetchingAsset: false,
    asset: undefined,
    fetchError: ''
  }
  it('returns initialState for unknown action', () => {
    expect(transactionFormAsset(initialState, { type: undefined })).toEqual(
      initialState
    )
  })

  it('returns for request fetch', () => {
    const expectedState = {
      ...initialState,
      fetchingAsset: true
    }
    expect(
      transactionFormAsset(initialState, {
        type: types.FETCH_ASSET_FOR_FORM
      })
    ).toEqual(expectedState)
  })

  it('returns for successful fetch', () => {
    const expectedState = {
      ...initialState,
      asset: 'testAsset'
    }
    expect(
      transactionFormAsset(initialState, {
        type: types.FETCH_ASSET_FOR_FORM_SUCCESS,
        payload: { data: 'testAsset' }
      })
    ).toEqual(expectedState)
  })

  it('returns for failed fetch', () => {
    const expectedState = {
      ...initialState,
      fetchError: 'Error'
    }
    expect(
      transactionFormAsset(initialState, {
        type: types.FETCH_ASSET_FOR_FORM_FAILED,
        payload: { error: 'Error' }
      })
    ).toEqual(expectedState)
  })

  it('returns for clear asset', () => {
    const expectedState = initialState
    const dirtyState = { ...initialState, asset: { assetManagerId: 88 } as any }
    expect(
      transactionFormAsset(dirtyState, {
        type: types.CLEAR_ASSET_FOR_FORM,
        payload: {}
      })
    ).toEqual(expectedState)
  })
})

describe('transaction action reducer', () => {
  const initialState = {
    working: false,
    error: ''
  }
  it('returns initialState for unknown action', () => {
    expect(transactionFormAction(initialState, { type: undefined })).toEqual(
      initialState
    )
  })

  it('returns for request action', () => {
    const expectedState = {
      ...initialState,
      working: true
    }
    expect(
      transactionFormAction(initialState, {
        type: types.TRANSACTION_FORM_ACTION
      })
    ).toEqual(expectedState)
  })

  it('returns for successful action', () => {
    const expectedState = initialState
    expect(
      transactionFormAction(initialState, {
        type: types.TRANSACTION_FORM_ACTION_SUCCESS,
        payload: {}
      })
    ).toEqual(expectedState)
  })

  it('returns for failed action', () => {
    const expectedState = {
      ...initialState,
      error: 'Error'
    }
    expect(
      transactionFormAction(initialState, {
        type: types.TRANSACTION_FORM_ACTION_FAILED,
        payload: { error: 'Error' }
      })
    ).toEqual(expectedState)
  })

  it('clears state', () => {
    const expectedState = initialState
    const dirtyState = { ...initialState, error: 'Error' }
    expect(
      transactionFormAction(dirtyState, {
        type: types.TRANSACTION_FORM_ACTION_CLEAR,
        payload: {}
      })
    ).toEqual(expectedState)
  })
})

describe('deliverable status reducer', () => {
  const initialState = {
    fetching: false,
    deliverable: undefined,
    error: undefined
  }
  it('returns initial state for unknown action', () => {
    const expectedState = initialState
    expect(
      transactionDeliverableStatus(initialState, { type: undefined })
    ).toEqual(expectedState)
  })
  it('sets state on request', () => {
    const expectedState = {
      fetching: true,
      deliverable: undefined,
      error: undefined
    }
    expect(
      transactionDeliverableStatus(initialState, {
        type: types.REQUEST_DELIVERABLE_STATUS,
        payload: { assetPrimaryReference: 'USD' }
      })
    ).toEqual(expectedState)
  })
  it('sets state on success', () => {
    const expectedState = {
      fetching: false,
      deliverable: true,
      error: undefined
    }
    expect(
      transactionDeliverableStatus(initialState, {
        type: types.DELIVERABLE_STATUS_SUCCESS,
        payload: { deliverable: true }
      })
    ).toEqual(expectedState)
  })
  it('sets state on failure', () => {
    const expectedState = {
      fetching: false,
      deliverable: undefined,
      error: 'test error'
    }
    expect(
      transactionDeliverableStatus(initialState, {
        type: types.DELIVERABLE_STATUS_FAILED,
        payload: { error: 'test error' }
      })
    ).toEqual(expectedState)
  })
  it('clears state', () => {
    const expectedState = initialState
    const dirtyState = { ...initialState, deliverable: true }
    expect(
      transactionDeliverableStatus(dirtyState, {
        type: types.CLEAR_ASSET_FOR_FORM
      })
    ).toEqual(expectedState)
  })
})

import * as types from './types'
import * as actions from './'

describe('transaction action creators', () => {
  it('creates an action to fetch transaction', () => {
    const expectedResult = {
      type: types.FETCH_TRANSACTION_FOR_FORM,
      payload: { transactionId: 'testTransID' }
    }
    expect(actions.fetchTransactionForForm('testTransID')).toEqual(
      expectedResult
    )
  })

  it('creates an action for successful fetch', () => {
    const expectedResult = {
      type: types.FETCH_TRANSACTION_FOR_FORM_SUCCESS,
      payload: { data: 'transaction' }
    }
    expect(
      actions.fetchTransactionForFormSuccess('transaction' as any)
    ).toEqual(expectedResult)
  })

  it('creates an action for failed fetch', () => {
    const expectedResult = {
      type: types.FETCH_TRANSACTION_FOR_FORM_FAILED,
      payload: { error: 'Error' }
    }
    expect(actions.fetchTransactionForFormFailed('Error')).toEqual(
      expectedResult
    )
  })

  it('creates an action to clear data', () => {
    const expectedResult = {
      type: types.CLEAR_TRANSACTION_FOR_FORM,
      payload: {}
    }
    expect(actions.clearTransactionForForm()).toEqual(expectedResult)
  })
})

describe('asset action creators', () => {
  it('creates an action to fetch asset', () => {
    const expectedResult = {
      type: types.FETCH_ASSET_FOR_FORM,
      payload: { assetId: 'testAssetId' }
    }
    expect(actions.fetchAssetForForm('testAssetId')).toEqual(expectedResult)
  })

  it('creates an action for successful fetch asset', () => {
    const expectedResult = {
      type: types.FETCH_ASSET_FOR_FORM_SUCCESS,
      payload: { data: 'asset' }
    }
    expect(actions.fetchAssetForFormSuccess('asset' as any)).toEqual(
      expectedResult
    )
  })

  it('creates an action for failed fetch asset', () => {
    const expectedResult = {
      type: types.FETCH_ASSET_FOR_FORM_FAILED,
      payload: { error: 'Error' }
    }
    expect(actions.fetchAssetForFormFailed('Error')).toEqual(expectedResult)
  })

  it('creates an action to clear asset', () => {
    const expectedResult = {
      type: types.CLEAR_ASSET_FOR_FORM,
      payload: {}
    }
    expect(actions.clearAssetForForm()).toEqual(expectedResult)
  })
})

describe('form action creators', () => {
  it('creates an action to request action', () => {
    const payload = {
      actionType: 'insert',
      transactionId: 'testTransID',
      transaction: { assetManagerId: 88 }
    }
    const expectedResult = {
      type: types.TRANSACTION_FORM_ACTION,
      payload
    }
    expect(actions.transactionFormActionRequest(payload)).toEqual(
      expectedResult
    )
  })

  it('creates an action for failed form action', () => {
    const expectedResult = {
      type: types.TRANSACTION_FORM_ACTION_SUCCESS,
      payload: {}
    }
    expect(actions.transactionFormActionSuccess()).toEqual(expectedResult)
  })

  it('creates an action for failed form action', () => {
    const expectedResult = {
      type: types.TRANSACTION_FORM_ACTION_FAILED,
      payload: { error: 'Error' }
    }
    expect(actions.transactionFormActionFailed('Error')).toEqual(expectedResult)
  })

  it('creates an action to clear form action state', () => {
    const expectedResult = {
      type: types.TRANSACTION_FORM_ACTION_CLEAR,
      payload: {}
    }
    expect(actions.transactionFormActionClear()).toEqual(expectedResult)
  })
})

describe('fxFormAction', () => {
  it('creates action for fxFormAction', () => {
    const payload = {
      formName: 'fxForm',
      actionType: 'insert',
      transactionId: 'testTransID',
      transaction: { assetManagerId: 88 }
    }
    const expectedResult = {
      type: types.FX_FORM_ACTION,
      payload
    }
    expect(actions.fxFormAction(payload)).toEqual(expectedResult)
  })

  it('creates action to request deliverable status', () => {
    const expectedResult = {
      type: types.REQUEST_DELIVERABLE_STATUS,
      payload: { assetPrimaryReference: 'USD' }
    }
    expect(actions.requestFXFormDeliverableStatus('USD')).toEqual(
      expectedResult
    )
  })
  it('creates action to set deliverable status', () => {
    const expectedResult = {
      type: types.DELIVERABLE_STATUS_SUCCESS,
      payload: { deliverable: false }
    }
    expect(actions.fxDeliverableStatusSuccess(false)).toEqual(expectedResult)
  })
  it('creates action for failed request of deliverable status', () => {
    const expectedResult = {
      type: types.DELIVERABLE_STATUS_FAILED,
      payload: { error: 'test error' }
    }
    expect(actions.fxDeliverableStatusFailed('test error')).toEqual(
      expectedResult
    )
  })
})

import { call, put, select } from 'redux-saga/effects'
import { cloneableGenerator } from 'redux-saga/utils'
import { api } from '@amaas/amaas-core-sdk-js'
import moment from 'moment'

import { getAMId } from 'sagas/data'
import * as actions from 'actions/data/transactionForm'
import * as transactionFormSagas from './'
import { profileSelector } from 'selectors'

describe('fetchAssetForForm', () => {
  let data: any = {},
    action
  beforeAll(() => {
    action = {
      type: 'testType',
      payload: { assetId: 'testAssetId' }
    }
    data.gen = cloneableGenerator(transactionFormSagas.fetchAssetForForm)(
      action
    )
  })
  it('selects profileSelector', () => {
    const selected = data.gen.next().value
    expect(selected).toEqual(select(profileSelector))
  })

  it('calls api.Assets.retrieve', () => {
    const called = data.gen.next({ assumedAMID: 88 }).value
    expect(called).toEqual(
      call(api.Assets.retrieve, { AMId: 88, resourceId: 'testAssetId' })
    )
  })

  it.skip('calls api.Assets.retrieve again if there is an underlyingAssetId', () => {
    data.withUnderlying = data.gen.clone()
    const called = data.withUnderlying.next({
      assetId: 'testFuture',
      underlyingAssetId: 'testUnderlyingId'
    }).value
    expect(called).toEqual(
      call(api.Assets.retrieve, { AMId: 88, resourceId: 'testUnderlyingId' })
    )
  })

  it.skip('puts success with underlyingPrimaryReference', () => {
    const putted = data.withUnderlying.next({
      references: {
        PRIMARY: {
          referenceValue: 'testUnderlyingRef',
          referencePrimary: true
        }
      }
    }).value
    expect(putted).toEqual(
      put(
        actions.fetchAssetForFormSuccess({
          assetId: 'testFuture',
          underlyingAssetId: 'testUnderlyingId',
          underlyingPrimaryReference: 'testUnderlyingRef'
        })
      )
    )
  })

  it('puts success', () => {
    const putted = data.gen.next({ assetId: 'testAssetId' }).value
    expect(putted).toEqual(
      put(actions.fetchAssetForFormSuccess({ assetId: 'testAssetId' }))
    )
  })
})

describe('getDeliverableStatusSaga', () => {
  let action,
    data: any = {}
  beforeAll(() => {
    action = {
      type: 'MOCK_REQUEST_TYPE',
      payload: { assetPrimaryReference: 'GBPUSD' }
    }
    data.gen = cloneableGenerator(
      transactionFormSagas.getDeliverableStatusSaga
    )(action)
    data.noAsset = transactionFormSagas.getDeliverableStatusSaga({
      type: 'type',
      payload: {}
    })
    data.invalidAsset = transactionFormSagas.getDeliverableStatusSaga({
      type: 'type',
      payload: { assetPrimaryReference: 'InvalidFormat' }
    })
  })
  describe('if there is no assetPrimaryReference', () => {
    it('returns', () => {
      const done = data.noAsset.next().done
      expect(done).toBeTruthy()
    })
  })

  describe('if countercurrency is not of length 3', () => {
    it('puts failed action', () => {
      const putted = data.invalidAsset.next().value
      expect(putted).toEqual(
        put(
          actions.fxDeliverableStatusFailed(
            'Incorrect currency format: alidFormat'
          )
        )
      )
    })
  })

  describe('with valid input', () => {
    it('calls getAMId', () => {
      const called = data.gen.next().value
      expect(called).toEqual(call(getAMId, false))
    })

    it('calls assets fuzzy search with correct params', () => {
      const called = data.gen.next(88).value
      const expectedQuery = {
        query: 'USD',
        assetType: 'Currency',
        fuzzy: false,
        fields: 'assetId'
      }
      expect(called).toEqual(
        call(api.Assets.fuzzySearch, {
          AMId: 88,
          query: expectedQuery
        })
      )
    })
    it('puts success with result', () => {
      const putted = data.gen.next({ hits: { deliverable: true } }).value
      expect(putted).toEqual(put(actions.fxDeliverableStatusSuccess(true)))
    })
    describe('error thrown', () => {
      it('puts failed', () => {
        const thrown = data.gen.throw(new Error('test Error')).value
        expect(thrown).toEqual(
          put(actions.fxDeliverableStatusFailed('test Error'))
        )
      })
    })
  })
})

describe('sanitiseNumbers', () => {
  it('replaces commas', () => {
    const transaction = { quantity: '12,000' }
    const expectedResult = { quantity: '12000' }
    expect(
      transactionFormSagas.sanitiseNumbers(transaction, ['quantity'])
    ).toEqual(expectedResult)
  })

  it('converts to string', () => {
    const transaction = { price: 12000 }
    const expectedResult = { price: '12000' }
    expect(
      transactionFormSagas.sanitiseNumbers(transaction, ['price'])
    ).toEqual(expectedResult)
  })

  it('converts nested charges', () => {
    const transaction = {
      charges: [
        { name: 'Commission', chargeValue: '10,000' },
        { name: 'Stamp Duty', chargeValue: 15 }
      ]
    }
    const expectedResult = {
      charges: [
        { name: 'Commission', chargeValue: '10000' },
        { name: 'Stamp Duty', chargeValue: '15' }
      ]
    }
    expect(transactionFormSagas.sanitiseNumbers(transaction, [])).toEqual(
      expectedResult
    )
  })
})

describe('addCurrencyToCharges', () => {
  it('adds currency', () => {
    const transaction = {
      charges: [{ name: 'Commission', chargeValue: '10' }],
      settlementCurrency: 'USD'
    }
    const expectedResult = {
      charges: [{ name: 'Commission', chargeValue: '10', currency: 'USD' }],
      settlementCurrency: 'USD'
    }
    expect(transactionFormSagas.addCurrencyToCharges(transaction)).toEqual(
      expectedResult
    )
  })
})

describe('convertDatesToAMaaSFormat', () => {
  it('converts date correctly', () => {
    const transaction = { transactionDate: moment('31-12-2017', 'DD-MM-YYYY') } // this should be DI'd in
    const expectedResult = { transactionDate: '2017-12-31' }
    const result = transactionFormSagas.convertDatesToAMaaSFormat(transaction, [
      'transactionDate'
    ])
    expect(result).toEqual(expectedResult)
  })
})

describe('childArrayToObject', () => {
  it('converts empty set correctly', () => {
    const transaction = { charges: undefined, rates: [] }
    const expectedResult = { charges: {}, rates: {} }
    expect(
      transactionFormSagas.childArrayToObject(transaction, ['charges', 'rates'])
    ).toEqual(expectedResult)
  })

  it('converts a non-empty set correctly', () => {
    const transaction = {
      rates: [
        {
          name: 'Commission',
          rateValue: '10',
          currency: 'USD',
          netAffecting: true
        }
      ]
    }
    const expectedResult = {
      rates: {
        Commission: { rateValue: '10', currency: 'USD', netAffecting: true }
      }
    }
    expect(
      transactionFormSagas.childArrayToObject(transaction, ['rates'])
    ).toEqual(expectedResult)
  })
})

describe('childLinksToObject', () => {
  it('converts empty set correctly', () => {
    const transaction = { links: undefined }
    const expectedResult = { links: {} }
    expect(transactionFormSagas.childLinksToObject(transaction)).toEqual(
      expectedResult
    )
  })

  it('converts non-empty set correctly', () => {
    const transaction = { links: [{ name: 'Single', links: ['link1'] }] }
    const expectedResult = { links: { Single: ['link1'] } }
    expect(transactionFormSagas.childLinksToObject(transaction)).toEqual(
      expectedResult
    )
  })
})

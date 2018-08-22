import reducer from './'
import typeGenerator from 'actions/data/actionTypeGenerators'
import { CLEAR_DATA } from 'actions/data/types'
jest.mock('actions/data/actionTypeGenerators', () => jest.fn(mockedGenerator))

const initialState = {
  fetching: false,
  error: '',
  data: []
}

describe('data reducer', () => {
  it('should return the initial state if an unknown action is passed', () => {
    const expectedResult = {
      fetching: false,
      error: '',
      data: []
    }
    expect(reducer('transactions')(initialState, { type: undefined })).toEqual(
      initialState
    )
  })

  it('should set fetching to true on request to fetch', () => {
    const expectedResult = {
      fetching: true,
      error: '',
      data: []
    }
    expect(
      reducer('transactions')(initialState, {
        type: typeGenerator('transactions').request
      })
    ).toEqual(expectedResult)
  })

  it('should set fetching to false and set data on successful fetch', () => {
    const expectedResult = {
      fetching: false,
      error: '',
      data: [1, 2, 3]
    }
    expect(
      reducer('transactions')(
        { ...initialState, fetching: true },
        {
          type: typeGenerator('transactions').success,
          payload: { data: [1, 2, 3] }
        }
      )
    ).toEqual(expectedResult)
  })

  it('should set fetching to false and set error on unsuccessful fetch', () => {
    const expectedResult = {
      fetching: false,
      error: 'error',
      data: []
    }
    expect(
      reducer('transactions')(
        { ...initialState, fetching: true },
        {
          type: typeGenerator('transactions').failed,
          payload: { error: 'error' }
        }
      )
    ).toEqual(expectedResult)
  })

  it('should clear data', () => {
    const expectedResult = initialState
    expect(
      reducer('books')(
        { ...initialState, data: ['book1', 'book2'] },
        { type: typeGenerator('books').clearData, payload: {} }
      )
    ).toEqual(expectedResult)
  })
})

function mockedGenerator(dataType) {
  switch (dataType) {
    case 'transactions':
    default:
      return {
        request: 'testRequest',
        success: 'testSuccess',
        failed: 'testFailed'
      }
  }
}

import * as types from './types'
import * as actions from './'

describe('book selector action creators', () => {
  it('creates an action to toggle all business units', () => {
    const expectedResult = {
      type: types.TOGGLE_ALL_BU,
      payload: {}
    }
    expect(actions.toggleAllBUs()).toEqual(expectedResult)
  })

  it('creates an action to toggle all parties', () => {
    const expectedResult = {
      type: types.TOGGLE_ALL_PARTIES,
      payload: {}
    }
    expect(actions.toggleAllParties()).toEqual(expectedResult)
  })

  it('creates an action to toggle a single BU', () => {
    const expectedResult = {
      type: types.TOGGLE_BU,
      payload: { value: 'BU 1' }
    }
    expect(actions.toggleSingleBU('BU 1')).toEqual(expectedResult)
  })

  it('creates an action to toggle a single party', () => {
    const expectedResult = {
      type: types.TOGGLE_PARTY,
      payload: { value: 'Fund 1' }
    }
    expect(actions.toggleSingleParty('Fund 1')).toEqual(expectedResult)
  })

  it('creates an action to toggle all owners', () => {
    const expectedResult = {
      type: types.TOGGLE_ALL_OWNERS,
      payload: {}
    }
    expect(actions.toggleAllOwners()).toEqual(expectedResult)
  })

  it('creates an action to toggle an owner', () => {
    const expectedResult = {
      type: types.TOGGLE_OWNER,
      payload: { value: 'Owner 1' }
    }
    expect(actions.toggleOwner('Owner 1')).toEqual(expectedResult)
  })

  it('creates an action to toggle a book', () => {
    const expectedResult = {
      type: types.TOGGLE_BOOK,
      payload: { value: 'Book 1' }
    }
    expect(actions.toggleBook('Book 1')).toEqual(expectedResult)
  })

  it('creates an action to select all books', () => {
    const expectedResult = {
      type: types.SELECT_ALL_BOOKS, 
      payload: {}
    }
    expect(actions.selectAllBooks()).toEqual(expectedResult)
  })

  it('creates an action to deselect all books', () => {
    const expectedResult = {
      type: types.DESELECT_ALL_BOOKS,
      payload: {}
    }
    expect(actions.deSelectAllBooks()).toEqual(expectedResult)
  })

  it('creates an action to clear books', () => {
    const expectedResult = {
      type: types.CLEAR_BOOKS,
      payload: {}
    }
    expect(actions.clearBooks()).toEqual(expectedResult)
  })
})
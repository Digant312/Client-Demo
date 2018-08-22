import * as types from 'actions/bookSelector/types'
import { FETCH_BOOKS_SUCCESS } from 'actions/data/types'
import reducer from './'

const initialState = [
  { bookId: 'Book 1', ownerId: 'Trader 1', businessUnit: 'BU 1', partyId: 'Fund 1', visible: true },
  { bookId: 'Book 2', ownerId: 'Trader 2', businessUnit: 'BU 1', partyId: 'Fund 1', visible: true },
  { bookId: 'Book 3', ownerId: 'Trader 3', businessUnit: 'BU 2', partyId: 'Fund 1', visible: true },
  { bookId: 'Book 4', ownerId: 'Trader 4', businessUnit: 'BU 2', partyId: 'Fund 1', visible: true },
  { bookId: 'Book 5', ownerId: 'Trader 5', businessUnit: 'BU 3', partyId: 'Fund 2', visible: true },
  { bookId: 'Book 6', ownerId: 'Trader 6', businessUnit: 'BU 3', partyId: 'Fund 2', visible: true },
  { bookId: 'Book 7', ownerId: 'Trader 7', businessUnit: 'BU 4', partyId: 'Fund 2', visible: true },
  { bookId: 'Book 8', ownerId: 'Trader 8', businessUnit: 'BU 4', partyId: 'Fund 2', visible: true },
  { bookId: 'Book 9', ownerId: 'Trader 9', businessUnit: 'BU 5', partyId: 'Fund 3', visible: true },
  { bookId: 'Book 10', ownerId: 'Trader 10', businessUnit: 'BU 5', partyId: 'Fund 3', visible: true },
  { bookId: 'Book 11', ownerId: 'Trader 11', visible: true },
  { bookId: 'Book 12', ownerId: 'Trader 12', partyId: 'Fund 3', visible: true },
  { bookId: 'Book 13', ownerId: 'Trader 12', businessUnit: 'BU 6', visible: true },
  { bookId: 'Book 14', ownerId: 'Trader 12', visible: true },
  { bookId: 'Book 15', ownerId: 'Trader 12', visible: true }
]

describe('bookSelector visibility reducer', () => {
  it('returns inital state on unknown action', () => {
    const expectedResult = initialState
    expect(reducer(initialState, { type: 'unknown', payload: { type: 'type', value: 'value' } })).toEqual(expectedResult)
  })

  it('only returns book types "Trading" and "Management', () => {
    const expectedResult = [{ bookType: 'Trading', visible: true }]
    const initialResult = [{ bookType: 'Trading' }, { bookType: 'Counterparty' }]
    expect(reducer([], { type: FETCH_BOOKS_SUCCESS, payload: { data: initialResult } })).toEqual(expectedResult)
  })

  it('toggles visibility for all business units', () => {
    const expectedResult = [
      { bookId: 'Book 1', ownerId: 'Trader 1', businessUnit: 'BU 1', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 2', ownerId: 'Trader 2', businessUnit: 'BU 1', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 3', ownerId: 'Trader 3', businessUnit: 'BU 2', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 4', ownerId: 'Trader 4', businessUnit: 'BU 2', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 5', ownerId: 'Trader 5', businessUnit: 'BU 3', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 6', ownerId: 'Trader 6', businessUnit: 'BU 3', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 7', ownerId: 'Trader 7', businessUnit: 'BU 4', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 8', ownerId: 'Trader 8', businessUnit: 'BU 4', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 9', ownerId: 'Trader 9', businessUnit: 'BU 5', partyId: 'Fund 3', visible: false },
      { bookId: 'Book 10', ownerId: 'Trader 10', businessUnit: 'BU 5', partyId: 'Fund 3', visible: false },
      { bookId: 'Book 11', ownerId: 'Trader 11', visible: true },
      { bookId: 'Book 12', ownerId: 'Trader 12', partyId: 'Fund 3', visible: true },
      { bookId: 'Book 13', ownerId: 'Trader 12', businessUnit: 'BU 6', visible: false },
      { bookId: 'Book 14', ownerId: 'Trader 12', visible: true },
      { bookId: 'Book 15', ownerId: 'Trader 12', visible: true }
    ]
    expect(reducer(initialState, { type: types.TOGGLE_ALL_BU, payload: { type: 'bu', value: 'bu' } })).toEqual(expectedResult)
  })

  it('toggling all business units will deselect all if there is at least one visibile business unit', () => {
    const expectedResult = [
      { bookId: 'Book 1', ownerId: 'Trader 1', businessUnit: 'BU 1', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 2', ownerId: 'Trader 2', businessUnit: 'BU 1', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 3', ownerId: 'Trader 3', businessUnit: 'BU 2', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 4', ownerId: 'Trader 4', businessUnit: 'BU 2', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 5', ownerId: 'Trader 5', businessUnit: 'BU 3', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 6', ownerId: 'Trader 6', businessUnit: 'BU 3', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 7', ownerId: 'Trader 7', businessUnit: 'BU 4', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 8', ownerId: 'Trader 8', businessUnit: 'BU 4', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 9', ownerId: 'Trader 9', businessUnit: 'BU 5', partyId: 'Fund 3', visible: false },
      { bookId: 'Book 10', ownerId: 'Trader 10', businessUnit: 'BU 5', partyId: 'Fund 3', visible: false },
      { bookId: 'Book 11', ownerId: 'Trader 11', visible: true },
      { bookId: 'Book 12', ownerId: 'Trader 12', partyId: 'Fund 3', visible: true },
      { bookId: 'Book 13', ownerId: 'Trader 12', businessUnit: 'BU 6', visible: false },
      { bookId: 'Book 14', ownerId: 'Trader 12', visible: true },
      { bookId: 'Book 15', ownerId: 'Trader 12', visible: true }
    ]
    const initial = [
      { bookId: 'Book 1', ownerId: 'Trader 1', businessUnit: 'BU 1', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 2', ownerId: 'Trader 2', businessUnit: 'BU 1', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 3', ownerId: 'Trader 3', businessUnit: 'BU 2', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 4', ownerId: 'Trader 4', businessUnit: 'BU 2', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 5', ownerId: 'Trader 5', businessUnit: 'BU 3', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 6', ownerId: 'Trader 6', businessUnit: 'BU 3', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 7', ownerId: 'Trader 7', businessUnit: 'BU 4', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 8', ownerId: 'Trader 8', businessUnit: 'BU 4', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 9', ownerId: 'Trader 9', businessUnit: 'BU 5', partyId: 'Fund 3', visible: false },
      { bookId: 'Book 10', ownerId: 'Trader 10', businessUnit: 'BU 5', partyId: 'Fund 3', visible: false },
      { bookId: 'Book 11', ownerId: 'Trader 11', visible: true },
      { bookId: 'Book 12', ownerId: 'Trader 12', partyId: 'Fund 3', visible: true },
      { bookId: 'Book 13', ownerId: 'Trader 12', businessUnit: 'BU 6', visible: true },
      { bookId: 'Book 14', ownerId: 'Trader 12', visible: true },
      { bookId: 'Book 15', ownerId: 'Trader 12', visible: true }
    ]
    expect(reducer(initial, { type: types.TOGGLE_ALL_BU, payload: { type: 'bu', value: 'bu' } })).toEqual(expectedResult)
  })

  it('toggles visibility for all parties', () => {
    const expectedResult = [
      { bookId: 'Book 1', ownerId: 'Trader 1', businessUnit: 'BU 1', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 2', ownerId: 'Trader 2', businessUnit: 'BU 1', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 3', ownerId: 'Trader 3', businessUnit: 'BU 2', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 4', ownerId: 'Trader 4', businessUnit: 'BU 2', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 5', ownerId: 'Trader 5', businessUnit: 'BU 3', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 6', ownerId: 'Trader 6', businessUnit: 'BU 3', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 7', ownerId: 'Trader 7', businessUnit: 'BU 4', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 8', ownerId: 'Trader 8', businessUnit: 'BU 4', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 9', ownerId: 'Trader 9', businessUnit: 'BU 5', partyId: 'Fund 3', visible: false },
      { bookId: 'Book 10', ownerId: 'Trader 10', businessUnit: 'BU 5', partyId: 'Fund 3', visible: false },
      { bookId: 'Book 11', ownerId: 'Trader 11', visible: true },
      { bookId: 'Book 12', ownerId: 'Trader 12', partyId: 'Fund 3', visible: false },
      { bookId: 'Book 13', ownerId: 'Trader 12', businessUnit: 'BU 6', visible: true },
      { bookId: 'Book 14', ownerId: 'Trader 12', visible: true },
      { bookId: 'Book 15', ownerId: 'Trader 12', visible: true }
    ]
    expect(reducer(initialState, { type: types.TOGGLE_ALL_PARTIES, payload: { type: 'party', value: 'party' } })).toEqual(expectedResult)
  })

  it('toggling visibility for all parties will deselect all if at least one party set is visibile', () => {
    const expectedResult = [
      { bookId: 'Book 1', ownerId: 'Trader 1', businessUnit: 'BU 1', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 2', ownerId: 'Trader 2', businessUnit: 'BU 1', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 3', ownerId: 'Trader 3', businessUnit: 'BU 2', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 4', ownerId: 'Trader 4', businessUnit: 'BU 2', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 5', ownerId: 'Trader 5', businessUnit: 'BU 3', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 6', ownerId: 'Trader 6', businessUnit: 'BU 3', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 7', ownerId: 'Trader 7', businessUnit: 'BU 4', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 8', ownerId: 'Trader 8', businessUnit: 'BU 4', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 9', ownerId: 'Trader 9', businessUnit: 'BU 5', partyId: 'Fund 3', visible: false },
      { bookId: 'Book 10', ownerId: 'Trader 10', businessUnit: 'BU 5', partyId: 'Fund 3', visible: false },
      { bookId: 'Book 11', ownerId: 'Trader 11', visible: true },
      { bookId: 'Book 12', ownerId: 'Trader 12', partyId: 'Fund 3', visible: false },
      { bookId: 'Book 13', ownerId: 'Trader 12', businessUnit: 'BU 6', visible: true },
      { bookId: 'Book 14', ownerId: 'Trader 12', visible: true },
      { bookId: 'Book 15', ownerId: 'Trader 12', visible: true }
    ]
    const initial = [
      { bookId: 'Book 1', ownerId: 'Trader 1', businessUnit: 'BU 1', partyId: 'Fund 1', visible: true },
      { bookId: 'Book 2', ownerId: 'Trader 2', businessUnit: 'BU 1', partyId: 'Fund 1', visible: true },
      { bookId: 'Book 3', ownerId: 'Trader 3', businessUnit: 'BU 2', partyId: 'Fund 1', visible: true },
      { bookId: 'Book 4', ownerId: 'Trader 4', businessUnit: 'BU 2', partyId: 'Fund 1', visible: true },
      { bookId: 'Book 5', ownerId: 'Trader 5', businessUnit: 'BU 3', partyId: 'Fund 2', visible: true },
      { bookId: 'Book 6', ownerId: 'Trader 6', businessUnit: 'BU 3', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 7', ownerId: 'Trader 7', businessUnit: 'BU 4', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 8', ownerId: 'Trader 8', businessUnit: 'BU 4', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 9', ownerId: 'Trader 9', businessUnit: 'BU 5', partyId: 'Fund 3', visible: true },
      { bookId: 'Book 10', ownerId: 'Trader 10', businessUnit: 'BU 5', partyId: 'Fund 3', visible: true },
      { bookId: 'Book 11', ownerId: 'Trader 11', visible: true },
      { bookId: 'Book 12', ownerId: 'Trader 12', partyId: 'Fund 3', visible: true },
      { bookId: 'Book 13', ownerId: 'Trader 12', businessUnit: 'BU 6', visible: true },
      { bookId: 'Book 14', ownerId: 'Trader 12', visible: true },
      { bookId: 'Book 15', ownerId: 'Trader 12', visible: true }
    ]
    expect(reducer(initial, { type: types.TOGGLE_ALL_PARTIES, payload: { type: 'party', value: 'party' } })).toEqual(expectedResult)
  })

  it('toggles visibility for all owners', () => {
    const expectedResult = [
      { bookId: 'Book 1', ownerId: 'Trader 1', businessUnit: 'BU 1', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 2', ownerId: 'Trader 2', businessUnit: 'BU 1', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 3', ownerId: 'Trader 3', businessUnit: 'BU 2', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 4', ownerId: 'Trader 4', businessUnit: 'BU 2', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 5', ownerId: 'Trader 5', businessUnit: 'BU 3', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 6', ownerId: 'Trader 6', businessUnit: 'BU 3', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 7', ownerId: 'Trader 7', businessUnit: 'BU 4', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 8', ownerId: 'Trader 8', businessUnit: 'BU 4', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 9', ownerId: 'Trader 9', businessUnit: 'BU 5', partyId: 'Fund 3', visible: false },
      { bookId: 'Book 10', ownerId: 'Trader 10', businessUnit: 'BU 5', partyId: 'Fund 3', visible: false },
      { bookId: 'Book 11', ownerId: 'Trader 11', visible: false },
      { bookId: 'Book 12', ownerId: 'Trader 12', partyId: 'Fund 3', visible: false },
      { bookId: 'Book 13', ownerId: 'Trader 12', businessUnit: 'BU 6', visible: false },
      { bookId: 'Book 14', ownerId: 'Trader 12', visible: false },
      { bookId: 'Book 15', ownerId: 'Trader 12', visible: false }
    ]
    expect(reducer(initialState, { type: types.TOGGLE_ALL_OWNERS, payload: {} })).toEqual(expectedResult)
  })

  it('toggling visibility for all owners will deselect all if at least one owner set is visibile', () => {
    const initial = [
      { bookId: 'Book 1', ownerId: 'Trader 1', businessUnit: 'BU 1', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 2', ownerId: 'Trader 2', businessUnit: 'BU 1', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 3', ownerId: 'Trader 3', businessUnit: 'BU 2', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 4', ownerId: 'Trader 4', businessUnit: 'BU 2', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 5', ownerId: 'Trader 5', businessUnit: 'BU 3', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 6', ownerId: 'Trader 6', businessUnit: 'BU 3', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 7', ownerId: 'Trader 7', businessUnit: 'BU 4', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 8', ownerId: 'Trader 8', businessUnit: 'BU 4', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 9', ownerId: 'Trader 9', businessUnit: 'BU 5', partyId: 'Fund 3', visible: false },
      { bookId: 'Book 10', ownerId: 'Trader 10', businessUnit: 'BU 5', partyId: 'Fund 3', visible: true },
      { bookId: 'Book 11', ownerId: 'Trader 11', visible: true },
      { bookId: 'Book 12', ownerId: 'Trader 12', partyId: 'Fund 3', visible: true },
      { bookId: 'Book 13', ownerId: 'Trader 12', businessUnit: 'BU 6', visible: true },
      { bookId: 'Book 14', ownerId: 'Trader 12', visible: true },
      { bookId: 'Book 15', ownerId: 'Trader 12', visible: true }
    ]
    const expectedResult = [
      { bookId: 'Book 1', ownerId: 'Trader 1', businessUnit: 'BU 1', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 2', ownerId: 'Trader 2', businessUnit: 'BU 1', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 3', ownerId: 'Trader 3', businessUnit: 'BU 2', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 4', ownerId: 'Trader 4', businessUnit: 'BU 2', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 5', ownerId: 'Trader 5', businessUnit: 'BU 3', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 6', ownerId: 'Trader 6', businessUnit: 'BU 3', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 7', ownerId: 'Trader 7', businessUnit: 'BU 4', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 8', ownerId: 'Trader 8', businessUnit: 'BU 4', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 9', ownerId: 'Trader 9', businessUnit: 'BU 5', partyId: 'Fund 3', visible: false },
      { bookId: 'Book 10', ownerId: 'Trader 10', businessUnit: 'BU 5', partyId: 'Fund 3', visible: false },
      { bookId: 'Book 11', ownerId: 'Trader 11', visible: false },
      { bookId: 'Book 12', ownerId: 'Trader 12', partyId: 'Fund 3', visible: false },
      { bookId: 'Book 13', ownerId: 'Trader 12', businessUnit: 'BU 6', visible: false },
      { bookId: 'Book 14', ownerId: 'Trader 12', visible: false },
      { bookId: 'Book 15', ownerId: 'Trader 12', visible: false }
    ]
    expect(reducer(initial, { type: types.TOGGLE_ALL_OWNERS, payload: {} })).toEqual(expectedResult)
  })

  it('toggles visibility for a single business unit', () => {
    const expectedResult = [
      { bookId: 'Book 1', ownerId: 'Trader 1', businessUnit: 'BU 1', partyId: 'Fund 1', visible: true },
      { bookId: 'Book 2', ownerId: 'Trader 2', businessUnit: 'BU 1', partyId: 'Fund 1', visible: true },
      { bookId: 'Book 3', ownerId: 'Trader 3', businessUnit: 'BU 2', partyId: 'Fund 1', visible: true },
      { bookId: 'Book 4', ownerId: 'Trader 4', businessUnit: 'BU 2', partyId: 'Fund 1', visible: true },
      { bookId: 'Book 5', ownerId: 'Trader 5', businessUnit: 'BU 3', partyId: 'Fund 2', visible: true },
      { bookId: 'Book 6', ownerId: 'Trader 6', businessUnit: 'BU 3', partyId: 'Fund 2', visible: true },
      { bookId: 'Book 7', ownerId: 'Trader 7', businessUnit: 'BU 4', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 8', ownerId: 'Trader 8', businessUnit: 'BU 4', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 9', ownerId: 'Trader 9', businessUnit: 'BU 5', partyId: 'Fund 3', visible: true },
      { bookId: 'Book 10', ownerId: 'Trader 10', businessUnit: 'BU 5', partyId: 'Fund 3', visible: true },
      { bookId: 'Book 11', ownerId: 'Trader 11', visible: true },
      { bookId: 'Book 12', ownerId: 'Trader 12', partyId: 'Fund 3', visible: true },
      { bookId: 'Book 13', ownerId: 'Trader 12', businessUnit: 'BU 6', visible: true },
      { bookId: 'Book 14', ownerId: 'Trader 12', visible: true },
      { bookId: 'Book 15', ownerId: 'Trader 12', visible: true }
    ]
    expect(reducer(initialState, { type: types.TOGGLE_BU, payload: { type: 'businessUnit', value: 'BU 4' } })).toEqual(expectedResult)
  })

  it('toggles visibility for a single party', () => {
    const expectedResult = [
      { bookId: 'Book 1', ownerId: 'Trader 1', businessUnit: 'BU 1', partyId: 'Fund 1', visible: true },
      { bookId: 'Book 2', ownerId: 'Trader 2', businessUnit: 'BU 1', partyId: 'Fund 1', visible: true },
      { bookId: 'Book 3', ownerId: 'Trader 3', businessUnit: 'BU 2', partyId: 'Fund 1', visible: true },
      { bookId: 'Book 4', ownerId: 'Trader 4', businessUnit: 'BU 2', partyId: 'Fund 1', visible: true },
      { bookId: 'Book 5', ownerId: 'Trader 5', businessUnit: 'BU 3', partyId: 'Fund 2', visible: true },
      { bookId: 'Book 6', ownerId: 'Trader 6', businessUnit: 'BU 3', partyId: 'Fund 2', visible: true },
      { bookId: 'Book 7', ownerId: 'Trader 7', businessUnit: 'BU 4', partyId: 'Fund 2', visible: true },
      { bookId: 'Book 8', ownerId: 'Trader 8', businessUnit: 'BU 4', partyId: 'Fund 2', visible: true },
      { bookId: 'Book 9', ownerId: 'Trader 9', businessUnit: 'BU 5', partyId: 'Fund 3', visible: false },
      { bookId: 'Book 10', ownerId: 'Trader 10', businessUnit: 'BU 5', partyId: 'Fund 3', visible: false },
      { bookId: 'Book 11', ownerId: 'Trader 11', visible: true },
      { bookId: 'Book 12', ownerId: 'Trader 12', partyId: 'Fund 3', visible: false },
      { bookId: 'Book 13', ownerId: 'Trader 12', businessUnit: 'BU 6', visible: true },
      { bookId: 'Book 14', ownerId: 'Trader 12', visible: true },
      { bookId: 'Book 15', ownerId: 'Trader 12', visible: true }
    ]
    expect(reducer(initialState, { type: types.TOGGLE_PARTY, payload: { type: 'partyId', value: 'Fund 3' } })).toEqual(expectedResult)
  })

  it('toggles visibility for a single owner', () => {
    const expectedResult = [
      { bookId: 'Book 1', ownerId: 'Trader 1', businessUnit: 'BU 1', partyId: 'Fund 1', visible: true },
      { bookId: 'Book 2', ownerId: 'Trader 2', businessUnit: 'BU 1', partyId: 'Fund 1', visible: true },
      { bookId: 'Book 3', ownerId: 'Trader 3', businessUnit: 'BU 2', partyId: 'Fund 1', visible: true },
      { bookId: 'Book 4', ownerId: 'Trader 4', businessUnit: 'BU 2', partyId: 'Fund 1', visible: true },
      { bookId: 'Book 5', ownerId: 'Trader 5', businessUnit: 'BU 3', partyId: 'Fund 2', visible: true },
      { bookId: 'Book 6', ownerId: 'Trader 6', businessUnit: 'BU 3', partyId: 'Fund 2', visible: true },
      { bookId: 'Book 7', ownerId: 'Trader 7', businessUnit: 'BU 4', partyId: 'Fund 2', visible: true },
      { bookId: 'Book 8', ownerId: 'Trader 8', businessUnit: 'BU 4', partyId: 'Fund 2', visible: true },
      { bookId: 'Book 9', ownerId: 'Trader 9', businessUnit: 'BU 5', partyId: 'Fund 3', visible: true },
      { bookId: 'Book 10', ownerId: 'Trader 10', businessUnit: 'BU 5', partyId: 'Fund 3', visible: true },
      { bookId: 'Book 11', ownerId: 'Trader 11', visible: true },
      { bookId: 'Book 12', ownerId: 'Trader 12', partyId: 'Fund 3', visible: false },
      { bookId: 'Book 13', ownerId: 'Trader 12', businessUnit: 'BU 6', visible: false },
      { bookId: 'Book 14', ownerId: 'Trader 12', visible: false },
      { bookId: 'Book 15', ownerId: 'Trader 12', visible: false }
    ]
    expect(reducer(initialState, { type: types.TOGGLE_OWNER, payload: { type: 'ownerId', value: 'Trader 12' } })).toEqual(expectedResult)
  })

  it('toggles visibility for a single book', () => {
    const expectedResult = [
      { bookId: 'Book 1', ownerId: 'Trader 1', businessUnit: 'BU 1', partyId: 'Fund 1', visible: true },
      { bookId: 'Book 2', ownerId: 'Trader 2', businessUnit: 'BU 1', partyId: 'Fund 1', visible: true },
      { bookId: 'Book 3', ownerId: 'Trader 3', businessUnit: 'BU 2', partyId: 'Fund 1', visible: true },
      { bookId: 'Book 4', ownerId: 'Trader 4', businessUnit: 'BU 2', partyId: 'Fund 1', visible: true },
      { bookId: 'Book 5', ownerId: 'Trader 5', businessUnit: 'BU 3', partyId: 'Fund 2', visible: true },
      { bookId: 'Book 6', ownerId: 'Trader 6', businessUnit: 'BU 3', partyId: 'Fund 2', visible: true },
      { bookId: 'Book 7', ownerId: 'Trader 7', businessUnit: 'BU 4', partyId: 'Fund 2', visible: true },
      { bookId: 'Book 8', ownerId: 'Trader 8', businessUnit: 'BU 4', partyId: 'Fund 2', visible: true },
      { bookId: 'Book 9', ownerId: 'Trader 9', businessUnit: 'BU 5', partyId: 'Fund 3', visible: false },
      { bookId: 'Book 10', ownerId: 'Trader 10', businessUnit: 'BU 5', partyId: 'Fund 3', visible: true },
      { bookId: 'Book 11', ownerId: 'Trader 11', visible: true },
      { bookId: 'Book 12', ownerId: 'Trader 12', partyId: 'Fund 3', visible: true },
      { bookId: 'Book 13', ownerId: 'Trader 12', businessUnit: 'BU 6', visible: true },
      { bookId: 'Book 14', ownerId: 'Trader 12', visible: true },
      { bookId: 'Book 15', ownerId: 'Trader 12', visible: true }
    ]
    expect(reducer(initialState, { type: types.TOGGLE_BOOK, payload: { type: 'bookId', value: 'Book 9' } })).toEqual(expectedResult)
  })

  it('toggles all visibility on', () => {
    const expectedResult = initialState
    const initial = [
      { bookId: 'Book 1', ownerId: 'Trader 1', businessUnit: 'BU 1', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 2', ownerId: 'Trader 2', businessUnit: 'BU 1', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 3', ownerId: 'Trader 3', businessUnit: 'BU 2', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 4', ownerId: 'Trader 4', businessUnit: 'BU 2', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 5', ownerId: 'Trader 5', businessUnit: 'BU 3', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 6', ownerId: 'Trader 6', businessUnit: 'BU 3', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 7', ownerId: 'Trader 7', businessUnit: 'BU 4', partyId: 'Fund 2', visible: true },
      { bookId: 'Book 8', ownerId: 'Trader 8', businessUnit: 'BU 4', partyId: 'Fund 2', visible: true },
      { bookId: 'Book 9', ownerId: 'Trader 9', businessUnit: 'BU 5', partyId: 'Fund 3', visible: true },
      { bookId: 'Book 10', ownerId: 'Trader 10', businessUnit: 'BU 5', partyId: 'Fund 3', visible: true },
      { bookId: 'Book 11', ownerId: 'Trader 11', visible: true },
      { bookId: 'Book 12', ownerId: 'Trader 12', partyId: 'Fund 3', visible: true },
      { bookId: 'Book 13', ownerId: 'Trader 12', businessUnit: 'BU 6', visible: true },
      { bookId: 'Book 14', ownerId: 'Trader 12', visible: true },
      { bookId: 'Book 15', ownerId: 'Trader 12', visible: true }
    ]
    expect(reducer(initial, { type: types.SELECT_ALL_BOOKS, payload: {} })).toEqual(expectedResult)
  })

  it('toggles all visibility off', () => {
    const expectedResult = [
      { bookId: 'Book 1', ownerId: 'Trader 1', businessUnit: 'BU 1', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 2', ownerId: 'Trader 2', businessUnit: 'BU 1', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 3', ownerId: 'Trader 3', businessUnit: 'BU 2', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 4', ownerId: 'Trader 4', businessUnit: 'BU 2', partyId: 'Fund 1', visible: false },
      { bookId: 'Book 5', ownerId: 'Trader 5', businessUnit: 'BU 3', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 6', ownerId: 'Trader 6', businessUnit: 'BU 3', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 7', ownerId: 'Trader 7', businessUnit: 'BU 4', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 8', ownerId: 'Trader 8', businessUnit: 'BU 4', partyId: 'Fund 2', visible: false },
      { bookId: 'Book 9', ownerId: 'Trader 9', businessUnit: 'BU 5', partyId: 'Fund 3', visible: false },
      { bookId: 'Book 10', ownerId: 'Trader 10', businessUnit: 'BU 5', partyId: 'Fund 3', visible: false },
      { bookId: 'Book 11', ownerId: 'Trader 11', visible: false },
      { bookId: 'Book 12', ownerId: 'Trader 12', partyId: 'Fund 3', visible: false },
      { bookId: 'Book 13', ownerId: 'Trader 12', businessUnit: 'BU 6', visible: false },
      { bookId: 'Book 14', ownerId: 'Trader 12', visible: false },
      { bookId: 'Book 15', ownerId: 'Trader 12', visible: false }
    ]
    expect(reducer(initialState, { type: types.DESELECT_ALL_BOOKS, payload: {} })).toEqual(expectedResult)
  })

  it('should clear books', () => {
    const expectedResult = []
    expect(reducer(initialState, { type: types.CLEAR_BOOKS, payload: {} })).toEqual(expectedResult)
  })
})

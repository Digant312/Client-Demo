import { Action } from 'redux'

import * as types from 'actions/bookSelector/types'
import { FETCH_BOOKS_SUCCESS } from 'actions/data/types'

interface IAction extends Action {
  payload: {
    type?: string
    value?: string
    data?: any[]
  }
}

export interface IBook {
  bookId: string
  ownerId: number | string
  businessUnit?: string
  partyId?: string
  visible?: boolean
  [prop: string]: any
}

const initialState: any[] = [
  // { bookId: 'Book 1', ownerId: 'Trader 1', businessUnit: 'BU 1', partyId: 'Fund 1', visible: true },
  // { bookId: 'Book 2', ownerId: 'Trader 2', businessUnit: 'BU 1', partyId: 'Fund 1', visible: true },
  // { bookId: 'Book 3', ownerId: 'Trader 3', businessUnit: 'BU 2', partyId: 'Fund 1', visible: true },
  // { bookId: 'Book 4', ownerId: 'Trader 4', businessUnit: 'BU 2', partyId: 'Fund 1', visible: true },
  // { bookId: 'Book 5', ownerId: 'Trader 5', businessUnit: 'BU 3', partyId: 'Fund 2', visible: true },
  // { bookId: 'Book 6', ownerId: 'Trader 6', businessUnit: 'BU 3', partyId: 'Fund 2', visible: true },
  // { bookId: 'Book 7', ownerId: 'Trader 7', businessUnit: 'BU 4', partyId: 'Fund 2', visible: true },
  // { bookId: 'Book 8', ownerId: 'Trader 8', businessUnit: 'BU 4', partyId: 'Fund 2', visible: true },
  // { bookId: 'Book 9', ownerId: 'Trader 9', businessUnit: 'BU 5', partyId: 'Fund 3', visible: true },
  // { bookId: 'Book 10', ownerId: 'Trader 10', businessUnit: 'BU 5', partyId: 'Fund 3', visible: true },
  // { bookId: 'Book 11', ownerId: 'Trader 11', visible: true },
  // { bookId: 'Book 12', ownerId: 'Trader 12', partyId: 'Fund 3', visible: true },
  // { bookId: 'Book 13', ownerId: 'Trader 12', businessUnit: 'BU 6', visible: true },
  // { bookId: 'Book 14', ownerId: 'Trader 12', visible: true },
  // { bookId: 'Book 15', ownerId: 'Trader 12', visible: true }
]

const allBUVisibility = (state: IBook[]) =>
  state.filter((book: IBook) => book.businessUnit && book.visible)
const allPartyVisibility = (state: IBook[]) =>
  state.filter((book: IBook) => book.partyId && book.visible)
const allOwnerVisibility = (state: IBook[]) => 
  state.filter((book: IBook) => book.ownerId && book.visible)
const singleBUVisibiliy = (state: IBook[], bu: string) =>
  state.filter(
    (book: IBook) =>
      book.businessUnit && book.businessUnit === bu && book.visible
  )
const singlePartyVisibility = (state: IBook[], partyId: string) =>
  state.filter(
    (book: IBook) => book.partyId && book.partyId === partyId && book.visible
  )
const ownerVisibility = (state: IBook[], ownerId: string | number) =>
  state.filter((book: IBook) => book.ownerId == ownerId && book.visible)

export default (state: IBook[] = initialState, action: IAction) => {
  switch (action.type) {
    case FETCH_BOOKS_SUCCESS:
      return (
        action.payload.data &&
        action.payload.data
          .filter(
            book =>
              book.bookType === 'Trading' || book.bookType === 'Management'
          )
          .map(book => ({ ...book, visible: true }))
      )
    case types.TOGGLE_ALL_BU:
      return state.map(
        (book: IBook) =>
          book.businessUnit
            ? {
                ...book,
                visible: allBUVisibility(state).length > 0 ? false : true
              }
            : book
      )
    case types.TOGGLE_ALL_PARTIES:
      return state.map(
        (book: IBook) =>
          book.partyId
            ? {
                ...book,
                visible: allPartyVisibility(state).length > 0 ? false : true
              }
            : book
      )
    case types.TOGGLE_ALL_OWNERS:
      return state.map(
        (book: IBook) =>
          book.ownerId
            ? {
                ...book,
                visible: allOwnerVisibility(state).length > 0 ? false : true
              }
            : book
      )
    case types.TOGGLE_BU:
      return state.map(
        (book: IBook) =>
          book.businessUnit && book.businessUnit === action.payload.value
            ? {
                ...book,
                visible:
                  singleBUVisibiliy(state, action.payload.value).length > 0
                    ? false
                    : true
              }
            : book
      )
    case types.TOGGLE_PARTY:
      return state.map(
        (book: IBook) =>
          book.partyId && book.partyId === action.payload.value
            ? {
                ...book,
                visible:
                  singlePartyVisibility(state, action.payload.value).length > 0
                    ? false
                    : true
              }
            : book
      )
    case types.TOGGLE_OWNER:
      return state.map(
        (book: IBook) =>
          book.ownerId == action.payload.value
            ? {
                ...book,
                visible:
                  ownerVisibility(state, action.payload.value).length > 0
                    ? false
                    : true
              }
            : book
      )
    case types.TOGGLE_BOOK:
      return state.map(
        (book: IBook) =>
          book.bookId === action.payload.value
            ? { ...book, visible: !book.visible }
            : book
      )
    case types.SELECT_ALL_BOOKS:
      return state.map((book: IBook) => ({ ...book, visible: true }))
    case types.DESELECT_ALL_BOOKS:
      return state.map((book: IBook) => ({ ...book, visible: false }))
    case types.CLEAR_BOOKS:
      return []
    default:
      return state
  }
}

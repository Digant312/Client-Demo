import * as types from './types'

export const toggleAllBUs = () => (
  {
    type: types.TOGGLE_ALL_BU,
    payload: {}
  }
)

export const toggleAllParties = () => (
  {
    type: types.TOGGLE_ALL_PARTIES,
    payload: {}
  }
)

export const toggleAllOwners = () => (
  {
    type: types.TOGGLE_ALL_OWNERS,
    payload: {}
  }
)

export const toggleSingleBU = (value: string | number) => (
  {
    type: types.TOGGLE_BU,
    payload: { value }
  }
)
export const toggleSingleParty = (value: string | number) => (
  {
    type: types.TOGGLE_PARTY,
    payload: { value }
  }
)
export const toggleOwner = (value: string | number) => (
  {
    type: types.TOGGLE_OWNER,
    payload: { value }
  }
)
export const toggleBook = (value: string | number) => (
  {
    type: types.TOGGLE_BOOK,
    payload: { value }
  }
)

export const selectAllBooks = () => (
  {
    type: types.SELECT_ALL_BOOKS,
    payload: {}
  }
)

export const deSelectAllBooks = () => (
  {
    type: types.DESELECT_ALL_BOOKS,
    payload: {}
  }
)

export const clearBooks = () => (
  {
    type: types.CLEAR_BOOKS,
    payload: {}
  }
)
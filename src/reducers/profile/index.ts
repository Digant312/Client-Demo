import { Action } from 'redux'
import isNumber from 'lodash/isNumber'

import * as authTypes from 'actions/session/types'
import { IAssumableAMIDs } from 'actions/session'

export type dateFormats = 'DD-MM-YYYY' | 'YYYY-MM-DD'

export interface IProfileState {
  fetching: boolean
  username: string
  email: string
  assetManagerId: string
  assumedAMID: string
  assumableAMIDs: IAssumableAMIDs[]
  darkProfile: boolean
  dateFormat: dateFormats
}

interface IAction extends Action {
  payload: {
    username?: string
    email?: string
    assetManagerId?: string
    assumableAMIDs?: IAssumableAMIDs[]
    assumedAMID?: number
    darkProfile?: boolean
    dateFormat?: dateFormats
  }
}

const initialState: IProfileState = {
  fetching: false,
  username: '',
  email: '',
  assetManagerId: '',
  assumedAMID: '',
  assumableAMIDs: [],
  darkProfile: false,
  dateFormat: 'DD-MM-YYYY'
}

export default (state: IProfileState = initialState, action: IAction) => {
  switch (action.type) {
    case authTypes.REQUEST_LOGIN:
    case authTypes.REQUEST_AUTHENTICATION:
      return { ...state, fetching: true }
    case authTypes.LOGIN_SUCCESS:
    case authTypes.AUTHENTICATION_SUCCESS:
      let assumedAMID = parseInt(state.assumedAMID || '0')
      let assumableAMIDs = action.payload.assumableAMIDs
        ? action.payload.assumableAMIDs
        : []
      if (assumableAMIDs && assumableAMIDs.length > 0) {
        assumedAMID = assumedAMID || assumableAMIDs[0].assetManagerId
      }
      return {
        ...state,
        fetching: false,
        username: action.payload.username,
        email: action.payload.email,
        assetManagerId: action.payload.assetManagerId,
        assumableAMIDs,
        assumedAMID,
        dateFormat: action.payload.dateFormat || state.dateFormat
      }
    case authTypes.LOGOUT_SUCCESS:
    case authTypes.AUTHENTICATION_FAILED:
      return {
        ...state,
        fetching: false,
        username: '',
        email: '',
        assetManagerId: '',
        assumableAMIDs: [],
        assumedAMID: ''
      }
    case authTypes.TOGGLE_DARK:
      return { ...state, darkProfile: !state.darkProfile }
    case authTypes.ASSUME_AMID:
      return { ...state, assumedAMID: `${action.payload.assumedAMID}` }

    /* We probably will never have a standalone dateFormat reducer - do it from the token */
    // case authTypes.CHANGE_DATE_FORMAT:
    //   return { ...state, dateFormat: action.payload.dateFormat }

    default:
      return state
  }
}

import { History, LocationDescriptorObject } from 'history'

import * as actionTypes from './types'
import { dateFormats } from 'reducers/profile'

export interface IAssumableAMIDs {
  assetManagerId: number
  relationshipStatus: string
  relationshipType: string
  name?: string
}

export const requestLogin = (payload: {
  username: string
  password: string
  history: History
  nextPath: LocationDescriptorObject
}) => ({
  type: actionTypes.REQUEST_LOGIN,
  payload: {
    username: payload.username,
    password: payload.password,
    history: payload.history,
    nextPath: payload.nextPath
  }
})

export const loginSuccess = ({
  username,
  email,
  assetManagerId,
  dateFormat
}: {
  username: string
  email: string
  assetManagerId: string
  dateFormat?: dateFormats
}) => ({
  type: actionTypes.LOGIN_SUCCESS,
  payload: { username, email, assetManagerId, dateFormat }
})

export const loginFailed = (error: string) => ({
  type: actionTypes.LOGIN_FAILED,
  payload: { error }
})

export const requestLogout = ({ history }: { history: History }) => ({
  type: actionTypes.REQUEST_LOGOUT,
  payload: { history }
})

export const logoutSuccess = () => ({
  type: actionTypes.LOGOUT_SUCCESS,
  payload: {}
})

export const requestAuth = () => ({
  type: actionTypes.REQUEST_AUTHENTICATION,
  payload: {}
})

export const authSuccess = ({
  username,
  email,
  assetManagerId,
  assumableAMIDs,
  dateFormat
}: {
  username: string
  email: string
  assetManagerId: string | number
  assumableAMIDs: IAssumableAMIDs[]
  dateFormat?: dateFormats
}) => ({
  type: actionTypes.AUTHENTICATION_SUCCESS,
  payload: {
    username,
    email,
    assetManagerId,
    assumableAMIDs,
    dateFormat
  }
})

export const authFailed = () => ({
  type: actionTypes.AUTHENTICATION_FAILED,
  payload: {}
})

export const toggleDarkProfile = () => ({
  type: actionTypes.TOGGLE_DARK,
  payload: {}
})

export const assumeAMID = ({ assumedAMID }: { assumedAMID: number }) => ({
  type: actionTypes.ASSUME_AMID,
  payload: { assumedAMID }
})

/* Don't use this for now, we will probably set this in Cognito token, and store will be updated after token/session refresh */

// export const selectDateFormat = (dateFormat: 'dd-mm-yyyy' | 'yyyy-mm-dd') => (
//   {
//     type: actionTypes.CHANGE_DATE_FORMAT,
//     payload: { dateFormat }
//   }
// )

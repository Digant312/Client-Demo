import { createStore } from 'redux'

import reducer, { IState } from 'reducers'
import { IBook } from 'reducers/bookSelector'

const store = createStore(reducer)
const emptyState = store.getState()

// top-level state
export const appSelector = (state: IState) => state.app || emptyState.app
export const dataSelector = (state: IState) => state.data || emptyState.data

// state.app
export const publicStateSelector = (state: IState) =>
  appSelector(state).publicState || appSelector(emptyState).publicState
export const protectedStateSelector = (state: IState) =>
  appSelector(state).protectedState || appSelector(emptyState).protectedState

// state.app.publicState
export const sessionSelector = (state: IState) =>
  publicStateSelector(state).session || publicStateSelector(emptyState).session
export const signupSelector = (state: IState) =>
  publicStateSelector(state).signup || publicStateSelector(emptyState).signup
export const verifySelector = (state: IState) =>
  publicStateSelector(state).verify || publicStateSelector(emptyState).verify
export const newCompanySelector = (state: IState) =>
  publicStateSelector(state).newCompany ||
  publicStateSelector(emptyState).newCompany
export const joinCompanySelector = (state: IState) =>
  publicStateSelector(state).joinCompany ||
  publicStateSelector(emptyState).joinCompany
export const forgotPasswordSelector = (state: IState) =>
  publicStateSelector(state).forgotPassword ||
  publicStateSelector(emptyState).forgotPassword
export const resetPasswordSelector = (state: IState) =>
  publicStateSelector(state).resetPassword ||
  publicStateSelector(emptyState).resetPassword

// state.app.protectedState
export const bookSelectorSelector = (state: IState) =>
  protectedStateSelector(state).bookSelector ||
  protectedStateSelector(emptyState).bookSelector
export const profileSelector = (state: IState) =>
  protectedStateSelector(state).profile ||
  protectedStateSelector(emptyState).profile

export const isAdminOfAssumedAMID = (state: IState) => {
  const { assumedAMID, assumableAMIDs } = profileSelector(state)
  return (
    assumableAMIDs
      .filter(amid => amid.assetManagerId === parseInt(assumedAMID))
      .filter(amid => amid.relationshipStatus === 'Active')
      .filter(amid => amid.relationshipType === 'Administrator').length > 0
  )
}

export const assumedAMIDName = (state: IState) => {
  const { assumedAMID, assumableAMIDs } = profileSelector(state)
  const assumedAMIDInfo = assumableAMIDs.find(
    amid => amid.assetManagerId === parseInt(assumedAMID)
  )
  return assumedAMIDInfo && assumedAMIDInfo.name
}

// state.data
export const transactionsSelector = (state: IState) =>
  dataSelector(state).transactions
export const transactionHistorySelector = (state: IState) =>
  dataSelector(state).transactionHistory
export const transactionHistoryGridSelector = (state: IState) =>
  transactionHistorySelector(state).transactionHistoryGrid
export const transactionHistoryExpandedRowSelector = (state: IState) =>
  transactionHistorySelector(state).transactionHistoryExpandedRow

export const transactionFormSelector = (state: IState) =>
  dataSelector(state).transactionForm
export const transactionFormTransactionSelector = (state: IState) =>
  transactionFormSelector(state).transactionFormTransaction
export const transactionFormAssetSelector = (state: IState) =>
  transactionFormSelector(state).transactionFormAsset
export const transactionFormActionSelector = (state: IState) =>
  transactionFormSelector(state).transactionFormAction
export const transactionFormDeliverableSelector = (state: IState) =>
  transactionFormSelector(state).transactionDeliverableStatus

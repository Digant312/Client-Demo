import { createStore } from 'redux'
import rootReducer from 'reducers'

import * as selectors from './'

describe('selectors', () => {
  let state
  beforeAll(() => {
    const store = createStore(rootReducer)
    state = store.getState()
  })

  describe('top level selectors', () => {
    it('should select app state slice', () => {
      const expectedResult = state.app
      expect(selectors.appSelector(state)).toEqual(expectedResult)
    })

    it('should select data state slice', () => {
      const expectedResult = state.data
      expect(selectors.dataSelector(state)).toEqual(expectedResult)
    })
  })

  describe('app selectors', () => {
    it('should select publicState slice', () => {
      const expectedResult = state.app.publicState
      expect(selectors.publicStateSelector(state)).toEqual(expectedResult)
    })
  })

  describe('publicState selectors', () => {
    it('should select session state', () => {
      const expectedResult = state.app.publicState.session
      expect(selectors.sessionSelector(state)).toEqual(expectedResult)
    })

    it('should select signup state', () => {
      const expectedResult = state.app.publicState.signup
      expect(selectors.signupSelector(state)).toEqual(expectedResult)
    })

    it('should select verify state', () => {
      const expectedResult = state.app.publicState.verify
      expect(selectors.verifySelector(state)).toEqual(expectedResult)
    })

    it('should select newCompany state', () => {
      const expectedResult = state.app.publicState.newCompany
      expect(selectors.newCompanySelector(state)).toEqual(expectedResult)
    })

    it('should select joinCompany state', () => {
      const expectedResult = state.app.publicState.joinCompany
      expect(selectors.joinCompanySelector(state)).toEqual(expectedResult)
    })

    it('should select forgotPassword state', () => {
      const expectedResult = state.app.publicState.forgotPassword
      expect(selectors.forgotPasswordSelector(state)).toEqual(expectedResult)
    })

    it('should select resetPassword state', () => {
      const expectedResult = state.app.publicState.resetPassword
      expect(selectors.resetPasswordSelector(state)).toEqual(expectedResult)
    })

    it('should select profile state', () => {
      const expectedResult = state.app.protectedState.profile
      expect(selectors.profileSelector(state)).toEqual(expectedResult)
    })

    it('should select whether user is an admin of the assumedAMID', () => {
      const expectedResult = false
      expect(selectors.isAdminOfAssumedAMID(state)).toEqual(expectedResult)
      const initialState = {
        ...state,
        app: {
          ...state.app,
          protectedState: {
            ...state.app.protectedState,
            profile: {
              ...state.app.protectedState.profile,
              assumableAMIDs: [
                {
                  assetManagerId: 88,
                  relationshipStatus: 'Active',
                  relationshipType: 'Administrator'
                }
              ],
              assumedAMID: 88
            }
          }
        }
      }
      expect(selectors.isAdminOfAssumedAMID(initialState)).toEqual(true)
    })

    it('should select current assumedAMIDs name', () => {
      const expectedResult = 'Test Company'
      const initialState = {
        ...state,
        app: {
          ...state.app,
          protectedState: {
            ...state.app.protectedState,
            profile: {
              ...state.app.protectedState.profile,
              assumedAMID: 88,
              assumableAMIDs: [
                {
                  assetManagerId: 88,
                  name: 'Test Company'
                }
              ]
            }
          }
        }
      }
      expect(selectors.assumedAMIDName(initialState)).toEqual(expectedResult)
    })
  })

  describe('data selectors', () => {
    it('should select transactions', () => {
      const expectedResult = state.data.transactions
      expect(selectors.transactionsSelector(state)).toEqual(expectedResult)
    })

    it('should select transactionHistory', () => {
      const expectedResult = state.data.transactionHistory
      expect(selectors.transactionHistorySelector(state)).toEqual(
        expectedResult
      )
    })

    it('should select transactionForm', () => {
      const expectedResult = state.data.transactionForm
      expect(selectors.transactionFormSelector(state)).toEqual(expectedResult)
    })

    it('should select transactionFormTransaction', () => {
      const expectedResult =
        state.data.transactionForm.transactionFormTransaction
      expect(selectors.transactionFormTransactionSelector(state)).toEqual(
        expectedResult
      )
    })

    it('should select transactionFormDeliverableStatus', () => {
      const expectedResult =
        state.data.transactionForm.transactionDeliverableStatus
      expect(selectors.transactionFormDeliverableSelector(state)).toEqual(
        expectedResult
      )
    })
  })
})

import { createStore } from 'redux'

import reducer from 'reducers'
import * as utils from './'
import * as selectors from 'selectors'

describe('redux store subscribe functions', () => {
  let initialState
  beforeAll(() => {
    initialState = createStore(reducer).getState()
  })
  describe('loadState', () => {

    it('returns initialState if error thrown', () => {
      localStorage.getItem.mockImplementation(() => {
        throw new Error('error')
      })
      expect(utils.loadState()).toEqual(initialState)
    })

    it('returns argomiAuthState from localStorage', () => {
      localStorage.getItem.mockImplementation(() => true)
      const expectedResult = { authenticated: true, authenticating: false, sessionValid: true, error: '' }
      expect(selectors.sessionSelector(utils.loadState())).toEqual(expectedResult)
    })

    it('leaves other state untouched', () => {
      const expectedSignup = selectors.signupSelector(initialState)
      expect(selectors.signupSelector(utils.loadState())).toEqual(expectedSignup)
    })
  })

  describe('saveAuthenticatedState', () => {
    it("calls localStorage.setItem('argomiAuthState')", () => {
      utils.saveAuthenticatedState(false)
      expect(localStorage.setItem).toHaveBeenCalledWith('argomiAuthState', JSON.stringify(false))
    })
  })
})
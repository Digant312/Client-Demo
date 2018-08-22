import React from 'react'
import { IntlProvider } from 'react-intl-redux'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { shallow } from 'enzyme'

import { PartyDropdown } from './'

const mockFuzzyHit = {
  displayName: 'testDisplayName',
  description: 'testDescription',
  legalName: 'testLegalName',
  partyId: 'testPartyId',
  assetManagerId: '88'
}

const mockAPI = {
  Parties: {
    fuzzySearch: jest.fn(() =>
      Promise.resolve({
        hits: [mockFuzzyHit]
      })
    )
  }
}

const mockProps = {
  api: mockAPI,
  assumedAMId: '88',
  meta: { active: false } as any,
  input: { value: 'initialValue' } as any
}

describe('PartyDropdown component', () => {
  let shallowComp
  beforeEach(() => {
    shallowComp = shallow(<PartyDropdown {...mockProps} />)
    shallowComp.instance().mounted = true
  })
  describe('handleSearchChange', () => {
    it('calls the API and sets state', async () => {
      shallowComp.instance().handleSearchChange('test')
      await expect(mockAPI.Parties.fuzzySearch).toHaveBeenCalledWith({
        AMId: 88,
        query: { query: 'test' }
      })
      const expectedOption = expect.objectContaining({
        value: mockFuzzyHit.partyId,
        text:
          mockFuzzyHit.displayName ||
          mockFuzzyHit.description ||
          mockFuzzyHit.partyId
      })
      const expectedOptions = expect.arrayContaining([expectedOption])
      expect(shallowComp.state()).toEqual(
        expect.objectContaining({ options: expectedOptions })
      )
    })
  })

  describe('componentWillReceiveProps', () => {
    it('calls API and sets state', async () => {
      shallowComp.setProps({ input: { value: 'newValue' } })
      await expect(mockAPI.Parties.fuzzySearch).toHaveBeenCalledWith({
        AMId: 88,
        query: { query: 'newValue', filter: 'partyId', fuzzy: false }
      })
      const expectedOption = expect.objectContaining({
        key: `${mockFuzzyHit.assetManagerId}.${mockFuzzyHit.partyId}`,
        text:
          mockFuzzyHit.displayName ||
          mockFuzzyHit.description ||
          mockFuzzyHit.partyId,
        value: mockFuzzyHit.partyId
      })
      const expectedOptions = expect.arrayContaining([expectedOption])
      expect(shallowComp.state()).toEqual(
        expect.objectContaining({ options: expectedOptions })
      )
    })
  })
})

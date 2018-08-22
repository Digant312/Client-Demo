import React from 'react'
import { IntlProvider } from 'react-intl-redux'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { shallow } from 'enzyme'

import { AssetDropdown } from './'

const mockAPI = {
  Assets: {
    fuzzySearch: jest.fn(() =>
      Promise.resolve({
        hits: [
          {
            assetManagerId: 88,
            assetId: 'testAssetId',
            displayName: 'testDisplayName',
            description: 'testDescription',
            'references.referencePrimary': 'testReference'
          }
        ]
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

describe('AssetDropdown component', () => {
  let shallowComp
  beforeEach(() => {
    shallowComp = shallow(<AssetDropdown {...mockProps} />)
    shallowComp.instance().mounted = true
  })
  describe('handleSearchChange', () => {
    it('calls the API and sets state', async () => {
      shallowComp.instance().handleSearchChange('test')
      await expect(mockAPI.Assets.fuzzySearch).toHaveBeenCalledWith({
        AMId: 88,
        query: { query: 'test' }
      })
      const expectedOption = expect.objectContaining({
        value: 'testAssetId',
        text: 'testReference'
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
      await expect(mockAPI.Assets.fuzzySearch).toHaveBeenCalledWith({
        AMId: 88,
        query: { query: 'newValue', filter: 'assetId', fuzzy: false }
      })
      const expectedOption = expect.objectContaining({
        key: '88.testAssetId',
        text: 'testReference',
        value: 'testAssetId'
      })
      const expectedOptions = expect.arrayContaining([expectedOption])
      expect(shallowComp.state()).toEqual(
        expect.objectContaining({ options: expectedOptions })
      )
    })
  })
})

import React from 'react'
import { Field } from 'redux-form'
import { api, IFuzzySearchResult, IFuzzyHit } from '@amaas/amaas-core-sdk-js'

import Dropdown from 'containers/Shared/Dropdown'
import GridSearcher from 'components/Shared/GridSearcher'
import CurrencyDropdown from 'containers/Shared/CurrencyDropdown'
import CountryDropdown from 'components/Shared/CountryDropdown'

interface IAssetGridSearcherProps {
  queryFilter?: object
  assumedAMID: string
  getAssets: Function
}

const CountryComp = (
  <Field name="countryIds" component={CountryDropdown} compact={false} />
)
const CurrencyComp = <Field name="currencies" component={CurrencyDropdown} />

const assetSearchConfig = [
  { name: 'Country', component: CountryComp },
  { name: 'Currency', component: CurrencyComp }
]

const fieldsSearch = [
  'countryCodes',
  'fungible',
  'assetIssuerId',
  'countryId',
  'assetManagerId',
  'assetType',
  'venueId',
  'description',
  'major',
  'issueDate',
  'currency',
  'assetStatus',
  'expiryDate',
  'maturityDate',
  'rollPrice',
  'displayName',
  'assetClass',
  'assetId',
  'references',
  'underlying'
]

interface IHandleSearchFields {
  assetIds: string[]
  countryIds: string
  currencies: string
}

// TODO: ElasticSearch returns a limited set of results. Since we will be passing returned assetIds to the normal search,
// consider making the pageSize the max number of assetIds we can pass to the normal search, so we can get all the
// assetIds that we need in one go.

const AssetGridSearcher = (props: IAssetGridSearcherProps) => {
  const eSearchFunction = (value: string) => {
    let query = {
      query: value,
      assetManagerId: [0, 10],
      pageSize: 100,
      threshold: 70,
      ...props.queryFilter
    }
    return api.Assets.fuzzySearch({ AMId: parseInt(props.assumedAMID), query })
  }
  const handleSearch = (data: IHandleSearchFields) => {
    const query: IHandleSearchFields & {
      [queryParams: string]: string | string[]
    } = { ...data, fields: fieldsSearch }
    props.getAssets(query)
  }
  return props.assumedAMID ? (
    <GridSearcher
      fields={assetSearchConfig}
      fuzzySearchId="assetId"
      searchId="assetIds"
      eSearchFunction={eSearchFunction}
      handleSearch={handleSearch}
    />
  ) : (
    <span>Loading...</span>
  )
}

export default AssetGridSearcher

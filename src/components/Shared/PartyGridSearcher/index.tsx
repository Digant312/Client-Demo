import React from 'react'
import { Field } from 'redux-form'
import { api, IFuzzySearchResult, IFuzzyHit } from '@amaas/amaas-core-sdk-js'

import Dropdown from 'containers/Shared/Dropdown'
import GridSearcher from 'components/Shared/GridSearcher'

interface IPartyGridSearcherProps {
  queryFilter?: object
  assumedAMID: string
  getParties: Function
}

const fieldsSearch = [
  'assetManagerId',
  'partyId',
  'baseCurrency',
  'contactNumber',
  'displayName',
  'legalName',
  'url',
  'title',
  'givenNames',
  'surname',
  'dateOfBirth'
]

interface IHandleSearchFields {
  partyIds: string[]
}

const PartyGridSeacher = (props: IPartyGridSearcherProps) => {
  const eSearchFunction = (value: string) => {
    let query = {
      query: value,
      assetManagerId: [0, 10],
      pageSize: 100,
      threshold: 70,
      ...props.queryFilter
    }
    return api.Parties.fuzzySearch({ AMId: parseInt(props.assumedAMID), query })
  }
  const handleSearch = (data: IHandleSearchFields) => {
    const query: IHandleSearchFields & {
      [queryParams: string]: string | string[]
    } = { ...data, fields: fieldsSearch }
    props.getParties(query)
  }
  return props.assumedAMID ? (
    <GridSearcher
      fields={[]}
      fuzzySearchId="partyId"
      searchId="partyIds"
      eSearchFunction={eSearchFunction}
      handleSearch={handleSearch}
    />
  ) : (
    <span>Loading...</span>
  )
}

import React from 'react'

import LinkListBase from 'containers/Shared/FormLinkList'
import { ILinkListBaseProps, IDropdownOptions } from 'components/Shared/FormLinkList'

interface IPartyLinkListState {
  fetchingOptions: boolean
  options: IDropdownOptions[]
}

export default (props: ILinkListBaseProps) => {
  return <LinkListBase
    {...props}
    type='parties'
    accessor='linkedPartyId'
  />
}
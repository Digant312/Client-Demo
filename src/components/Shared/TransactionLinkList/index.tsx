import React from 'react'

import LinkListBase from 'containers/Shared/FormLinkList'
import { ILinkListBaseProps, IDropdownOptions } from 'components/Shared/FormLinkList'

import dummyTrans from '../../../../data/transactions'

interface ITransactionLinkListState {
  fetchingOptions: boolean
  options: IDropdownOptions[]
}

export default (props: ILinkListBaseProps) => {
  return <LinkListBase
    {...props}
    type='transactions'
    accessor='linkedTransactionId'
  />
}
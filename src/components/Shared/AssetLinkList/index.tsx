import React from 'react'
import { api } from '@amaas/amaas-core-sdk-js'

import LinkListBase from 'containers/Shared/FormLinkList'
import {
  ILinkListBaseProps,
  IDropdownOptions
} from 'components/Shared/FormLinkList'


export default (props: ILinkListBaseProps) => {
  return <LinkListBase
    {...props}
    type='assets'
    accessor='linkedAssetId'
  />
}
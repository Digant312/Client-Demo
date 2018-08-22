import React from 'react'
import { DropdownItemProps } from 'semantic-ui-react'

import Input from 'containers/Shared/CompactInput'
import TextArea from 'containers/Shared/CompactTextArea'
import Dropdown from 'containers/Shared/Dropdown'
import CurrencyDropdown from 'containers/Shared/CurrencyDropdown'
import ChildFields from 'containers/Shared/FormChildFields'
import LinkFields from 'components/Shared/FormLinkFields'
import FormAddressGroup from 'containers/Shared/FormAddressGroup'
import { required } from 'utils/form'
import { formatDate } from 'utils/form'
import messages from 'utils/form/PartyConfig/messages'

const defaultFormatDate = formatDate('DD-MM-YYYY')

// This should become shared
export interface IConfigInterface {
  name: string
  component: React.ComponentType<any>
  type?: string
  options?: DropdownItemProps[]
  validate?: any[]
  normalize?: Function
  valueKey?: string
  normal?: boolean
  label: { id: string; defaultMessage: string }
  fieldArray?: boolean
}

export const commonConfig = [
  {
    name: 'partyId',
    label: messages.partyId,
    component: Input,
    validate: [required],
    normal: true
  },
  {
    name: 'baseCurrency',
    label: messages.baseCurrency,
    component: CurrencyDropdown,
    normal: true
  },
  { name: 'description', label: messages.description, component: TextArea },
  {
    name: 'addresses',
    label: messages.addresses,
    component: FormAddressGroup,
    type: 'Address',
    valueKey: 'addressValue',
    fieldArray: true
  },
  {
    name: 'emails',
    label: messages.emails,
    component: ChildFields,
    type: 'Email',
    valueKey: 'email',
    fieldArray: true
  },
  {
    name: 'references',
    label: messages.references,
    component: ChildFields,
    type: 'Reference',
    valueKey: 'referenceValue',
    fieldArray: true
  },
  {
    name: 'comments',
    label: messages.comments,
    component: ChildFields,
    type: 'Comment',
    valueKey: 'commentValue',
    fieldArray: true
  },
  {
    name: 'links',
    label: messages.links,
    component: LinkFields,
    type: 'parties',
    valueKey: 'linkValue',
    fieldArray: true
  },
  {
    name: 'legalName',
    label: messages.legalName,
    component: Input,
    normal: true
  },
  {
    name: 'displayName',
    label: messages.displayName,
    component: Input,
    normal: true
  },
  { name: 'url', label: messages.url, component: Input, normal: true }
]

export const individualConfig = [
  ...commonConfig,
  {
    name: 'givenNames',
    label: messages.givenNames,
    component: Input,
    validate: [required],
    normal: true
  },
  {
    name: 'surname',
    label: messages.surname,
    component: Input,
    validate: [required],
    normal: true
  },
  {
    name: 'dateOfBirth',
    label: messages.dateOfBirth,
    component: Input,
    normalize: defaultFormatDate,
    normal: true
  },
  { name: 'title', label: messages.title, component: Input, normal: true },
  {
    name: 'department',
    label: messages.department,
    component: Input,
    normal: true
  },
  { name: 'role', label: messages.role, component: Input, normal: true },
  {
    name: 'contactNumber',
    label: messages.contactNumber,
    component: Input,
    normal: true
  }
]

const licenseTypes = [
  { text: 'RFMC', value: 'RFMC' },
  { text: 'LFMC', value: 'LFMC' },
  { text: 'Type 9', value: 'Type 9' },
  { text: 'Type 5', value: 'Type 5' },
  { text: 'Type 4', value: 'Type 4' }
]
const aumOptions = [
  { text: '< $2m', value: '< $2m' },
  { text: '$2m - $5m', value: '$2m - $5m' },
  { text: '$5m - $20m', value: '$5m - $20m' },
  { text: '$20m - $50m', value: '$20m - $50m' },
  { text: '$50m - $100m', value: '$50m - $100m' },
  { text: '$100m - $250m', value: '$100m - $250m' },
  { text: '$250m - $500m', value: '$250m - $500m' },
  { text: '$500m - $1bn', value: '$500m - $1bn' },
  { text: '> $1bn', value: '> $1bn' }
]

export const companyConfig = [
  ...commonConfig,
  {
    name: 'licenseNumber',
    label: messages.licenseNumber,
    component: Input,
    normal: true
  },
  {
    name: 'licenseType',
    label: messages.licenseType,
    component: Dropdown,
    options: licenseTypes,
    normal: true
  },
  {
    name: 'assetsUnderManagement',
    label: messages.assetsUnderManagement,
    component: Dropdown,
    options: aumOptions,
    normal: true
  }, // set this to a dropdown with the specced options
  {
    name: 'registrationNumber',
    label: messages.registrationNumber,
    component: Input,
    normal: true
  },
  {
    name: 'yearOfIncorporation',
    label: messages.yearOfIncorporation,
    component: Input,
    normal: true
  },
  {
    name: 'contactNumber',
    label: messages.contactNumber,
    component: Input,
    normal: true
  },
  {
    name: 'phoneNumbers',
    label: messages.phoneNumbers,
    component: ChildFields,
    type: 'PhoneNumber',
    valueKey: 'phoneNumber',
    fieldArray: true
  }
]

export const brokerConfig = [...companyConfig]

export const fundConfig = [...companyConfig]

export const exchangeConfig = [...companyConfig]

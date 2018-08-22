import flow from 'lodash/flow'

import Input from 'containers/Shared/CompactInput'
import DateInput from 'containers/Shared/DateInput'
import Dropdown from 'containers/Shared/Dropdown'
import CountryDropdown from 'components/Shared/CountryDropdown'
import CurrencyDropdown from 'containers/Shared/CurrencyDropdown'
import TextArea from 'containers/Shared/CompactTextArea'
import FormAddressGroup from 'containers/Shared/FormAddressGroup'
import ChildFields from 'containers/Shared/FormChildFields'
import LinkFields from 'components/Shared/FormLinkFields'
import { ICompanyInformationOwnProps } from 'components/Protected/Account/Company/CompanyInformation'
import {
  required,
  formatDate,
  hasSpace,
  makeUpperCase,
  trimSpace,
  trimSlash
} from 'utils/form'
import { IConfigInterface } from 'components/Shared/FormBuilder'
import messages from './messages'

const partyIdNoSpace = hasSpace('Party ID')
const partyIdNormaliser = flow([trimSpace, trimSlash, makeUpperCase])

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

const licenseTypes = [
  { text: 'RFMC', value: 'RFMC' },
  { text: 'LFMC', value: 'LFMC' },
  { text: 'Type 9', value: 'Type 9' },
  { text: 'Type 5', value: 'Type 5' },
  { text: 'Type 4', value: 'Type 4' }
]

export const commonConfig: IConfigInterface[] = [
  {
    name: 'partyId',
    label: messages.partyId,
    component: Input,
    validate: [required, partyIdNoSpace],
    normal: true,
    normalize: partyIdNormaliser,
    autoFocus: true
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
  { name: 'url', label: messages.url, component: Input, normal: true },
  {
    name: 'phoneNumbers',
    label: messages.phoneNumbers,
    extraLabel: messages.primaryPhoneNumber,
    component: ChildFields,
    type: 'Phone Number',
    valueKey: 'phoneNumber',
    fieldArray: true
  }
]

export const organisationConfig: IConfigInterface[] = [...commonConfig]

export const companyConfig: IConfigInterface[] = [
  ...organisationConfig,
  {
    name: 'yearOfIncorporation',
    label: messages.yearOfIncorporation,
    component: Input,
    normal: true
  }
]

export const AssetManagerConfig: IConfigInterface[] = [
  ...companyConfig,
  {
    name: 'assetsUnderManagement',
    label: messages.assetsUnderManagement,
    component: Dropdown,
    options: aumOptions
  },
  {
    name: 'licenseType',
    label: messages.licenseType,
    component: Dropdown,
    options: licenseTypes
  },
  {
    name: 'licenseNumber',
    label: messages.licenseNumber,
    component: Input,
    normal: true
  },
  {
    name: 'registrationNumber',
    label: messages.registrationNumber,
    component: Input,
    normal: true
  }
]

export const individualConfig: IConfigInterface[] = [
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
    component: DateInput
  },
  { name: 'title', label: messages.title, component: Input, normal: true },
  {
    name: 'department',
    label: messages.department,
    component: Input,
    normal: true
  },
  { name: 'role', label: messages.role, component: Input, normal: true }
]

export const brokerConfig: IConfigInterface[] = [...companyConfig]

export const fundConfig: IConfigInterface[] = [...companyConfig]

export const exchangeConfig: IConfigInterface[] = [...companyConfig]

export const governmentAgencyConfig: IConfigInterface[] = [
  ...organisationConfig
]

export const subFundConfig: IConfigInterface[] = [...commonConfig]

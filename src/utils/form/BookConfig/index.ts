import flow from 'lodash/flow'

import messages from './messages'
import Dropdown from 'containers/Shared/Dropdown'
import Input from 'containers/Shared/CompactInput'
import CurrencyDropdown from 'containers/Shared/CurrencyDropdown'
import PartyDropdown from 'containers/Shared/PartyDropdown'
import TimezoneDropdown from 'components/Shared/TimezoneDropdown'
import {
  required,
  timezoneDropdownRequired,
  hasSpace,
  makeUpperCase,
  trimSpace,
  trimSlash
} from 'utils/form'
import RadioCheckBox from 'components/Shared/RadioCheckBox'

const bookIdNoSpace = hasSpace('Book Name')
const bookIdNormaliser = flow([trimSpace, trimSlash, makeUpperCase])

const BookTypeOptions = [
  { key: 'Counterparty', text: 'Counterparty', value: 'Counterparty' },
  { key: 'Management', text: 'Management', value: 'Management' },
  { key: 'Trading', text: 'Trading', value: 'Trading' },
  { key: 'Wash', text: 'Wash', value: 'Wash' }
]

const CloseTimeOptions = [
  { key: '23:30', text: '23:30', value: '23:30:00' },
  { key: '23:00', text: '23:00', value: '23:00:00' },
  { key: '22:30', text: '22:30', value: '22:30:00' },
  { key: '22:00', text: '22:00', value: '22:00:00' },
  { key: '21:30', text: '21:30', value: '21:30:00' },
  { key: '21:00', text: '21:00', value: '21:00:00' },
  { key: '20:30', text: '20:30', value: '20:30:00' },
  { key: '20:00', text: '20:00', value: '20:00:00' },
  { key: '19:30', text: '19:30', value: '19:30:00' },
  { key: '19:00', text: '19:00', value: '19:00:00' },
  { key: '18:30', text: '18:30', value: '18:30:00' },
  { key: '18:00', text: '18:00', value: '18:00:00' },
  { key: '17:30', text: '17:30', value: '17:30:00' },
  { key: '17:00', text: '17:00', value: '17:00:00' },
  { key: '16:30', text: '16:30', value: '16:30:00' },
  { key: '16:00', text: '16:00', value: '16:00:00' },
  { key: '15:30', text: '15:30', value: '15:30:00' },
  { key: '15:00', text: '15:00', value: '15:00:00' },
  { key: '14:30', text: '14:30', value: '14:30:00' },
  { key: '14:00', text: '14:00', value: '14:00:00' },
  { key: '13:30', text: '13:30', value: '13:30:00' },
  { key: '13:00', text: '13:00', value: '13:00:00' },
  { key: '12:30', text: '12:30', value: '12:30:00' },
  { key: '12:00', text: '12:00', value: '12:00:00' },
  { key: '11:30', text: '11:30', value: '11:30:00' },
  { key: '11:00', text: '11:00', value: '11:00:00' },
  { key: '10:30', text: '10:30', value: '10:30:00' },
  { key: '10:00', text: '10:00', value: '10:00:00' },
  { key: '09:30', text: '09:30', value: '09:30:00' },
  { key: '09:00', text: '09:00', value: '09:00:00' },
  { key: '08:30', text: '08:30', value: '08:30:00' },
  { key: '08:00', text: '08:00', value: '08:00:00' },
  { key: '07:30', text: '07:30', value: '07:30:00' },
  { key: '07:00', text: '07:00', value: '07:00:00' },
  { key: '06:30', text: '06:30', value: '06:30:00' },
  { key: '06:00', text: '06:00', value: '06:00:00' },
  { key: '05:30', text: '05:30', value: '05:30:00' },
  { key: '05:00', text: '05:00', value: '05:00:00' },
  { key: '04:30', text: '04:30', value: '04:30:00' },
  { key: '04:00', text: '04:00', value: '04:00:00' },
  { key: '03:30', text: '03:30', value: '03:30:00' },
  { key: '03:00', text: '03:00', value: '03:00:00' },
  { key: '02:30', text: '02:30', value: '02:30:00' },
  { key: '02:00', text: '02:00', value: '02:00:00' },
  { key: '01:30', text: '01:30', value: '01:30:00' },
  { key: '01:00', text: '01:00', value: '01:00:00' },
  { key: '00:30', text: '00:30', value: '00:30:00' },
  { key: '00:00', text: '00:00', value: '00:00:00' }
].reverse()

export default (owningPartyFilter?: {
  [queryKey: string]: string | string[]
}) => {
  return [
    {
      name: 'bookId',
      label: messages.bookId,
      component: Input,
      validate: [required, bookIdNoSpace],
      normalize: bookIdNormaliser,
      normal: true,
      autoFocus: true
    },
    {
      name: 'bookType',
      label: messages.bookType,
      component: Dropdown,
      options: BookTypeOptions,
      validate: [required]
    },
    {
      name: 'baseCurrency',
      label: messages.baseCurrency,
      component: CurrencyDropdown
    },
    {
      name: 'timezone',
      label: messages.timezone,
      component: TimezoneDropdown,
      validate: [timezoneDropdownRequired]
    },
    {
      name: 'description',
      label: messages.description,
      component: Input,
      normal: true
    },
    {
      name: 'partyId',
      label: messages.owningParty,
      component: PartyDropdown,
      queryFilter: owningPartyFilter,
      validate: [required]
    },
    {
      name: 'ownerId',
      label: messages.ownerId,
      component: PartyDropdown,
      queryFilter: { partyType: 'Individual', partyStatus: 'Active' }
    },
    {
      name: 'businessUnit',
      label: messages.businessUnit,
      component: Input,
      normal: true
    },
    {
      name: 'closeTime',
      label: messages.closeTime,
      component: Dropdown,
      options: CloseTimeOptions,
      validate: [required]
    },
    {
      name: 'reference',
      label: messages.reference,
      component: Input,
      normal: true
    }
  ]
}

export const bookPermissionConfig: any = [
  {
    name: 'permissionRead',
    label: messages.read,
    component: RadioCheckBox,
    type: 'checkbox'
  },
  {
    name: 'permissionWrite',
    label: messages.write,
    component: RadioCheckBox,
    type: 'checkbox'
  },
  {
    name: 'permissionNone',
    label: messages.none,
    component: RadioCheckBox,
    type: 'checkbox'
  }
]

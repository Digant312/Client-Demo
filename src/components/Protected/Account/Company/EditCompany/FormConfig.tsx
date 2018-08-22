import Input from 'containers/Shared/CompactInput'
import CountryDropdown from 'components/Shared/CountryDropdown'
import { required } from 'utils/form'
import { IConfigInterface } from 'components/Shared/FormBuilder'
import fieldMessages from 'utils/form/PartyConfig/messages'
import { AssetManagerConfig } from 'utils/form/PartyConfig'

const extraFormFieldConfig: IConfigInterface[] = [
  {
    name: 'contactNumber',
    label: fieldMessages.contactNumber,
    component: Input,
    validate: [required],
    normal: true
  },
  {
    name: 'lineOne',
    label: fieldMessages.lineOne,
    component: Input,
    validate: [required],
    normal: true
  },
  {
    name: 'lineTwo',
    label: fieldMessages.lineTwo,
    component: Input,
    normal: true
  },
  {
    name: 'city',
    label: fieldMessages.city,
    component: Input,
    validate: [required],
    normal: true
  },
  {
    name: 'region',
    label: fieldMessages.region,
    component: Input,
    normal: true
  },
  {
    name: 'postalCode',
    label: fieldMessages.postalCode,
    component: Input,
    normal: true
  },
  {
    name: 'countryId',
    label: fieldMessages.countryId,
    component: CountryDropdown,
    validate: [required]
  }
]

const filteredConfig = AssetManagerConfig.filter(config => {
  const toFilter = [
    'comments',
    'links',
    'references',
    'addresses',
    'emails',
    'partyId',
    'baseCurrency',
    'description',
    'legalName',
    'url',
    'phoneNumbers'
  ]
  return toFilter.indexOf(config.name) === -1
})

export default filteredConfig.concat(extraFormFieldConfig)

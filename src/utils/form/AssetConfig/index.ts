import flow from 'lodash/flow'
import PartyDropdown from 'containers/Shared/PartyDropdown'
import AssetDropdown from 'containers/Shared/AssetDropdown'
import CheckBox from 'containers/Shared/CheckBox/'
import ChildFields from 'containers/Shared/FormChildFields'
import CountryDropdown from 'components/Shared/CountryDropdown'
import CurrencyDropdown from 'containers/Shared/CurrencyDropdown'
import Dropdown from 'containers/Shared/Dropdown'
import Input from 'containers/Shared/CompactInput/'
import DateInput from 'containers/Shared/DateInput'
import LinkFields from 'components/Shared/FormLinkFields'
import Textarea from 'containers/Shared/CompactTextArea/'

import { ICompanyInformationOwnProps } from 'components/Protected/Account/Company/CompanyInformation'
import {
  formatDate,
  makeUpperCase,
  required,
  trimSlash,
  trimSpace
} from 'utils/form'
import { IConfigInterface } from 'components/Shared/FormBuilder'
import messages from './messages'
import { assetUtils } from '@amaas/amaas-core-sdk-js'

const assetIdNormaliser = flow([trimSpace, trimSlash, makeUpperCase])

export const commonConfig: IConfigInterface[] = [
  {
    name: 'assetId',
    label: messages.assetId,
    component: Input,
    validate: [required],
    normal: true,
    normalize: assetIdNormaliser,
    autoFocus: true
  },
  {
    name: 'description',
    label: messages.description,
    component: Input,
    validate: [required],
    normal: true
  },
  {
    name: 'displayName',
    label: messages.displayName,
    component: Input,
    normal: true
  },
  {
    name: 'currency',
    label: messages.currency,
    component: CurrencyDropdown,
    validate: [required],
    normal: true
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
    type: 'assets',
    valueKey: 'linkedAssetId',
    fieldArray: true
  },
  {
    name: 'references',
    label: messages.references,
    component: ChildFields,
    type: 'Reference',
    valueKey: 'referenceValue',
    fieldArray: true
  }
]
export const equityConfig: IConfigInterface[] = [
  ...commonConfig,
  {
    name: 'assetIssuerId',
    label: messages.assetIssuerId,
    component: PartyDropdown,
    normal: true
  },
  {
    name: 'countryId',
    label: messages.countryId,
    component: CountryDropdown,
    validate: [required],
    normal: true
  },
  {
    name: 'venueId',
    label: messages.venueId,
    component: PartyDropdown,
    queryFilter: {
      partyType: ['Exchange']
    },
    normal: true
  },
  {
    name: 'shareClass',
    label: messages.shareClass,
    component: Input,
    validate: [required],
    normal: true
  }
]
export const fxConfig: IConfigInterface[] = [
  ...commonConfig,
  {
    name: 'major',
    label: messages.major,
    component: CheckBox,
    type: 'checkbox',
    normalize: (val: boolean) => !!val
  }
]
const futureSettlementTypes = [
  { text: 'Cash', value: 'Cash' },
  { text: 'Physical', value: 'Physical' }
]
export const futureConfig: IConfigInterface[] = [
  ...commonConfig,
  {
    name: 'issueDate',
    label: messages.issueDate,
    component: DateInput,
    validate: [required]
  },
  {
    name: 'settlementType',
    label: messages.settlementType,
    component: Dropdown,
    options: futureSettlementTypes,
    validate: [required]
  },
  {
    name: 'contractSize',
    label: messages.contractSize,
    component: Input,
    validate: [required],
    normal: true
  },
  {
    name: 'pointValue',
    label: messages.pointValue,
    component: Input,
    normal: true
  },
  {
    name: 'tickSize',
    label: messages.tickSize,
    component: Input,
    normal: true
  },
  {
    name: 'quoteUnit',
    label: messages.quoteUnit,
    component: Input,
    normal: true
  },
  {
    name: 'underlyingAssetId',
    label: messages.underlyingAssetId,
    component: AssetDropdown
  },
  {
    name: 'expiryDate',
    label: messages.expiryDate,
    component: DateInput
  }
]

export const genericAssetConfig: IConfigInterface[] = [
  ...commonConfig,
  {
    name: 'fungible',
    label: messages.fungible,
    component: CheckBox,
    type: 'checkbox',
    normalize: (val: boolean) => !!val
  }
]

const fundList = assetUtils.FUND_TYPES
let fundType: any[] = fundList.map(row => {
  return { text: row, value: row }
})

export const fundConfig: IConfigInterface[] = [
  ...commonConfig,
  {
    name: 'assetIssuerId',
    label: messages.assetIssuerId,
    component: PartyDropdown,
    normal: true
  },
  {
    name: 'countryId',
    label: messages.countryId,
    component: CountryDropdown,
    validate: [required],
    normal: true
  },
  {
    name: 'venueId',
    label: messages.venueId,
    component: PartyDropdown,
    queryFilter: {
      partyType: ['Exchange']
    },
    normal: true
  },
  {
    name: 'currency',
    label: messages.currency,
    component: CurrencyDropdown,
    validate: [required],
    normal: true
  },
  {
    name: 'rollPrice',
    label: messages.rollPrice,
    component: CheckBox,
    type: 'checkbox',
    normalize: (val: boolean) => !!val
  },
  {
    name: 'fundType',
    label: messages.fundType,
    component: Dropdown,
    options: fundType
  },
  {
    name: 'creationDate',
    label: messages.creationDate,
    component: DateInput
  },
  { name: 'nav', label: messages.nav, component: Input, normal: true },
  {
    name: 'expenseRatio',
    label: messages.expenseRatio,
    component: Input,
    normal: true
  },
  {
    name: 'netAssets',
    label: messages.netAssets,
    component: Input,
    normal: true
  }
]
export const etfConfig: IConfigInterface[] = [...fundConfig]

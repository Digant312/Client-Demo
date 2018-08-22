import { Action, combineReducers } from 'redux'
import { reducer as formReducer, FormReducer } from 'redux-form'
import { intlReducer, IntlState } from 'react-intl-redux'
import {
  assetManagers,
  assets,
  books,
  monitor,
  parties,
  transactions,
  relationships
} from '@amaas/amaas-core-sdk-js'

import sessionReducer, { ISessionState } from './session'
import signupReducer, { ISignupState } from './signup'
import verifyReducer, { IVerifyState } from './verify'
import newCompanyReducer, { INewCompanyState } from './newCompany'
import joinCompanyReducer, { IJoinCompanyState } from './joinCompany'
import forgotReducer, { IForgotState } from './forgot'
import resetReducer, { IResetPasswordState } from './reset'
import dataReducer, { IGenericDataState } from './data'
import profileReducer, { IProfileState } from './profile'
import bookSelectorReducer, { IBook } from './bookSelector'
import transactionHistoryReducer, {
  ITransactionHistoryState
} from 'reducers/data/transactionHistory'
import transactionFormReducer, {
  ITransactionFormState
} from 'reducers/data/transactionForm'

const assetsReducer = dataReducer('assets')
const booksReducer = dataReducer('books')
const bookPermissionsReducer = dataReducer('bookPermissions')
const domainsReducer = dataReducer('domains')
const monitorReducer = dataReducer('monitor')
const monitorActivitiesReducer = dataReducer('activities')
const partiesReducer = dataReducer('parties')
const positionsReducer = dataReducer('positions')
const relationshipsReducer = dataReducer('relationships')
const transactionsReducer = dataReducer('transactions')
// etc.

// The top-level data state slice, encompassing assets, books, monitor, activities, parties, transactions
const data = combineReducers({
  assets: assetsReducer,
  books: booksReducer,
  bookPermissions: bookPermissionsReducer,
  domains: domainsReducer,
  monitor: monitorReducer,
  activities: monitorActivitiesReducer,
  parties: partiesReducer,
  positions: positionsReducer,
  relationships: relationshipsReducer,
  transactions: transactionsReducer,
  transactionHistory: transactionHistoryReducer,
  transactionForm: transactionFormReducer
})

// Global state slice, encompassing auth and user details (username, email etc.)
const publicState = combineReducers({
  session: sessionReducer,
  signup: signupReducer,
  verify: verifyReducer,
  newCompany: newCompanyReducer,
  joinCompany: joinCompanyReducer,
  forgotPassword: forgotReducer,
  resetPassword: resetReducer
})

const protectedState = combineReducers({
  bookSelector: bookSelectorReducer,
  profile: profileReducer
})

const app = combineReducers({
  publicState,
  protectedState
})

// Root Reducer
export default combineReducers<IState>({
  app,
  data,
  form: formReducer,
  intl: intlReducer
})

// Types: State
export interface IState {
  app: IAppState
  data: IDataState
  form: FormReducer
  intl: IntlState
}

// State.global
interface IAppState {
  publicState: IPublicState
  protectedState: IProtectedState
}

// State.data
interface IDataState {
  assets: IGenericDataState<assets.AssetClassTypes>
  books: IGenericDataState<
    books.Book & { ownerName?: string; partyName?: string }
  >
  bookPermissions: IGenericDataState<books.BookPermission & { name?: string }>
  domains: IGenericDataState<assetManagers.Domain>
  monitor: IGenericDataState<monitor.Item>
  activities: IGenericDataState<monitor.Activity>
  parties: IGenericDataState<parties.PartiesClassType>
  positions: IGenericDataState<
    transactions.Position & {
      ISIN?: string
      ticker?: string
      displayName?: string
    }
  >
  relationships: IGenericDataState<relationships.Relationship>
  transactions: IGenericDataState<
    transactions.Transaction & {
      assetClass: string
      assetType: string
      ISIN?: string
      ticker?: string
      displayName?: string
    }
  >
  transactionHistory: ITransactionHistoryState
  transactionForm: ITransactionFormState
}

// state.global.publicState
interface IPublicState {
  session: ISessionState
  signup: ISignupState
  verify: IVerifyState
  newCompany: INewCompanyState
  joinCompany: IJoinCompanyState
  forgotPassword: IForgotState
  resetPassword: IResetPasswordState
}

interface IProtectedState {
  bookSelector: IBook[]
  profile: IProfileState
}

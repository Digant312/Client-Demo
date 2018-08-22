import { all } from 'redux-saga/effects'

import dataSaga from './data'
import transactionFormSaga from './data/transactionForm'
import transactionHistorySaga from './data/transactionHistory'
import apiSaga from './amaasApi'
import authSaga from './auth'
import intlSaga from './intl'

export function* rootSaga() {
  yield all([
    ...authSaga,
    ...apiSaga,
    ...intlSaga,
    ...dataSaga,
    ...transactionFormSaga,
    ...transactionHistorySaga
  ])
}

export default rootSaga

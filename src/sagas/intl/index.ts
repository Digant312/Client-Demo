import { call, put, takeLatest } from 'redux-saga/effects'
import { addLocaleData } from 'react-intl'
import { updateIntl } from 'react-intl-redux'

import { UPDATE_LOCALE } from 'actions/intl/types'

export const reactIntlLocaleData: any = {
  en: () => import(/* webpackChunkName: 'locale_en' */ 'react-intl/locale-data/en'),
  fr: () => import(/* webpackChunkName: 'locale_ja' */ 'react-intl/locale-data/fr')
  /* Keep this list up to date with all the locales that we wish to support */
}

export const fetchMessages = (locale: string) => {
  const url = `https://s3-ap-southeast-1.amazonaws.com/argomi-static-assets/intl/${locale}/${locale}.json`
  return fetch(url)
    .then(res => res.json())
}

export function* intlSaga(action: any) {
  try {
    const reg = new RegExp(/-/)
    const { locale } = action.payload
    const formattedLocale = reg.test(locale) ? locale.split('-')[0] : locale
    const localeData = yield call(reactIntlLocaleData[formattedLocale])
    yield call(addLocaleData, [...localeData])
    const messages = yield call(fetchMessages, locale)
    yield put(updateIntl({ locale, messages: messages[locale] }))
    console.log("SUCCESS")
  } catch(e) {
    console.error('FAILED')
  }
}

export default [
  takeLatest(UPDATE_LOCALE, intlSaga)
]
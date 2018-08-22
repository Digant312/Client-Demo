import { call, put } from 'redux-saga/effects'
import { addLocaleData } from 'react-intl'
import { updateIntl } from 'react-intl-redux'

import { UPDATE_LOCALE } from 'actions/intl/types'

import { reactIntlLocaleData, fetchMessages, intlSaga } from './'

describe('intl saga', () => {
  let gen
  beforeAll(() => {
    const action = {
      type: UPDATE_LOCALE,
      payload: { locale: 'fr' }
    }
    gen = intlSaga(action)
  })
  it('calls reactIntlLocaleData', () => {
    const called = gen.next().value
    expect(called).toEqual(call(reactIntlLocaleData.fr))
  })
  it('calls addLocaleData', () => {
    const called = gen.next(['en']).value
    expect(called).toEqual(call(addLocaleData, ['en'] as any))
  })
  it('calls fetchMessages', () => {
    const called = gen.next().value
    expect(called).toEqual(call(fetchMessages, 'fr'))
  })
  it('puts updateIntl to update the redux store with new locale and messages', () => {
    const putted = gen.next({ fr: 'messages' }).value
    expect(putted).toEqual(put(updateIntl({ locale: 'fr', messages: 'messages' })))
  })
})
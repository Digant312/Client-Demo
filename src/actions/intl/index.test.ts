import * as types from './types'
import * as actions from './'

describe('intl action creators', () => {
  it('creates an action to update the locale', () => {
    const expectedResult = {
      type: types.UPDATE_LOCALE,
      payload: { locale: 'fr' }
    }
    expect(actions.changeLanguage('fr')).toEqual(expectedResult)
  })
})
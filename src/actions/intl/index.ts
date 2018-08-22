import * as types from './types'

export const changeLanguage = (locale: string) => (
  {
    type: types.UPDATE_LOCALE,
    payload: { locale }
  }
)
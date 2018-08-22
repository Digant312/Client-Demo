import typeGenerator, { IDataTypes } from 'actions/data/actionTypeGenerators'
import { CLEAR_DATA } from 'actions/data/types'

export interface IGenericDataState<T = {}> {
  fetching: boolean
  error: string
  data: T[]
}

const initialState = {
  fetching: false,
  error: '',
  data: []
}

export default (dataType: IDataTypes) => (
  state: IGenericDataState = initialState,
  action: { type: string; payload?: { data?: any[]; error?: string } }
) => {
  let actionType = typeGenerator(dataType)
  switch (action.type) {
    case actionType.request:
      return { ...state, fetching: true, error: '' }
    case actionType.success:
      if (action.payload)
        return {
          ...state,
          fetching: false,
          data: action.payload.data,
          error: ''
        }
      return { ...state, fetching: false, error: 'Error' }
    case actionType.failed:
      if (action.payload)
        return { ...state, fetching: false, error: action.payload.error }
      return { ...state, fetching: false, error: 'Error' }
    case actionType.clearData:
      return { fetching: false, error: '', data: [] }
    default:
      return state
  }
}

import { connect } from 'react-redux'
import { FormProps } from 'redux-form'

import DatePicker from 'components/Protected/Portfolio/PositionsList/DatePicker'
import { fetchPositions } from 'actions/data'
import { IState } from 'reducers'
import { dateFormats } from 'reducers/profile'
import { dataSelector, profileSelector } from 'selectors'

const mapStateToProps = (state: IState) => ({
  dateFormat: profileSelector(state).dateFormat
})

const mapDispatchToProps = (dispatch: Function) => ({
  fetchPositions: (query?: { [queryKey: string]: string | string[] }) => {
    dispatch(fetchPositions(query))
  }
})

export default connect<
  { dateFormat: dateFormats },
  { fetchPositions: Function },
  FormProps<{}, {}, {}>
>(mapStateToProps, mapDispatchToProps)(DatePicker)

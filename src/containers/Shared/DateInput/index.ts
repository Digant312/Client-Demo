import { connect } from 'react-redux'
import { WrappedFieldProps } from 'redux-form'

import DateInput from 'components/Shared/DateInput'
import { IState } from 'reducers'
import { profileSelector } from 'selectors'

const mapStateToProps = (state: IState, ownProps: WrappedFieldProps<{}>) => ({
  darkProfile: profileSelector(state).darkProfile,
  dateFormat: profileSelector(state).dateFormat
})

export default connect(mapStateToProps)(DateInput)

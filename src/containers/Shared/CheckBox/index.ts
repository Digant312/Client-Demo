import { connect } from 'react-redux'
import { WrappedFieldProps } from 'redux-form'

import CheckBox from 'components/Shared/CheckBox'
import { IState } from 'reducers'
import { profileSelector } from 'selectors'

interface IMapStateProps {
  darkProfile: boolean
}

const mapStateToProps = (state: IState) => (
  {
    darkProfile: profileSelector(state).darkProfile
  }
)

export default connect<IMapStateProps, {}, WrappedFieldProps<{}>>(
  mapStateToProps
)(CheckBox)
import { connect } from 'react-redux'
import { WrappedFieldProps } from 'redux-form'
import { DropdownProps } from 'semantic-ui-react'

import Dropdown from 'components/Shared/Dropdown'
import { IState } from 'reducers'
import { profileSelector } from 'selectors'

const mapStateToProps = (state: IState) => (
  {
    darkProfile: profileSelector(state).darkProfile
  }
)

export default connect<{ darkProfile: boolean }, {}, WrappedFieldProps<{}> & DropdownProps >(
  mapStateToProps
)(Dropdown)
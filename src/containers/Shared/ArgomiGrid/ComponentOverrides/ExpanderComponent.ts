import { connect } from 'react-redux'

import ExpanderComponent from 'components/Shared/ArgomiGrid/ComponentOverrides/ExpanderComponent'
import { IState } from 'reducers'
import { profileSelector } from 'selectors'

const mapStateToProps = (state: IState) => (
  {
    darkProfile: profileSelector(state).darkProfile
  }
)

export default connect(
  mapStateToProps
)(ExpanderComponent)
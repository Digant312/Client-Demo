import { connect } from 'react-redux'

import FilterComponent from 'components/Shared/ArgomiGrid/ComponentOverrides/FilterComponent'
import { IState } from 'reducers'
import { profileSelector } from 'selectors'

const mapStateToProps = (state: IState) => (
  {
    darkProfile: profileSelector(state).darkProfile
  }
)

export default connect(
  mapStateToProps
)(FilterComponent)
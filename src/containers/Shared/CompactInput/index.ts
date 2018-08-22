import { connect } from 'react-redux'

import CompactInput from 'components/Shared/CompactInput'
import { IState } from 'reducers'
import { profileSelector } from 'selectors'

const mapStateToProps = (state: IState) => (
  {
    darkProfile: profileSelector(state).darkProfile
  }
)

export default connect(
  mapStateToProps
)(CompactInput)
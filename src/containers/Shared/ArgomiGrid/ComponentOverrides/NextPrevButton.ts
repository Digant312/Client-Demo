import { connect } from 'react-redux'

import Button from 'components/Shared/ArgomiGrid/ComponentOverrides/NextPrevButton'
import { IState } from 'reducers'
import { profileSelector } from 'selectors'

const mapStateToProps = (state: IState) => (
  {
    darkProfile: profileSelector(state).darkProfile
  }
)

export default connect(
  mapStateToProps
)(Button)
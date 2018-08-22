import { connect } from 'react-redux'

import Personal, { IPersonalProps } from 'components/Protected/Account/Personal'
import { IState } from 'reducers'
import { profileSelector } from 'selectors'

const mapStateToProps = (state: IState) => (
  {
    darkProfile: profileSelector(state).darkProfile,
    assetManagerId: profileSelector(state).assetManagerId,
    assumedAMId: profileSelector(state).assumedAMID,
    email: profileSelector(state).email
  }
)

export default connect<{email: string, assetManagerId: string}, {}, IPersonalProps>(
  mapStateToProps
)(Personal)
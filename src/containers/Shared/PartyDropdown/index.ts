import { connect } from 'react-redux'

import { IState } from 'reducers'
import { profileSelector } from 'selectors'
import PartyDropdown from 'components/Shared/PartyDropdown'

const mapStateToProps = (state: IState) => (
  {
    assumedAMId: profileSelector(state).assumedAMID
  }
)

export default connect(
  mapStateToProps
)(PartyDropdown)
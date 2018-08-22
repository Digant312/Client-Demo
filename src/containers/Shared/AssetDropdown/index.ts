import { connect } from 'react-redux'

import { IState } from 'reducers'
import { profileSelector } from 'selectors'
import AssetDropdown from 'components/Shared/AssetDropdown'

const mapStateToProps = (state: IState) => (
  {
    assumedAMId: profileSelector(state).assumedAMID
  }
)

export default connect(
  mapStateToProps
)(AssetDropdown)
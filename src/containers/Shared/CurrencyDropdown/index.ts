import { connect } from 'react-redux'

import CurrencyDropdown from 'components/Shared/CurrencyDropdown'
import { IState } from 'reducers'
import { profileSelector } from 'selectors'

const mapStateToProps = (state: IState) => (
  {
    assumedAMID: profileSelector(state).assumedAMID
  }
)

export default connect(
  mapStateToProps
)(CurrencyDropdown)
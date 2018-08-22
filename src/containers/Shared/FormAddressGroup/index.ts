import { connect } from 'react-redux'

import FormAddressGroup from 'components/Shared/FormAddressGroup'
import { IState } from 'reducers'
import { profileSelector } from 'selectors'

const mapStateToProps = (state: IState) => (
  {
    darkProfile: profileSelector(state).darkProfile
  }
)

export default connect(
  mapStateToProps
)(FormAddressGroup)
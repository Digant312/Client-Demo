import { connect } from 'react-redux'

import EditPassword, { IEditEmailProps } from 'components/Protected/Account/Personal/EditPassword'
import { IState } from 'reducers'
import { profileSelector } from 'selectors'

const mapStateToProps = (state: IState) => (
  {
    darkProfile: profileSelector(state).darkProfile
  }
)

export default connect<{ darkProfile: boolean }, {}, IEditEmailProps>(
  mapStateToProps
)(EditPassword)
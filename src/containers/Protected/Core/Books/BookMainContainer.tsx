import { connect } from 'react-redux'

import BookMainContainer from 'components/Protected/Core/Books'
import { IState } from 'reducers'
import { dataSelector, profileSelector } from 'selectors'

const mapStateToProps = (state: IState) => (
  {
    darkProfile: profileSelector(state).darkProfile
  }
)

export default connect(
  mapStateToProps
)(BookMainContainer)
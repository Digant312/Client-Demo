import { connect } from 'react-redux'

import PaginationComponent from 'components/Shared/ArgomiGrid/ComponentOverrides/PaginationComponent'
import { IState } from 'reducers'
import { profileSelector } from 'selectors'

const mapStateToProps = (state: IState) => ({
  darkProfile: profileSelector(state).darkProfile
})

export default connect(mapStateToProps)(PaginationComponent)

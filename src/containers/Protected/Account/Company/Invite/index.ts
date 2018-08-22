import { connect } from 'react-redux'

import Invite, { IMapStateProps, IMapDispatchProps, IInviteOwnProps } from 'components/Protected/Account/Company/Invite'
import { dataSelector, profileSelector } from 'selectors'
import { IState } from 'reducers'
import { fetchDomains } from 'actions/data'

const mapStateToProps = (state: IState) => (
  {
    userEmail: profileSelector(state).email,
    assumedAMID: profileSelector(state).assumedAMID,
    fetchingDomains: dataSelector(state).domains.fetching,
    domains: dataSelector(state).domains.data
  }
)

const mapDispatchToProps = (dispatch: Function) => (
  {
    fetchDomains: () => dispatch(fetchDomains())
  }
)

export default connect<IMapStateProps, IMapDispatchProps, IInviteOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(Invite)
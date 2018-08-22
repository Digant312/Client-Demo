import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import ArgomiNavBar, {
  IArgomiNavBarProps,
  IConnectInjectedProps
} from 'components/Shared/Layouts/Protected/ArgomiNavBar'
import { IState } from 'reducers'
import { profileSelector } from 'selectors'
import {
  requestLogout,
  toggleDarkProfile,
  assumeAMID,
  IAssumableAMIDs
} from 'actions/session'

interface IMapState {
  fetchingProfile: boolean
  assumableAMIDs: IAssumableAMIDs[]
  assumedAMID: string
  assetManagerId: string
  darkProfile: boolean
}

interface IMapDispatch {
  handleLogout: Function
  toggleDarkProfile: Function
  selectAMID: Function
}

const mapStateToProps = (state: IState): IMapState => {
  return {
    fetchingProfile: profileSelector(state).fetching,
    assumableAMIDs: profileSelector(state).assumableAMIDs,
    assumedAMID: profileSelector(state).assumedAMID,
    assetManagerId: profileSelector(state).assetManagerId,
    darkProfile: profileSelector(state).darkProfile
  }
}

const mapDispatchToProps = (
  dispatch: Function,
  ownProps: IArgomiNavBarProps & RouteComponentProps<{}> & IConnectInjectedProps
) => ({
  handleLogout: () => dispatch(requestLogout({ history: ownProps.history })),
  toggleDarkProfile: () => dispatch(toggleDarkProfile()),
  selectAMID: (amid: number) => dispatch(assumeAMID({ assumedAMID: amid }))
})

export default withRouter<IArgomiNavBarProps>(
  connect<
    IMapState,
    IMapDispatch,
    IArgomiNavBarProps & IConnectInjectedProps & RouteComponentProps<{}>
  >(mapStateToProps, mapDispatchToProps)(ArgomiNavBar)
)

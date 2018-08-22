import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import PublicRouteController from 'components/Global/PublicRouteController'
import { sessionSelector } from 'selectors'
import { IState } from 'reducers'

interface IPublicRouteProps {
  component: React.ComponentType
  path: string
}

interface IMapStateProps {
  authenticated: boolean
}

const mapStateToProps = (state: IState) => {
  return {
    authenticated: sessionSelector(state).authenticated
  }
}

export default withRouter<IPublicRouteProps>(connect<IMapStateProps, {}, IPublicRouteProps & RouteComponentProps<{}>>(
  mapStateToProps
)(PublicRouteController))
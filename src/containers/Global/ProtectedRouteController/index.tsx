import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import ProtectedRouteController from 'components/Global/ProtectedRouteController'
import { IState } from 'reducers'
import { sessionSelector } from 'selectors'

interface IOwnProps {
  component: React.ComponentType
  path: string
}

const mapStateToProps = (state: IState) => (
  {
    authenticated: sessionSelector(state).authenticated
  }
)

const mapDispatchToProps = (dispatch: Function) => ({}) 

export default withRouter<IOwnProps>(connect<{ authenticated: boolean }, {}, IOwnProps & RouteComponentProps<{}>>(
  mapStateToProps
)(ProtectedRouteController))
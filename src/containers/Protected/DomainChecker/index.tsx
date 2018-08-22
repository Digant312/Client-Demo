import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'

import { requestCheckDomain } from 'actions/checkDomain'
import { IState } from 'reducers'
import DomainChecker from 'components/Protected/DomainChecker'

const mapDispatchToProps = (dispatch: Function, ownProps: RouteComponentProps<{}>) => (
  {
    checkDomain: () => {
      console.log('DOMAIN:', ownProps.location.state.domain)
      dispatch(requestCheckDomain(ownProps.location.state.domain, ownProps.history))
    }
  }
)

export default connect<{}, { checkDomain: Function }, RouteComponentProps<{}>>(
  null,
  mapDispatchToProps
)(DomainChecker)
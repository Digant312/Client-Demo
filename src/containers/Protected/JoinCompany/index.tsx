import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'

import JoinCompany from 'components/Protected/JoinCompany'
import { requestJoinCompany } from 'actions/joinCompany'
import { IState } from 'reducers'
import { joinCompanySelector, profileSelector } from 'selectors'

interface IMapState {
  requesting: boolean
  requestError: string
}

interface IMapDispatch {
  registerUser: () => void
}

const mapStateToProps = (state: IState) => (
  {
    requesting: joinCompanySelector(state).joining,
    requestError: joinCompanySelector(state).error
  }
)

const mapDispatchToProps = (dispatch: Function, ownProps: RouteComponentProps<{}>) => (
  {
    registerUser: () => dispatch(requestJoinCompany(ownProps.history))
  }
)

export default connect<IMapState, IMapDispatch, RouteComponentProps<{}>>(
  mapStateToProps,
  mapDispatchToProps
)(JoinCompany)
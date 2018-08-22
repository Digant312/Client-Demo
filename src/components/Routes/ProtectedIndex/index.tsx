import React, { EventHandler, MouseEvent } from 'react'
import { Link, Redirect, Route, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import Loadable from 'react-loadable'

import NavRoute from 'components/Shared/Layouts/Protected/WithNav'
import Loader from 'components/Shared/Loader'
import { removeTrailingSlash } from 'utils/router'

interface IProtectedIndexComponentProps {
  initiatePubSub: Function
  fetchBooks: Function
  fetchParties: Function
  logout: EventHandler<MouseEvent<HTMLButtonElement>>
  startSessionChecker: Function
}

const LoadableNewCompany = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'newCompanyRoute' */ 'containers/Protected/NewCompany'),
  loading: () => <div>Loading...</div>
})

const LoadableJoinCompany = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'joinCompanyRoute' */ 'containers/Protected/JoinCompany'),
  loading: () => <div>Loading...</div>
})

const LoadableDomainChecker = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'domainCheckerRoute' */ 'containers/Protected/DomainChecker'),
  loading: () => <div>Loading...</div>
})

const LoadableTermsAndConditions = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'termsAndConditionsRoute' */ 'containers/Protected/TermsAndConditions'),
  loading: () => <div>Loading...</div>
})

const LoadablePortfolio = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'portfolioRoute' */ 'components/Protected/Portfolio'),
  loading: () => <Loader delay={200} />
})

const LoadableMonitor = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'monitorRoute' */ 'components/Protected/Monitor'),
  loading: () => <Loader delay={200} />
})

const LoadableAccount = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'accountRoute' */ 'components/Protected/Account'),
  loading: () => <Loader delay={200} />
})

const LoadableCore = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'coreRoute' */ 'components/Protected/Core'),
  loading: () => <Loader delay={200} />
})

export default class ProtectedIndexComponent extends React.Component<
  IProtectedIndexComponentProps & RouteComponentProps<{}>
> {
  componentDidMount() {
    // dispatch actions to fetch data and begin monitoring session validity
    this.props.initiatePubSub()
    this.props.fetchBooks()
    // this.props.fetchParties()
    this.props.startSessionChecker()
  }

  render() {
    const { match, logout } = this.props
    return (
      <div className="div-height-fill">
        <Route
          exact
          path={match.url}
          render={() => (
            <Redirect to={`${removeTrailingSlash(match.url)}/portfolio`} />
          )}
        />
        <Route
          path={`${match.url}/domain-check`}
          render={props => <LoadableDomainChecker {...props} />}
        />
        <Route
          path={`${match.url}/new-company`}
          component={LoadableNewCompany}
        />
        <Route
          path={`${match.url}/join-company`}
          render={props => <LoadableJoinCompany {...props} />}
        />
        <Route
          path={`${match.url}/terms-and-conditions`}
          component={LoadableTermsAndConditions}
        />
        <NavRoute path={`${match.url}/dashboard`} component={Dashboard} />
        <NavRoute
          path={`${match.url}/portfolio`}
          component={LoadablePortfolio}
        />
        <NavRoute path={`${match.url}/monitor`} component={LoadableMonitor} />
        <NavRoute path={`${match.url}/core`} component={LoadableCore} />
        <NavRoute path={`${match.url}/account`} component={LoadableAccount} />
      </div>
    )
  }
}

/* PLACEHOLDER COMPONENTS */

const Dashboard = (props: RouteComponentProps<{}>) => {
  return <div>Dashboard</div>
}

import React from 'react'
import { connect } from 'react-redux'
import {
  Link,
  Redirect,
  Route,
  RouteComponentProps,
  Switch
} from 'react-router-dom'
import Loadable, { LoadingComponentProps } from 'react-loadable'

import { removeTrailingSlash } from 'utils/router'
import NotFound from 'components/Shared/NotFound'

/* Dummy loading component to test the features. Implement this separately with some sort of spinner */
const LoadingComponent = (props: LoadingComponentProps) => {
  if (props.isLoading) {
    // While our other component is loading...
    if (props.timedOut) {
      // In case we've timed out loading our other component.
      return <div>Loader timed out!</div>
    } else if (props.pastDelay) {
      // Display a loading screen after a set delay.
      return <div>Loading...</div>
    } else {
      // Don't flash "Loading..." when we don't need to.
      return null
    }
  } else if (props.error) {
    // If we aren't loading, maybe
    return <div>Error! Component failed to load</div>
  } else {
    // This case shouldn't happen... but we'll return null anyways.
    return null
  }
}

const LoadableHome = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'homeRoute' */ 'containers/Public/Home'),
  loading: () => <div>Loading...</div>,
  delay: 200
})

const LoadableLogin = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'loginRoute' */ 'containers/Public/Login'),
  loading: () => <div>Loading...</div>,
  delay: 200
})

const LoadableSignup = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'registerRoute' */ 'containers/Public/Signup'),
  loading: () => <div>Loading...</div>,
  delay: 200
})

const LoadableVerify = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'verifyRoute' */ 'containers/Public/Verify'),
  loading: () => <div>Loading...</div>,
  delay: 200
})

const LoadableForgot = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'forgotRoute' */ 'containers/Public/Forgot'),
  loading: LoadingComponent,
  delay: 200
})

export default (props: RouteComponentProps<{}>) => {
  return (
    <div className="div-height-fill">
      <Switch>
        <Route
          exact
          path={props.match.url}
          render={() => (
            <Redirect to={`${removeTrailingSlash(props.match.url)}/home`} />
          )}
        />
        <Route path={`${props.match.url}/home`} component={LoadableHome} />
        <Route
          path={`${props.match.url}/login/:type?`}
          component={LoadableLogin}
        />
        <Route path={`${props.match.url}/signup`} component={LoadableSignup} />
        <Route
          path={`${props.match.url}/verify/:username`}
          component={LoadableVerify}
        />
        <Route path={`${props.match.url}/forgot`} component={LoadableForgot} />
        <Route
          render={() => <NotFound redirectPath={`${props.match.url}`} />}
        />
      </Switch>
    </div>
  )
}

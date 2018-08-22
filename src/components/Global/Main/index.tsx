import React from 'react'
import Loadable from 'react-loadable'
import { Link, Redirect, Route } from 'react-router-dom'

import PublicRoutes from 'containers/Global/PublicRouteController'
import ProtectedRoutes from 'containers/Global/ProtectedRouteController'

const LoadablePublicIndex = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'publicGroup' */ 'components/Routes/PublicIndex'),
  loading: () => <div>Loading...</div>
})

const LoadableProtectedIndex = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'protectedGroup' */ 'containers/Routes/ProtectedIndex'),
  loading: () => <div>Loading...</div>
})

/*** 
 * This is the top-level component for the project (the one passed to ReactDOM.render()).
 * The job of this component is to define the Public and Protected Route Groups.
 * All Public Routes are under the '/public' path and navigating here when logged in will redirect to '/auth'.
 * All Protected Routes are under the '/auth' path and navigating here when not logged in will redirect to '/', which in turn redirects to /public.
 ***/

const App = () => {
  return (
    <div>
      <Route exact path="/" render={() => <Redirect to="/a-p" />} />
      <PublicRoutes path="/a-p" component={LoadablePublicIndex} />
      <ProtectedRoutes path="/a-a" component={LoadableProtectedIndex} />
    </div>
  )
}

export default App

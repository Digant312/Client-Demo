import React from 'react'
import { Redirect, Route, RouteComponentProps } from 'react-router-dom'

interface IProtectedRouteControllerProps extends RouteComponentProps<{}> {
  component: React.ComponentClass<any> | React.StatelessComponent<any>
  path?: string
  authenticated: boolean
}

export default (props: IProtectedRouteControllerProps) => {
  const { component: Component, authenticated, ...rest } = props
  return <Route {...rest} render={routeProps => {
    return authenticated ? <Component {...routeProps} /> :
    <Redirect to={{ pathname: '/a-p/login/forbidden', state: { from: routeProps.location } }} />
  }} />
}
import React from 'react'
import { Redirect, Route } from 'react-router-dom'

export default (props: { component: React.ComponentClass<any> | React.StatelessComponent<any>, authenticated: boolean, path?: string }) => {
  const { component: Component, authenticated, ...rest } = props
  return <Route {...rest} render={props => (
    authenticated ?
    <Redirect to='/a-a' /> :
    <Component {...props } />
  )} />
}
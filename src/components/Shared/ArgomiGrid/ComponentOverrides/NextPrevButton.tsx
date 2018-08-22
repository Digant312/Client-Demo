import React from 'react'
import { Button } from 'semantic-ui-react'

export default (props: any) => {
  const { darkProfile, dispatch, ...passedProps } = props
  return <Button fluid inverted={darkProfile} {...passedProps}>{ props.children }</Button>
}
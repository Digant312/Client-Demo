import React from 'react'
import { Link } from 'react-router-dom'

import DefaultTableCell from 'components/Shared/ArgomiGrid/ComponentOverrides/CustomDefaultCell'

export default (props: {
  linkTo: string
  linkContent: any
  [otherProps: string]: any
}) => {
  const { linkContent, linkTo, ...otherProps } = props
  let link: JSX.Element = <span />
  if (!linkTo || !linkContent) {
    console.warn('[LinkCell] - LinkCell requires linkTo and linkContent.')
  } else {
    link = <Link to={linkTo}>{linkContent}</Link>
  }

  return <DefaultTableCell {...otherProps} value={link} />
}

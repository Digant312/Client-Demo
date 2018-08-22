import React from 'react'

import DefaultTableCell from 'components/Shared/ArgomiGrid/ComponentOverrides/CustomDefaultCell'
import { normaliseCurrency } from 'utils/form'

export default (props: { number: string; [otherProps: string]: any }) => {
  const { number, ...otherProps } = props
  return (
    <DefaultTableCell
      {...otherProps}
      value={normaliseCurrency(number)}
      style={{ marginLeft: 'auto' }}
    />
  )
}

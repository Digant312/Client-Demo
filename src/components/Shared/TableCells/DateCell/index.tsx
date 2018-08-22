import React from 'react'
import { Moment } from 'moment'

import DefaultTableCell from 'components/Shared/ArgomiGrid/ComponentOverrides/CustomDefaultCell'
import { dateFormats } from 'reducers/profile'

import { IMapStateProps } from 'containers/Shared/TableCells/DateCell'

export interface IDateCellOwnProps {
  date: Moment | string
  [otherProps: string]: any
}

export default (props: IDateCellOwnProps & IMapStateProps) => {
  const { date, dateFormat, ...otherProps } = props
  let resolvedDate: string = ''
  if (typeof date === 'string') {
    // If the date is a string, just pass it as-is
    resolvedDate = date
  } else if (date.format) {
    // If the date has a format method, call it with the user's dateFormat
    resolvedDate = date.format(dateFormat)
  } else {
    console.warn('[DateCell] - found unknown date type.', date)
  }

  return <DefaultTableCell {...otherProps} value={resolvedDate} />
}

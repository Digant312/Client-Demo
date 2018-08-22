import React from 'react'
import union from 'lodash/union'
import startCase from 'lodash/startCase'
import moment from 'moment'
import numeral from 'numeral'

import { convertToDateObj } from 'utils/form'
import { dateFormats } from 'reducers/profile'

export const columnBuilder = (data: any[]) => {
  return data
    .reduce((arr: any, curr: any) => {
      return union(
        arr,
        Object.keys(curr).filter(key => {
          return (
            curr[key] && (curr[key].toFixed || typeof curr[key] !== 'object')
          )
        })
      )
    }, [])
    .map((key: string) => {
      return {
        Header: startCase(key),
        id: key,
        accessor: (d: any) => d[key],
        Cell: (row: any) =>
          row.value ? (
            <div>{row.value.toFixed ? row.value.toFixed() : row.value}</div>
          ) : null
      }
    })
}

export const createAccessor = (path: string) => (d: any) => {
  // Split the dot notation properties
  const nestedKeys = path.split('.')

  // Reduce the nested properties by returning progressively deeper values
  // If at any point there is no more data, the reduce will exit by returning undefined
  return nestedKeys.reduce((arr: any, curr: any) => {
    if (arr) return arr[curr]
    return undefined
  }, d)
}

export const dateSortMethod = (format: string) => (a: any, b: any) => {
  if (typeof a === 'string') a = moment(a, format)
  if (typeof b === 'string') b = moment(b, format)
  if (a > b) {
    return 1
  } else if (a < b) {
    return -1
  } else {
    return 0
  }
}

export const numberSortMethod = (a: any, b: any) => {
  // Attempt to cast to string first
  a = typeof a !== 'string' && a.toString ? a.toString() : a
  b = typeof b !== 'string' && b.toString ? b.toString() : b

  // For anything that escapes the above
  a = typeof a === 'string' || typeof a === 'number' ? numeral(a) : a
  b = typeof b === 'string' || typeof b === 'number' ? numeral(b) : b
  if (!a.value || !b.value)
    throw new Error('Cannot sort numbers without a value() method')
  if (a.value() > b.value()) {
    return 1
  } else if (a.value() < b.value()) {
    return -1
  } else {
    return 0
  }
}

export const dateFilterMethod = (dateFormat: dateFormats) => (
  filter: { id: string; value: string },
  row: any
) => {
  let formattedDate: string
  if (row[filter.id].format) {
    formattedDate = row[filter.id].format(dateFormat)
  } else if (row[filter.id].toString) {
    formattedDate = row[filter.id].toString()
  } else {
    formattedDate = `${row[filter.id]}`
  }
  return new RegExp(`${filter.value}`, 'ig').test(formattedDate)
}

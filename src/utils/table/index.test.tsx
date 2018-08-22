import React from 'react'
import moment from 'moment'

import * as tableFunctions from './'

describe('columnBuilder', () => {
  const sampleHeaders = [
    { id: '1', type: 'asset', ignore: undefined },
    { id: '2', type: 'equity', ignore: undefined },
    { id: '3', type: 'fx', ignore: undefined },
    { id: '4', type: 'future', ignore: undefined },
    { id: '5', type: { toFixed: () => '5.00' }, ignore: undefined }
  ]
  it('maps the input to the correct header objects', () => {
    const expectedResult = [
      {
        Header: 'Id',
        id: 'id',
        accessor: (d: any) => d['id'],
        Cell: (row: any) => (
          <div>{row.value.toFixed ? row.value.toFixed() : row.value}</div>
        )
      },
      {
        Header: 'Type',
        id: 'type',
        accessor: (d: any) => d['type'],
        Cell: (row: any) => (
          <div>{row.value.toFixed ? row.value.toFixed() : row.value}</div>
        )
      }
    ]
    const result = tableFunctions.columnBuilder(sampleHeaders)
    expect(result.length).toEqual(2)
    expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedResult))
  })
})

describe('createAccessor', () => {
  const dummyObj = { a: { b: { c: { d: 'e' } } } }
  const corruptedObj = { a: { c: 'e' } }
  const accessor = tableFunctions.createAccessor('a.b.c.d')

  it('returns the correct value', () => {
    const expectedResult = 'e'
    const accessedValue = accessor(dummyObj)
    expect(accessedValue).toEqual(expectedResult)
  })

  it('returns undefined if unable to access any level', () => {
    const accessedValue = accessor(corruptedObj)
    expect(accessedValue).toBeUndefined()
  })
})

describe('dateSortMethod', () => {
  it('sorts for DD-MM-YYYY dates', () => {
    const earlierDate = '01-01-2008'
    const laterDate = '31-12-2008'
    const formattedFunction = tableFunctions.dateSortMethod('DD-MM-YYYY')
    expect(formattedFunction(earlierDate, laterDate)).toEqual(-1)
    expect(formattedFunction(laterDate, earlierDate)).toEqual(1)
    expect(formattedFunction(laterDate, laterDate)).toEqual(0)
  })

  it('sorts for YYYY-MM-DD dates', () => {
    const earlierDate = '2008-01-01'
    const laterDate = '2008-12-31'
    const formattedFunction = tableFunctions.dateSortMethod('YYYY-MM-DD')
    expect(formattedFunction(earlierDate, laterDate)).toEqual(-1)
    expect(formattedFunction(laterDate, earlierDate)).toEqual(1)
    expect(formattedFunction(laterDate, laterDate)).toEqual(0)
  })
})

describe('numberSortMethod', () => {
  it('throws for unsupported types', () => {
    const willThrow = () => {
      tableFunctions.numberSortMethod(undefined, 1)
    }
    expect(willThrow).toThrow()
  })
  it('sorts for strings and numbers', () => {
    const smallerNumber = 1.09
    const largerNumber = '500'
    expect(
      tableFunctions.numberSortMethod(smallerNumber, largerNumber)
    ).toEqual(-1)
    expect(
      tableFunctions.numberSortMethod(largerNumber, smallerNumber)
    ).toEqual(1)
    expect(
      tableFunctions.numberSortMethod(smallerNumber, smallerNumber)
    ).toEqual(0)
  })
})

describe('dateFilterMethod', () => {
  let dateFilterWithFormat: any
  beforeAll(() => {
    dateFilterWithFormat = tableFunctions.dateFilterMethod('DD-MM-YYYY')
  })
  it('filters correctly', () => {
    const filter = (value: string) => ({ id: 'testDate', value })
    const row = { testDate: moment('2017-04-07') }
    expect(dateFilterWithFormat(filter('04'), row)).toBeTruthy()
    expect(dateFilterWithFormat(filter('8'), row)).toBeFalsy()
  })
})

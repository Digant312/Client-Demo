import numeral from 'numeral'
import forEach from 'lodash/forEach'

import commonDomains from './commonDomains'

export const required = (value: string) => (value ? undefined : 'Required')

export const timezoneDropdownRequired = (value: string, bookState: any) => {
  if (bookState.bookType !== 'Counterparty') {
    return value ? undefined : 'Required'
  }
  return undefined
}

export const minLength = (length: number) => (name: string = 'Input') => (
  value: string
) =>
  value.length >= length
    ? undefined
    : `${name} needs to be at least ${length} characters`

export const containsNumber = (name: string = 'Input') => (value: string) => {
  const hasNumber = new RegExp(/\d/)
  return hasNumber.test(value) ? undefined : `${name} needs to contain a number`
}

export const lowerUpper = (name: string = 'Input') => (value: string) => {
  const hasCases = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])/)
  return hasCases.test(value)
    ? undefined
    : `${name} needs at least one uppercase and one lowercase letter`
}

export const hasSpace = (name: string = 'Input') => (value: string = '') => {
  return value.split(' ').length > 1
    ? `${name} cannot contain any spaces`
    : undefined
}

export const findCommonDomain = (value: string) => {
  return commonDomains.some(el => new RegExp(el, 'ig').test(value))
    ? `Public domain email is not allowed.`
    : undefined
}

export const normaliseBase = (numeral: Function) => (value: any = '') => {
  if (typeof value !== 'string') {
    if (value.toString) {
      value = value.toString()
    } else {
      console.error('Received unknown format for number', value)
      value = '0'
    }
  }
  value = value.toLowerCase()
  const decimalPointRegExp = /\./g
  const letterRegExp = /[a-z]|[A-Z]/g

  // if there is no decimal point, just format it
  if (!decimalPointRegExp.test(value)) {
    return numeral(value).format()
  }

  // if it is a 'zero' value, return it without any formatting
  if (!parseFloat(value)) return value

  const decimalPart = value.split('.')[1]

  // Read how many decimal points were keyed in, and generate format from this.
  // E.g. if user keyed in '5.000', generate '.000'
  const specifiedDecimalUnits = decimalPart.replace(letterRegExp, '').length
  let decimalUnitsForFormat = `.${new Array(specifiedDecimalUnits)
    .fill('0')
    .join('')}`

  // if the input has a letter in it, format with '.[000000]'
  // since we don't know how many decimal points we should use
  if (letterRegExp.test(value.split('.')[1]))
    decimalUnitsForFormat = '.[000000]'

  // Always want commas in there
  const returnFormat = `0,0${decimalUnitsForFormat}`
  let returnValue = numeral(value).format(returnFormat)

  // If user passed in no decimal points (yet?), force the decimal point to be added back
  // Remember we are in the 'has-decimal-point' case by this point
  if (!specifiedDecimalUnits) return `${returnValue}.`
  return returnValue
}

export const normaliseCurrency = normaliseBase(numeral)

export const calculateTotalNetAffectingChargesBase = (numeral: Function) => (
  charges: any[]
) => {
  return charges
    .filter((charge: any) => !!charge.netAffecting)
    .reduce(
      (arr: any, curr: any) =>
        arr.add(
          numeral(
            curr.chargeValue.toFixed
              ? curr.chargeValue.toFixed()
              : curr.chargeValue || 0
          ).value()
        ),
      numeral(0)
    )
}
export const calculateTotalNetAffectingCharges = calculateTotalNetAffectingChargesBase(
  numeral
)

export const calculateGrossSettlementBase = (numeral: Function) => (
  quantity: string | number,
  price: string | number,
  additionalValues?: any[]
) => numeral(quantity).multiply(numeral(price).value())
export const calculateGrossSettlement = calculateGrossSettlementBase(numeral)

export const calculateNetSettlementBase = (numeral: Function) => (
  grossSettlement: string | number,
  netCharges: string | number,
  action: string
) => {
  switch (action) {
    case 'Sell':
    case 'Short Sell':
      return numeral(grossSettlement).subtract(netCharges)
    default:
      return numeral(grossSettlement).add(netCharges)
  }
}
export const calculateNetSettlement = calculateNetSettlementBase(numeral)

export const parseDate = (format: string) => (date: Date) => {
  const year = date.getFullYear().toString()
  let month: string | number = date.getMonth() + 1
  month = month < 10 ? `0${month}` : month
  let day: string | number = date.getDate()
  day = day < 10 ? `0${day}` : day
  switch (format) {
    case 'dd-mm-yyyy':
      return formatDateTwoDigit(`${day}${month}${year}`)
    case 'yyyy-mm-dd':
      return formatDateFullYear(`${year}${month}${day}`)
    default:
      throw new Error(`Invalid date format ${format}`)
  }
}

// General function to convert strings to a date format.
export const formatDate = (format: string) => (
  value: string,
  previousValue?: string
) => {
  if (!value) return value
  // ignore if back spacing
  if (previousValue && value.length < previousValue.length) return value
  // return previousValue if there are invalid characters
  if (!/^(\d|-)+$/.test(value)) return previousValue || value
  let cleanDate = (value: string) =>
    value.split('-').reduce((arr, curr) => `${arr}${curr}`)
  let cleanedDate = cleanDate(value).substr(0, 8)

  switch (format.toLowerCase()) {
    case 'yyyy-mm-dd':
      return formatDateFullYear(cleanedDate)
    case 'dd-mm-yyyy':
      return formatDateFullYearDMY(cleanedDate)
    default:
      throw new Error(`Invalid date format: ${format}`)
  }
}

// add hyphens xxxxxxxx -> xxxx-xx-xx
export const formatDateFullYear = (value: string) => {
  if (value.length >= 6) {
    value = value.substr(0, 6) + '-' + value.substr(6)
    value = value.substr(0, 4) + '-' + value.substr(4)
  } else if (value.length >= 4) {
    value = value.substr(0, 4) + '-' + value.substr(4)
  }
  return value
}

// add hyphens xxxxxxxx -> xx-xx-xxxx
export const formatDateFullYearDMY = (value: string) => {
  if (value.length >= 4) {
    value = value.substr(0, 4) + '-' + value.substr(4)
    value = value.substr(0, 2) + '-' + value.substr(2)
  } else if (value.length >= 2) {
    value = value.substr(0, 2) + '-' + value.substr(2)
  }
  return value
}

// add hyphens xxxxxx -> xx-xx-xx
export const formatDateTwoDigit = (value: string) => {
  if (value.length >= 4) {
    value = value.substr(0, 4) + '-' + value.substr(4)
    value = value.substr(0, 2) + '-' + value.substr(2)
  } else if (value.length >= 2) {
    value = value.substr(0, 2) + '-' + value.substr(2)
  }
  return value
}

// convert from yyyy-mm-dd to `format` arg
export const parseAMaaSDate = (format: string) => (value: string) => {
  if (!value) return
  let valueArr = value.split('-').map(el => parseInt(el))
  valueArr[1] = valueArr[1] - 1
  const dateObj = new Date(...valueArr)
  return parseDate(format)(dateObj)
}

// convert from `format` arg to yyyy-mm-dd
export const convertToAMaaSDate = (format: string) => (value: string) => {
  if (!value) return
  const dateArr = value.split('-')
  switch (format) {
    case 'yyyy-mm-dd':
      if (
        dateArr[0].toString().length !== 4 ||
        dateArr[1].toString().length != 2 ||
        dateArr[2].toString().length != 2
      ) {
        throw new Error('Invalid date format')
      }
      return value
    case 'dd-mm-yyyy':
      if (
        dateArr[0].toString().length !== 2 ||
        dateArr[1].toString().length !== 2 ||
        dateArr[2].toString().length !== 4
      ) {
        throw new Error('Invalid date format')
      }
      return `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`
    default:
      throw new Error(`Invalid date format: ${format}`)
  }
}

// convert from `format` arg to date object
export const convertToDateObj = (format: string) => (value: string) => {
  const amaasDate = convertToAMaaSDate(format)(value) || ''
  const dateArr = amaasDate.split('-')
  const year = parseInt(dateArr[0])
  const month = parseInt(dateArr[1]) - 1
  const resolvedMonth =
    month > 0 ? parseInt(`${month}`.replace(/^0/, '')) : month
  const date = parseInt(dateArr[2])
  const resolvedDate = parseInt(`${date}`.replace(/^0/, ''))
  return new Date(year, resolvedMonth, resolvedDate)
}

export const makeUpperCase = (value: string) => value.toUpperCase()

export const trimSpace = (value: string = '') => value.replace(/\s/g, '')
export const trimSlash = (value: string = '') => value.replace(/\//g, '')

export const getChildFieldIndex = (
  childType: string,
  childName: string,
  currentProps: any
) => {
  const currentChildren = currentProps[childType] || []
  const currentIndex = currentChildren.findIndex(
    (child: { name: string }) => child.name === childName
  )
  return currentIndex
}

export const addOrRemoveChildField = (thisProps: any, nextProps: any) => (
  childType: string
) => (childName: string) => (addOrRemove: 'add' | 'remove', value?: object) => {
  if (!thisProps.array) return
  const currentIndex = getChildFieldIndex(childType, childName, nextProps)

  switch (addOrRemove) {
    case 'add':
      // If there is already a matching field in the form, remove it then add it back
      if (currentIndex >= 0) {
        thisProps.array.remove(childType, currentIndex)
        thisProps.array.push(childType, {
          name: childName,
          ...value
        })
      } else {
        thisProps.array.push(childType, {
          name: childName,
          ...value
        })
      }
      break
    case 'remove':
      // If there are no matching fields in the form, return
      if (currentIndex === -1) return
      thisProps.array.remove(childType, currentIndex)
      break
    default:
      return
  }
}

export function getPrimaryChild(children: any = {}, primaryAccessor: string) {
  let primaryChildren: any = []
  forEach(children, (child: { [propName: string]: any }, key: string) => {
    if (child[primaryAccessor])
      primaryChildren = [...primaryChildren, { name: key, ...child }]
  })
  if (primaryChildren.length > 1)
    console.warn('Found more than 1 primary child - returning first occurence.')
  return primaryChildren[0]
}

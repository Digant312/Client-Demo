import numeral from 'numeral'
import * as formFunctions from './'

const mockedFormat = (format: string) => 'formatted'
const mockedNumeral = (value: string) => ({
  format: mockedFormat,
  add: jest.fn((toAdd: string) =>
    mockedNumeral((parseFloat(value) + parseFloat(toAdd)).toString())
  ),
  subtract: jest.fn((toSubtract: string) =>
    mockedNumeral((parseFloat(value) - parseFloat(toSubtract)).toString())
  ),
  multiply: jest.fn((toMultiply: string) =>
    mockedNumeral((parseFloat(value) * parseFloat(toMultiply)).toString())
  ),
  value: jest.fn(() => parseFloat(value))
})

describe('required', () => {
  it('should return undefined if passed a value', () => {
    expect(formFunctions.required('value')).toBeUndefined()
  })

  it('should return a value if no value is passed', () => {
    expect(formFunctions.required('')).toBeDefined()
  })
})

describe('minLength', () => {
  let validator
  beforeAll(() => {
    validator = formFunctions.minLength(5)()
  })
  it('should return undefined if length is sufficiently long', () => {
    expect(validator('atLeast5chars')).toBeUndefined()
  })

  it('should return a value if input is not sufficiently long', () => {
    expect(validator('tiny')).toBeDefined()
  })
})

describe('containsNumber', () => {
  let validator
  beforeAll(() => {
    validator = formFunctions.containsNumber()
  })
  it('should return undefined if the input contains a numner', () => {
    expect(validator('l337L0rd')).toBeUndefined()
  })

  it('should return a value if input does not contain a number', () => {
    expect(validator('likeASir')).toBeDefined()
  })
})

describe('lowerUpper', () => {
  let validator
  beforeAll(() => {
    validator = formFunctions.lowerUpper()
  })
  it('should return undefined if the input contains lower and upper case', () => {
    expect(validator('mOnAd')).toBeUndefined()
  })

  it('should return a value if the input does not contain both lower and upper case letters', () => {
    expect(validator('monad')).toBeDefined()
  })
})

describe('hasSpace', () => {
  let validator
  beforeAll(() => {
    validator = formFunctions.hasSpace()
  })
  it('should return undefined if the input has no spaces', () => {
    expect(validator('compression')).toBeUndefined()
  })

  it('should return a value if the input has a space', () => {
    expect(validator('rare fied')).toBeDefined()
  })
})

describe('findCommonDomain', () => {
  it('finds common domains', () => {
    expect(formFunctions.findCommonDomain('argomi@gmail.com')).toBeDefined()
  })
  it('allows private domains', () => {
    expect(formFunctions.findCommonDomain('argomi@argomi.com')).toBeUndefined()
  })
})

describe('normaliseBase', () => {
  let normaliser
  beforeAll(() => {
    normaliser = formFunctions.normaliseBase(numeral)
  })

  it('formats correctly', done => {
    const cases = [
      { input: undefined, expectedResult: '0' },
      { input: '0', expectedResult: '0' },
      { input: '0.', expectedResult: '0.' },
      { input: '0.0', expectedResult: '0.0' },
      { input: '0.09', expectedResult: '0.09' },
      { input: '0.0092k', expectedResult: '9.2' },
      { input: '1', expectedResult: '1' },
      { input: '1.', expectedResult: '1.' },
      { input: '1.0', expectedResult: '1.0' },
      { input: '1.08', expectedResult: '1.08' },
      { input: '1.08k', expectedResult: '1,080' }
    ]
    cases.forEach(testCase => {
      expect(normaliser(testCase.input)).toEqual(testCase.expectedResult)
    })
    done()
  })
})

describe('calculateTotalNetAffectingChargesBase', () => {
  let calculate
  beforeAll(() => {
    calculate = formFunctions.calculateTotalNetAffectingChargesBase(
      mockedNumeral
    )
  })
  it('adds charges', () => {
    const expectedResult = 3
    const totalCharges = calculate([
      { netAffecting: true, chargeValue: '2' },
      { netAffecting: false, chargeValue: '1' },
      { netAffecting: true, chargeValue: '1' }
    ]).value()
    expect(totalCharges).toEqual(expectedResult)
  })
})

describe('calculateGrossSettlement', () => {
  const calculate = formFunctions.calculateGrossSettlementBase(mockedNumeral)
  it('multiplies price and quantity', () => {
    const expectedResult = 42
    expect(calculate(7, 6).value()).toEqual(expectedResult)
  })
})

describe('calculateNetSettlement', () => {
  const calculate = formFunctions.calculateNetSettlementBase(mockedNumeral)
  it('subtracts charges from gross for sell or short types', () => {
    const expectedResult = 42
    expect(calculate(50, 8, 'Sell').value()).toEqual(expectedResult)
  })
  it('adds charges to gross for not sell or short types', () => {
    const expectedResult = 88
    expect(calculate(80, 8, 'Buy').value()).toEqual(expectedResult)
  })
})

describe('formatDateFullYear', () => {
  it('formats an entire string', () => {
    const expectedResult = '2017-01-01'
    expect(formFunctions.formatDateFullYear('20170101')).toEqual(expectedResult)
  })
  it('formats partial strings (year)', () => {
    const expectedResult = '2017-'
    expect(formFunctions.formatDateFullYear('2017')).toEqual(expectedResult)
  })
  it('formats partial string (yyyy-mm)', () => {
    const expectedResult = '2017-01-'
    expect(formFunctions.formatDateFullYear('201701')).toEqual(expectedResult)
  })
  it('formats full string', () => {
    const expectedResult = '2017-01-01'
    expect(formFunctions.formatDateFullYear('20170101')).toEqual(expectedResult)
    expect(formFunctions.formatDateFullYear('2017010')).toEqual('2017-01-0')
  })
})

describe('formatDateFullYearDMY', () => {
  it('formats an entire string', () => {
    const expectedResult = '31-12-2017'
    expect(formFunctions.formatDateFullYearDMY('31122017')).toEqual(
      expectedResult
    )
  })
  it('formats partial strings (dd)', () => {
    const expectedResult = '31-'
    expect(formFunctions.formatDateFullYearDMY('31')).toEqual(expectedResult)
  })
  it('formats partial string (yyyy-mm)', () => {
    const expectedResult = '31-12-'
    expect(formFunctions.formatDateFullYearDMY('3112')).toEqual(expectedResult)
  })
  it('formats full string', () => {
    const expectedResult = '31-12-2017'
    expect(formFunctions.formatDateFullYearDMY('31122017')).toEqual(
      expectedResult
    )
    expect(formFunctions.formatDateFullYearDMY('311220')).toEqual('31-12-20')
  })
})

describe('formatDateTwoDigit', () => {
  it('formats an entire string', () => {
    const expectedResult = '01-01-2017'
    expect(formFunctions.formatDateTwoDigit('01012017')).toEqual(expectedResult)
  })
  it('formats partial strings (dd)', () => {
    const expectedResult = '01-'
    expect(formFunctions.formatDateTwoDigit('01')).toEqual(expectedResult)
  })
  it('formats partial string (dd-mm)', () => {
    const expectedResult = '01-01-'
    expect(formFunctions.formatDateTwoDigit('0101')).toEqual(expectedResult)
  })
  it('formats full string', () => {
    const expectedResult = '01-01-2017'
    expect(formFunctions.formatDateTwoDigit('01012017')).toEqual(expectedResult)
    expect(formFunctions.formatDateTwoDigit('010120')).toEqual('01-01-20')
  })
})

describe('formatDate', () => {
  const previousValue = '0'
  const formatDate = formFunctions.formatDate('yyyy-mm-dd')
  it('returns value if if its shorter than previous value', () => {
    const expectedResult = '123'
    expect(formatDate('123', '1234')).toEqual(expectedResult)
  })
  it('returns previous value if value contains non-digits', () => {
    const expectedResult = previousValue
    expect(formatDate('a123', previousValue)).toEqual(expectedResult)
  })
})

describe('parseDate', () => {
  const inputDate = new Date(2017, 11, 31)
  it('converts Date instance to dd-mm-yyyy', () => {
    const parseDate = formFunctions.parseDate('dd-mm-yyyy')
    const expectedResult = '31-12-2017'
    expect(parseDate(inputDate)).toEqual(expectedResult)
  })
  it('converts Date instance to yyyy-mm-dd', () => {
    const parseDate = formFunctions.parseDate('yyyy-mm-dd')
    const expectedResult = '2017-12-31'
    expect(parseDate(inputDate)).toEqual(expectedResult)
  })
})

describe('parseAMaaSDate', () => {
  it('converts to yyyy-mm-dd', () => {
    const parseAMaaSDate = formFunctions.parseAMaaSDate('yyyy-mm-dd')
    const expectedResult = '2017-12-31'
    expect(parseAMaaSDate('2017-12-31')).toEqual(expectedResult)
  })
  it('converts to dd-mm-yyyy', () => {
    const parseAMaaSDate = formFunctions.parseAMaaSDate('dd-mm-yyyy')
    const expectedResult = '31-12-2017'
    expect(parseAMaaSDate('2017-12-31')).toEqual(expectedResult)
  })
})

describe('convertToDateObj', () => {
  it('converts correctly for dd-mm-yyyy', () => {
    const expectedResult = new Date(2017, 10, 25)
    const functionWithFormat = formFunctions.convertToDateObj('dd-mm-yyyy')
    expect(functionWithFormat('25-11-2017')).toEqual(expectedResult)
  })

  it('converts correctly for yyyy-mm-dd', () => {
    const expectedResult = new Date(2008, 8, 7)
    const functionWithFormat = formFunctions.convertToDateObj('yyyy-mm-dd')
    expect(functionWithFormat('2008-09-07')).toEqual(expectedResult)
  })
})

describe('trimSpace', () => {
  test('undefined input', () => {
    const expectedResult = ''
    expect(formFunctions.trimSpace(undefined)).toEqual(expectedResult)
  })
  it('trims space', () => {
    const expectedResult = 'abcdef'
    expect(formFunctions.trimSpace('abc def')).toEqual(expectedResult)
  })
})

describe('trimSlash', () => {
  test('undefined input', () => {
    const expectedResult = ''
    expect(formFunctions.trimSlash(undefined)).toEqual(expectedResult)
  })
  it('trims slash', () => {
    const expectedResult = 'abcdef'
    expect(formFunctions.trimSlash('abc/def')).toEqual(expectedResult)
  })
})

describe('getChildFieldIndex', () => {
  it('returns the index', () => {
    const initialProps = {
      parties: [{ name: 'Counterparty' }]
    }
    expect(
      formFunctions.getChildFieldIndex('parties', 'Counterparty', initialProps)
    ).toEqual(0)
    expect(
      formFunctions.getChildFieldIndex('parties', 'Counterparty', [])
    ).toEqual(-1)
  })
})

describe('addOrRemoveChildField', () => {
  let props
  beforeEach(() => {
    props = {
      array: {
        remove: jest.fn(),
        push: jest.fn()
      },
      rates: [{ name: 'rate1' }, { name: 'rate2' }, { name: 'rate3' }]
    }
  })
  it('removes', () => {
    formFunctions.addOrRemoveChildField(props, props)('rates')('rate2')(
      'remove'
    )
    expect(props.array.remove).toHaveBeenCalledWith('rates', 1)
  })

  it('adds', () => {
    formFunctions.addOrRemoveChildField(props, props)('rates')('rate8')('add')
    expect(props.array.push).toHaveBeenCalledWith('rates', { name: 'rate8' })
  })

  it('adds safely', () => {
    formFunctions.addOrRemoveChildField(props, props)('rates')('rate3')('add', {
      rateValue: '10'
    })
    expect(props.array.remove).toHaveBeenCalledWith('rates', 2)
    expect(props.array.push).toHaveBeenCalledWith('rates', {
      name: 'rate3',
      rateValue: '10'
    })
  })
})

describe('getPrimaryChild', () => {
  it('returns the primary child', () => {
    const children = {
      Primary: { referenceValue: '1', referencePrimary: true },
      nonPrimary: { referenceValue: '2', referencePrimary: false }
    }
    const expectedResult = { name: 'Primary', ...children.Primary }
    expect(formFunctions.getPrimaryChild(children, 'referencePrimary')).toEqual(
      expectedResult
    )
  })
})

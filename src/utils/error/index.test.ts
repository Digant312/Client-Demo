import { parseError } from './'

describe('parseError', () => {
  it('extracts response body message', () => {
    const error = { response: { body: { Message: 'test error' } } }
    const expectedResult = 'test error'
    expect(parseError(error)).toEqual(expectedResult)
  })

  it('extracts message', () => {
    const error = new Error('error object error')
    const expectedResult = 'error object error'
    expect(parseError(error)).toEqual(expectedResult)
  })

  it('returns null otherwise', () => {
    const error = {}
    expect(parseError(error)).toBeNull()
  })
})

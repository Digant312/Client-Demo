import * as routerFuncs from './'

describe('removeTrailingSlash', () => {
  it('removes trailing slash if present', () => {
    const expectedResult = '/some/path/url'
    expect(routerFuncs.removeTrailingSlash('/some/path/url/')).toEqual(expectedResult)
  })

  it('preserves string if no trailing slash', () => {
    const expectedResult = '/some/path/url'
    expect(routerFuncs.removeTrailingSlash('/some/path/url')).toEqual(expectedResult)
  })
})
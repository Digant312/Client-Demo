import { flattenMessages } from './'

describe('flattenMessages', () => {
  it('should flatten a nested structure', () => {
    const initialObject = {
      foo: 'bar',
      hello: {
        world: 'Hello World'
      }
    }
    const expectedResult = {
      'foo': 'bar',
      'hello.world': 'Hello World'
    }
    expect(flattenMessages(initialObject)).toEqual(expectedResult)
  })
})
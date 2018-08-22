import React from 'react'
import { mount } from 'enzyme'

import accordionBuilder from './accordionBuilder'

const options = [
  { title: 'Trader 1', content: [{ content: 'Book 1' }] },
  { title: 'Trader 2' }
]

const mockedBuildTree = jest.fn(() => {
  return [{ content: 'Book 1' }]
})
const MockComponent = () => <div>Mock</div>

describe('accordionBuilder', () => {
  let Result
  beforeAll(() => {
    Result = accordionBuilder(options, jest.fn(), true)
  })
  it('maps', () => {
    expect(Result.length).toEqual(2)
  })

  it('returns AccordionWrappers', () => {
    const Acc = Result[0]
    const Comp = Acc.type
    const wrapper = mount(
      <Comp>{({ activeIndex, handleChangeIndex }) => <MockComponent />}</Comp>
    )
    expect(wrapper.find('AccordionWrapper')).toHaveLength(1)
  })
})

import React from 'react'
import { shallow } from 'enzyme'

import AccordionWrapper from './'

// Set up a mock component that calls handleActiveIndex
// and test that invoking this function changes the state
const MockWrappedContent = (props: any) => (
  <button onClick={(e: any) => props.handleClick(e, { index: props.index })}>
    Click
  </button>
)

describe('AccordionWrapper', () => {
  let wrapper

  // Setup
  beforeAll(() => {
    wrapper = shallow(
      <AccordionWrapper>
        {({ activeIndex, handleChangeIndex }) => (
          <MockWrappedContent index={0} handleClick={handleChangeIndex} />
        )}
      </AccordionWrapper>
    )
  })

  // Reset state
  afterEach(() => {
    wrapper.setState({ activeIndex: -1 })
  })

  it('sets state', () => {
    expect(wrapper.state().activeIndex).toEqual(-1)
    wrapper.instance().handleChangeActiveIndex('', { index: 8 })
    expect(wrapper.state().activeIndex).toEqual(8)
  })
  it('sets state from child', () => {
    const wrapped = wrapper.find('MockWrappedContent').dive()
    expect(wrapper.state().activeIndex).toEqual(-1)
    wrapped.find('button').simulate('click')
    expect(wrapper.state().activeIndex).toEqual(0)
  })
})

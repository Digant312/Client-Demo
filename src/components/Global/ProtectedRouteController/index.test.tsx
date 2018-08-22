import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter, Redirect, Route } from 'react-router-dom'

import ProtectedRouteController from './'

const mockComp = () => <div>Component</div>

describe('ProtectedRoute Component', () => {
  it('should render a single Route component', async () => {
    const wrapper = await mount(<MemoryRouter><Route render={props => <ProtectedRouteController path='/test-path' component={mockComp} authenticated={false} {...props} />} /></MemoryRouter>)
    expect(wrapper.find('Route').length).toEqual(2)
    const props = wrapper.find('Route').at(1).props() as any
    expect(props.path).toEqual('/test-path')
  })

  it('should render the component if authenticated is true', async () => {
    const wrapper = await mount(<MemoryRouter><Route render={props => <ProtectedRouteController component={mockComp} authenticated={true} {...props} />} /></MemoryRouter>)
    expect(wrapper.find('Redirect').length).toEqual(0)
    expect(wrapper.find('div').text()).toEqual('Component')
  })

  // There was previously a test to check that Redirect was mounted, but since React Router v4.2 this has proved impossible to test.
  // Shallow mounting the component results in an endless loop because it continually redirects the unauthenticated 'user' away.
  // Since this test (and the one above) is actually testing the render method of Route, it is not strictly necessary since this
  // we can assume the library is well-tested.
})

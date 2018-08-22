import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'

import PublicRouteController from './'

const mockComp = () => <div>Component</div>

describe('PublicRouteController Component', () => {
  it('should render a single Route component', async () => {
    const wrapper = await mount(<MemoryRouter><PublicRouteController component={mockComp} authenticated={false} path='/test-path' /></MemoryRouter>)
    expect(wrapper.find('Route').length).toEqual(1)
    const props = wrapper.find('Route').props() as any
    expect(props.path).toEqual('/test-path')
  })

  it('should render the component if authenticated is false', async () => {
    const wrapper = await mount(<MemoryRouter><PublicRouteController component={mockComp} authenticated={false} /></MemoryRouter>)
    expect(wrapper.find('Redirect').length).toEqual(0)
    expect(wrapper.find('div').text()).toEqual('Component')
  })

  it('should render the Redirect component if authenticated is true', async () => {
    const wrapper = await mount(<MemoryRouter initialEntries={['/a-p']}><PublicRouteController component={mockComp} authenticated={true} /></MemoryRouter>)
    expect(wrapper.find('Redirect').length).toEqual(1)
    expect(wrapper.find('div').length).toEqual(0)
  })
})

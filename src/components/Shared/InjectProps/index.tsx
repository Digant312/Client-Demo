import React from 'react'

export default <P extends {}>(props: any) => (WrappedComponent: React.ComponentType) => {
  class InjectedComponent extends React.Component<P, any> {
    render() {
      return <WrappedComponent {...props} {...this.props} />
    }
  }
  return InjectedComponent
}
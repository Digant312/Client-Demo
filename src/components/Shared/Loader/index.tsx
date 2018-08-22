import React from 'react'

import './styles.scss'

interface ILoadingProps {
  text?: string
  delay?: number
}

interface ILoadingState {
  timedOut: boolean
}

export default class Loading extends React.Component<ILoadingProps, ILoadingState> {
  mounted: boolean
  constructor(props: ILoadingProps) {
    super(props)
    this.state = {
      timedOut: props.delay ? false : true
    }
  }
  componentDidMount() {
    this.mounted = true
    if (this.props.delay) {
      setTimeout(() => {
        if (this.mounted) this.setState({ timedOut: true })
      }, this.props.delay)
    }
  }
  componentWillUnmount() {
    this.mounted = false
  }
  render() {
    const { text } = this.props
    const { timedOut } = this.state
    if (timedOut) {
      return <div className='argomi-loader-container'>
        <div className='argomi-logo-container'>
          <div className='argomi-logo-col argomi-logo-col-1'></div>
          <div className='argomi-logo-col argomi-logo-col-2'></div>
          <div className='argomi-logo-col argomi-logo-col-3'></div>
          <div className='argomi-logo-col argomi-logo-col-4'></div>
          <div className='argomi-logo-col argomi-logo-col-5'></div>
        </div>
        <br />
        {text || ''}
      </div>
    } else return null
  }
}
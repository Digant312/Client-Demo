import React from 'react'
import { AccordionTitleProps } from 'semantic-ui-react'

interface IAccordionWrapperProps {
  children: (
    {
      activeIndex,
      handleChangeIndex
    }: {
      activeIndex: string | number
      handleChangeIndex: (
        e: React.SyntheticEvent<any>,
        titleProps: AccordionTitleProps
      ) => void
    }
  ) => JSX.Element
}

interface IAccordionWrapperState {
  activeIndex: string | number
}

// This HoC is designed to be used with the Accordion Component from Semantic UI React,
// after it was refactored with breaking changes v0.73 -> v0.74 (it became a fully controlled
// component). Use this with a function as a child and wrap the original implementation,
// using activeIndex to set the active state and passing handleChangeIndex to onClick.

export default class AccordionWrapper extends React.Component<
  IAccordionWrapperProps,
  IAccordionWrapperState
> {
  constructor() {
    super()
    this.state = { activeIndex: -1 }
    this.handleChangeActiveIndex = this.handleChangeActiveIndex.bind(this)
  }

  handleChangeActiveIndex(
    e: React.SyntheticEvent<any>,
    titleProps: AccordionTitleProps
  ) {
    const { index } = titleProps
    if (index === undefined) return
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index
    this.setState({ activeIndex: newIndex })
  }

  render() {
    const { activeIndex } = this.state
    return this.props.children({
      activeIndex,
      handleChangeIndex: this.handleChangeActiveIndex
    })
  }
}

import React from 'react'
import { Accordion, Button, Icon, Sidebar } from 'semantic-ui-react'
import {
  defineMessages,
  FormattedMessage,
  injectIntl,
  InjectedIntlProps
} from 'react-intl'

import Loader from 'components/Shared/Loader'

import './styles.scss'

interface IAccordionContentProps {
  options: any
  visible: boolean
  toggleBookSelector: Function
  assumedAMID: string
  darkProfile: boolean
  booksFetching: boolean
  fetchBooks: () => void
}

interface IOptions {
  title?: string
  content: any
}

const messages = defineMessages({
  bookSelector: {
    id: 'bookSelector.bookSelector',
    defaultMessage: 'Book Selector'
  },
  selectAll: {
    id: 'bookSelector.selectAll',
    defaultMessage: 'Select All'
  },
  clearAll: {
    id: 'bookSelector.clearAll',
    defaultMessage: 'Clear All'
  },
  loading: {
    id: 'bookSelector.loading',
    defaultMessage: 'Loading Book Selector'
  }
})

class AccordionContent extends React.Component<
  IAccordionContentProps & InjectedIntlProps,
  { builder?: Function }
> {
  constructor() {
    super()
    this.state = {}
  }
  componentDidMount() {
    this.props.fetchBooks()
    import(/* webpackChunkName: 'accordionBuilder' */ './accordionBuilder').then(
      res => {
        this.setState({
          builder: res.default
        })
      }
    )
  }

  componentWillReceiveProps(
    nextProps: IAccordionContentProps & InjectedIntlProps
  ) {
    if (this.props.assumedAMID != nextProps.assumedAMID) {
      this.props.fetchBooks()
    }
  }

  render() {
    const {
      booksFetching,
      darkProfile,
      visible,
      options,
      toggleBookSelector,
      intl
    } = this.props
    const { builder } = this.state
    return (
      <Sidebar
        as={Accordion}
        animation="push"
        visible={visible}
        width="wide"
        inverted={darkProfile}
      >
        <div className="book-selector-heading">
          <FormattedMessage {...messages.bookSelector} />
        </div>
        <div className="book-selector-all-btn">
          <Button
            onClick={() => toggleBookSelector({ type: 'selectAll' })}
            inverted={darkProfile}
          >
            <FormattedMessage {...messages.selectAll} />
          </Button>
        </div>
        <hr />
        {builder && !booksFetching ? (
          builder(options, toggleBookSelector, darkProfile)
        ) : (
          <Loader delay={200} />
        )}
        <hr />
        <div className="book-selector-all-btn">
          <Button
            onClick={() => toggleBookSelector({ type: 'deselectAll' })}
            inverted={darkProfile}
          >
            <FormattedMessage {...messages.clearAll} />
          </Button>
        </div>
      </Sidebar>
    )
  }
}

export default injectIntl(AccordionContent)

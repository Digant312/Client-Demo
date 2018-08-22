import React from 'react'
import { render } from 'react-dom'
import BookForm from 'containers/Protected/Core/Books/BookForm'
import { Button } from 'semantic-ui-react'
import { FormattedMessage, injectIntl } from 'react-intl'
import messages from './BooksStrings'

// BookHeader component contain AddBook button and AddBook form
class BookHeader extends React.Component<any, { headerFormVisible: boolean }> {
  constructor(props: any) {
    super(props)
    this.state = {
      headerFormVisible: props.headerFormVisible
    }
    this.handleAddBookClick = this.handleAddBookClick.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleAddBookSubmit = this.handleAddBookSubmit.bind(this)
  }

  getInitialState() {
    return { headerFormVisible: this.props.headerFormVisible }
  }

  componentWillReceiveProps(nextProps: any) {
    this.setState({ headerFormVisible: nextProps.headerFormVisible })
  }

  handleAddBookClick() {
    this.setState({ headerFormVisible: true })
    this.props.formOpened()
  }

  handleCancel() {
    this.setState({ headerFormVisible: false })
    this.props.formClosed()
  }

  handleAddBookSubmit(values: any) {
    this.props.handleAddBook(values)
  }

  render() {
    var headerState
    this.state.headerFormVisible
      ? (headerState = 'open-addform')
      : (headerState = 'default')

    switch (headerState) {
      case 'open-addform':
        return (
          <div className="top-header">
            <BookForm
              submitButtonLabel={this.props.intl.formatMessage(
                messages.addButtonLabel
              )}
              cancelButtonLabel={this.props.intl.formatMessage(
                messages.cancelButtonLabel
              )}
              callbackOnCancel={this.handleCancel}
              onSubmit={this.handleAddBookSubmit}
              darkProfile={this.props.darkProfile}
              loader={this.props.loader}
              formData={this.props.formData}
            />
          </div>
        )
      default:
        return (
          <div className="top-header">
            <Button
              onClick={this.handleAddBookClick}
              className="top-header-btn"
              disabled={this.props.gridRowExpanded}
              color="green"
            >
              {this.props.addBookButtonLabel}
            </Button>
          </div>
        )
    }
  }
}

export default injectIntl(BookHeader)

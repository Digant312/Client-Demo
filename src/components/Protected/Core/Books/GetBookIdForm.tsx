import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Label, Form, Grid, Segment } from 'semantic-ui-react'
import { Field, reduxForm } from 'redux-form'
import startCase from 'lodash/startCase'

import Input from 'containers/Shared/CompactInput/'
import Dropdown from 'containers/Shared/Dropdown'
import messages from './BooksStrings'
import { required, hasSpace } from 'utils/form'
const bookIdNoSpace = hasSpace('Book Name')
import CurrencyDropdown from 'containers/Shared/CurrencyDropdown'
import FormBuilder from 'components/Shared/FormBuilder'
//import formConfig from './FormConfig'

const BookStatusOptions = [
  { key: 'active', text: 'Active', value: 'Active' },
  { key: 'inactive', text: 'Inactive', value: 'Inactive' }
]

class GetBookIdForm extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      currentSelection: '',
      bookIdArray: ''
    }
    this.handleSelectBookId = this.handleSelectBookId.bind(this)
  }

  handleSelectBookId(e: any, selectedBookId: string) {
    if (this.state.currentSelection != selectedBookId) {
      this.props.handleSelectBookId(selectedBookId)
      this.setState({ currentSelection: selectedBookId })
    }
  }

  componentDidMount() {
    if (this.props.books !== undefined) {
      const BookArr = this.props.books
      const filteredBookArr = BookArr.filter(
        (book: any) =>
          book.bookType.toLowerCase() !== 'counterparty' &&
          book.bookType.toLowerCase() !== 'wash'
      )
      const dateWiseFilteredArray = filteredBookArr.sort(function(
        a: any,
        b: any
      ) {
        return b.createdTime.localeCompare(a.createdTime)
      })
      this.props.initialize({
        bookId: dateWiseFilteredArray[0].bookId
      })
      var bookIdArray: any = filteredBookArr.map((book: any) => {
        return {
          key: book.bookId,
          text: book.bookId,
          value: book.bookId
        }
      })
      // sort by bookId name
      bookIdArray.sort(function(a: any, b: any) {
        var textA = a.text.toUpperCase()
        var textB = b.text.toUpperCase()
        if (textA < textB) {
          return -1
        }
        if (textA > textB) {
          return 1
        }
        return 0
      })
      this.setState({ bookIdArray: bookIdArray })
    }
  }

  render() {
    const {
      darkProfile,
      handleSubmit,
      pristine,
      reset,
      submitting,
      initialized,
      books
    } = this.props

    return (
      <div>
        <Form onSubmit={handleSubmit} inverted={darkProfile}>
          <Segment basic inverted={darkProfile} style={{ maxWidth: '320px' }}>
            <Field
              name="bookId"
              component={Dropdown}
              options={this.state.bookIdArray}
              compact
              onChange={this.handleSelectBookId}
              placeholder="Select a Book"
            />
          </Segment>
        </Form>
      </div>
    )
  }
}

export default reduxForm({
  form: 'bookId-form' // a unique identifier for this form
})(GetBookIdForm)

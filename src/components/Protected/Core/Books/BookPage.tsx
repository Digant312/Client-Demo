import React, { Component } from 'react'
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl'
import { Redirect, Route, RouteComponentProps } from 'react-router-dom'
import { Label, Form, Grid, Segment } from 'semantic-ui-react'
import { Field, reduxForm } from 'redux-form'
import BookForm from 'containers/Protected/Core/Books/BookForm'

import { api, books } from '@amaas/amaas-core-sdk-js'
import {
  successToast,
  errorToast
} from 'components/Shared/ArgomiToastContainer'
import { parseError } from 'utils/error'

export interface IBookPageProps {
  bookId: string
  books: books.Book[] // change equities to fx or futures
  fetching: boolean
  fetchError: string
  darkProfile: boolean
  assumedAMID: string
  assetManagerId: string
  fetchBooks: () => void
}

interface IBookPageState {
  loadingData: boolean
  formData: any
}

class BookPage extends React.Component<
  IBookPageProps & InjectedIntlProps & RouteComponentProps<any>,
  IBookPageState
> {
  constructor(
    props: IBookPageProps & InjectedIntlProps & RouteComponentProps<any>
  ) {
    super(props)
    this.state = {
      loadingData: true,
      formData: {}
    }
    this.filterConfig = this.filterConfig.bind(this)
    this.handleAddBookSubmit = this.handleAddBookSubmit.bind(this)
  }

  componentDidMount() {
    this.props.fetchBooks()
    this.setState({ formData: {} })
    if (this.props.books.length > 0) {
      const bookData: any = this.filterConfig(
        this.props.books,
        this.props.match.params.bookId
      )
      this.setState({ formData: bookData, loadingData: false })
    }
  }

  componentWillReceiveProps(nextProps: any) {
    if (this.props.books.length === 0 && nextProps.books.length > 0) {
      const bookData: any = this.filterConfig(
        nextProps.books,
        nextProps.match.params.bookId
      )
      this.setState({ formData: bookData, loadingData: false })
    }
  }

  filterConfig = (bookArray: any, filterId: string) => {
    var bookData: any = ''
    bookArray.map((book: any) => {
      if (book.bookId == filterId) {
        bookData = book
      }
    })
    return bookData
  }

  handleAddBookSubmit(values: any) {
    console.log('values in submit method: ')
    console.log(values)
  }

  render() {
    const { assumedAMID, darkProfile } = this.props
    const bookId = this.props.match.params.bookId
    return (
      <div>
        <Segment inverted={darkProfile} basic loading={this.state.loadingData}>
          <BookForm
            submitButtonLabel="Submit"
            hideCancelButton={true}
            onSubmit={this.handleAddBookSubmit}
            darkProfile={this.props.darkProfile}
            loader={this.state.loadingData}
            formData={this.state.formData}
            readOnlyField="bookId"
          />
        </Segment>
      </div>
    )
  }
}

export default BookPage

import React, { Component } from 'react'
import isEmpty from 'lodash/isEmpty'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Label, Form, Grid, Segment } from 'semantic-ui-react'
import { Field, reduxForm } from 'redux-form'
import startCase from 'lodash/startCase'
import Input from 'containers/Shared/CompactInput/'
import Dropdown from 'containers/Shared/Dropdown'
import messages from './BooksStrings'
import { required, hasSpace } from 'utils/form'
const bookIdNoSpace = hasSpace('Book Name')
import CurrencyDropdown from 'containers/Shared/CurrencyDropdown'
import FormBuilder from 'containers/Shared/FormBuilder'
import { IConfigInterface } from 'components/Shared/FormBuilder'
import bookFormConfig from 'utils/form/BookConfig'
import { api, books, parties } from '@amaas/amaas-core-sdk-js'
import {
  successToast,
  errorToast
} from 'components/Shared/ArgomiToastContainer'
import { parseError } from 'utils/error'

// arrays contain dropdown option data
const BookStatusOptions = [
  { key: 'active', text: 'Active', value: 'Active' },
  { key: 'inactive', text: 'Inactive', value: 'Inactive' }
]

// BookForm component creates Book form
class BookForm extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      retired: false,
      loadingData: true,
      partyFilter: undefined
    }

    this.filterConfig = this.filterConfig.bind(this)
  }
  componentDidMount() {
    if (!this.props.formData || isEmpty(this.props.formData)) {
      this.setState({ loadingData: false })
      return
    }
    if (
      this.props.assumedAMID &&
      this.props.assumedAMID != this.props.formData.assetManagerId
    ) {
      this.setState({ readOnlyMode: true })
    }
    const { bookId, assetManagerId } = this.props.formData
    if (bookId && (assetManagerId || assetManagerId === 0)) {
      let promise = api.Books.retrieve({
        AMId: assetManagerId || parseInt(this.props.assumedAMID),
        resourceId: bookId
      }) as Promise<any[]>
      promise
        .then((res: any) => {
          this.props.initialize && this.props.initialize(res)
          this.setState({ loadingData: false })
        })
        .catch(err => {
          // handle the error
          errorToast(parseError(err) || 'error')
          console.log(err)
          this.setState({ loadingData: false })
        })
    } else {
      this.props.initialize && this.props.initialize(this.props.formData)
      this.setState({ loadingData: false })
    }
  }

  componentWillReceiveProps(nextProps: any) {
    const { partyTypes } = parties.utils
    if (nextProps.formData !== undefined) {
      if (nextProps.formData.bookStatus == 'Retired') {
        this.setState({ retired: true })
      } else {
        this.setState({ retired: false })
      }
    }

    if (nextProps.bookData !== undefined) {
      nextProps.bookData.bookType !== 'Counterparty'
        ? this.setState({
            partyFilter: {
              partyType: partyTypes.filter(
                (partyType: string) =>
                  partyType !== 'Broker' && partyType !== 'Exchange'
              )
            }
          })
        : this.setState({ partyFilter: { partyType: partyTypes } })
    }

    if (
      Object.keys(this.props.formData).length == 0 &&
      Object.keys(nextProps.formData).length > 0
    ) {
      if (
        this.props.assumedAMID &&
        this.props.assumedAMID != nextProps.formData.assetManagerId
      ) {
        this.setState({ readOnlyMode: true })
      }
      nextProps.initialize && nextProps.initialize(nextProps.formData)
    }
  }

  filterConfig(
    formConfig: any,
    filterId: string,
    changeId: string,
    changeValue: boolean
  ) {
    let formDataArray, formData: any
    const { partyFilter } = this.state
    formDataArray = formConfig(partyFilter)
    return formDataArray.map((formDataObject: IConfigInterface) => {
      if (formDataObject.name == filterId) {
        return { ...formDataObject, [changeId]: changeValue }
      }
      return formDataObject
    })
  }

  render() {
    const {
      darkProfile,
      handleSubmit,
      pristine,
      reset,
      submitting,
      initialized
    } = this.props

    let formConfig: any

    if (this.props.uniqueColumnId === undefined) {
      const temp = this.filterConfig(
        bookFormConfig,
        'bookId',
        'readOnly',
        false
      )
      formConfig = temp
    } else {
      const temp = this.filterConfig(bookFormConfig, 'bookId', 'readOnly', true)
      formConfig = temp
    }

    if (this.props.readOnlyField !== undefined) {
      const temp = this.filterConfig(
        bookFormConfig,
        this.props.readOnlyField,
        'readOnly',
        true
      )
      formConfig = temp
    }

    return (
      <div className="sub-component-container">
        <Segment inverted={darkProfile} basic loading={this.state.loadingData}>
          <Form
            className="semantic-form"
            onSubmit={handleSubmit}
            inverted={darkProfile}
          >
            <Segment.Group size="tiny">
              <Segment inverted={darkProfile}>
                <FormBuilder
                  formConfig={formConfig}
                  columnNumber={2}
                  readOnly={this.state.readOnlyMode}
                />
              </Segment>
              <Segment inverted={darkProfile}>
                <Grid columns={2} divided>
                  <Grid.Row>
                    <div className="form-button-container">
                      {this.props.uniqueColumnId !== undefined &&
                      !this.state.readOnlyMode ? (
                        <Form.Button
                          primary
                          type="button"
                          onClick={reset}
                          disabled={this.props.pristine || submitting}
                        >
                          {this.props.intl.formatMessage(messages.reset)}
                        </Form.Button>
                      ) : null}
                      {this.props.hideCancelButton ? null : (
                        <Form.Button
                          negative
                          type="cancel"
                          onClick={this.props.callbackOnCancel}
                        >
                          {this.props.cancelButtonLabel}
                        </Form.Button>
                      )}
                      {!this.state.readOnlyMode ? (
                        <Form.Button
                          positive
                          type="submit"
                          disabled={this.props.pristine || this.state.retired}
                        >
                          {this.props.submitButtonLabel}
                        </Form.Button>
                      ) : null}
                    </div>
                  </Grid.Row>
                </Grid>
              </Segment>
            </Segment.Group>
          </Form>
        </Segment>
      </div>
    )
  }
}

const IntlBookForm = injectIntl(BookForm)

export default reduxForm({
  form: 'book-form' // a unique identifier for this form
})(IntlBookForm)

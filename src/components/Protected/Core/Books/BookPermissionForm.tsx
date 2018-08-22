import React, { Component } from 'react'
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl'
import { Label, Form, Grid, Segment, Button } from 'semantic-ui-react'
import { Field, reduxForm, FormProps, change } from 'redux-form'

import Input from 'containers/Shared/CompactInput/'
import RadioCheckBox from 'components/Shared/RadioCheckBox'
import { bookPermissionConfig } from 'utils/form/BookConfig'
import FormBuilder from 'containers/Shared/FormBuilder'

var modifiedRowData: any = {}
// BookForm component creates Book form

export interface IBookPermissionFormContainerProps {
  rowData: any
  darkProfile: boolean
  onCancel: any
  onSubmit: any
  initialize: any
  assumedAMID: number
  assetManagerId: number
  fetching: boolean
  permissionRead: boolean
  permissionWrite: boolean
  permissionNone: boolean
  fetchBookPermissions: any
  initialized: any
  HeadingText: string
}

interface IBookPermissionFormContainerState {}

class BookPermissionForm extends React.Component<
  IBookPermissionFormContainerProps &
    FormProps<{}, any, any> &
    InjectedIntlProps,
  IBookPermissionFormContainerState
> {
  constructor(props: any) {
    super(props)
    this.setPermission = this.setPermission.bind(this)
  }

  componentDidMount() {
    var rowData: any
    rowData = this.props.rowData
    const permission = rowData.permission
    var permissionWrite = { permissionWrite: false }
    var permissionRead = { permissionRead: false }
    var permissionNone = { permissionNone: false }
    modifiedRowData = {
      ...rowData,
      ...permissionWrite,
      ...permissionRead,
      ...permissionNone
    }
    this.setPermission(modifiedRowData, modifiedRowData.permission)
    this.props.initialize && this.props.initialize(modifiedRowData)
  }

  setPermission(modifiedRowData: any, permission: any) {
    if (modifiedRowData.permission.toLowerCase() === 'read') {
      modifiedRowData.permissionRead = true
    } else if (modifiedRowData.permission.toLowerCase() === 'write') {
      modifiedRowData.permissionWrite = true
    } else if (modifiedRowData.permission.toLowerCase() === 'none') {
      modifiedRowData.permissionNone = true
    }
  }

  componentWillReceiveProps(nextProps: any) {
    if (this.props.permissionRead === false && nextProps.permissionRead) {
      nextProps.change('permissionRead', true)
      nextProps.change('permissionWrite', false)
      nextProps.change('permissionNone', false)
      nextProps.change('permission', 'read')
    } else if (
      this.props.permissionWrite === false &&
      nextProps.permissionWrite
    ) {
      nextProps.change('permissionRead', false)
      nextProps.change('permissionWrite', true)
      nextProps.change('permissionNone', false)
      nextProps.change('permission', 'write')
    } else if (
      this.props.permissionNone === false &&
      nextProps.permissionNone
    ) {
      nextProps.change('permissionRead', false)
      nextProps.change('permissionWrite', false)
      nextProps.change('permissionNone', true)
      nextProps.change('permission', 'none')
    }
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
    const { user, bookId } = this.props.rowData
    return (
      <div className="">
        <Form className="" onSubmit={handleSubmit} inverted={darkProfile}>
          <Segment.Group size="tiny">
            <Segment inverted={darkProfile}>
              <h3> {this.props.HeadingText} </h3>
            </Segment>
            <Segment inverted={darkProfile}>
              <div className="column-inner-row">
                <div className="column-inner-column">
                  <h4>User</h4>
                </div>
                <div className="column-inner-column">
                  <h4>{user}</h4>
                </div>
              </div>
              <div className="column-inner-row">
                <div className="column-inner-column">
                  <h4>Book Name</h4>
                </div>
                <div className="column-inner-column">
                  <h4>{bookId}</h4>
                </div>
              </div>
              <h3>Permission</h3>
              <FormBuilder formConfig={bookPermissionConfig} columnNumber={1} />
            </Segment>
            <Segment inverted={darkProfile}>
              <div style={{ textAlign: 'right' }}>
                <Button
                  negative
                  type="reset"
                  onClick={this.props.onCancel}
                  style={{ display: 'inline-block', marginRight: '15px' }}
                >
                  Cancel
                </Button>
                <Button positive type="submit">
                  Submit
                </Button>
              </div>
            </Segment>
          </Segment.Group>
        </Form>
      </div>
    )
  }
}

export default reduxForm({
  form: 'book-permission-form' // a unique identifier for this form
})(BookPermissionForm)

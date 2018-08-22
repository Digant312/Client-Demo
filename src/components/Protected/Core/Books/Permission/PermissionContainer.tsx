import React from 'react'
import { render } from 'react-dom'
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl'
import { ToastContainer, toast } from 'react-toastify'
import { Header, Icon, Segment, Button } from 'semantic-ui-react'
import { Field, reduxForm, Form } from 'redux-form'
import startCase from 'lodash/startCase'
import Dropdown from 'containers/Shared/Dropdown'

import BookForm from 'containers/Protected/Core/Books/BookForm'
import GetBookIdForm from '../GetBookIdForm'
import {
  successToast,
  errorToast
} from 'components/Shared/ArgomiToastContainer'
import { parseError } from 'utils/error'
import messages from '../BooksStrings'
import ArgomiGrid from 'components/Shared/ArgomiGrid'
import FormDialogBox from 'components/Shared/FormDialogBox'
import { api, books } from '@amaas/amaas-core-sdk-js'
import { createAccessor } from 'utils/table'
import BookPermissionForm from 'containers/Protected/Core/Books/Permission/BookPermissionForm'

var columns = [
  {
    Header: 'User',
    accessor: 'name'
  },
  {
    Header: 'Book Name',
    accessor: 'bookId'
  },
  {
    Header: 'Permission',
    accessor: 'permission'
  }
]

export interface IPermissionContainerProps {
  assumedAMID: string
  assetManagerId: string
  fetching: boolean
  fetchPermissions: boolean
  books: books.Book[]
  permissions: books.BookPermission[]
  darkProfile: boolean
  fetchBooks: () => void
  fetchBookPermissions: (bookId: string) => void
}

interface IPermissionContainerState {
  data: books.Book[]
  headerFormVisible: boolean
  gridRowExpanded: boolean
  openModal: boolean
  editedBookId: string
  insertingOrUpdatingPermission: boolean
}

var bookPermissionEditForm: any
// BooksContainer is main component which contain BookHeader and BookGrid components
class PermissionContainer extends React.Component<
  IPermissionContainerProps & InjectedIntlProps,
  IPermissionContainerState
> {
  constructor(props: IPermissionContainerProps & InjectedIntlProps) {
    super(props)
    this.state = {
      data: props.permissions,
      headerFormVisible: false,
      gridRowExpanded: false,
      openModal: false,
      editedBookId: '',
      insertingOrUpdatingPermission: false
    }
    this.handleGridExpand = this.handleGridExpand.bind(this)
    this.handleGridCollapse = this.handleGridCollapse.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handlePopupSubmit = this.handlePopupSubmit.bind(this)
    this.handleClosePopup = this.handleClosePopup.bind(this)
    this.handleSelectBookId = this.handleSelectBookId.bind(this)
  }

  componentDidMount() {
    this.props.fetchBooks()
    if (this.props.books[0] !== undefined) {
      const filteredBookArr = this.props.books.filter(
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
      if (dateWiseFilteredArray[0].bookId !== undefined) {
        this.props.fetchBookPermissions(dateWiseFilteredArray[0].bookId)
      }
    }
  }

  componentWillReceiveProps(nextProps: any) {
    if (this.props.books !== nextProps.books) {
      if (this.props.books.length === 0 && nextProps.books.length > 0) {
        const filteredBookArr = nextProps.books.filter(
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
        if (dateWiseFilteredArray[0].bookId !== undefined) {
          nextProps.fetchBookPermissions(dateWiseFilteredArray[0].bookId)
        }
      }
    }
    if (nextProps.permissions) {
      this.setState({
        data: nextProps.permissions
      })
    }
  }

  // See handleAdd for explanations of the steps
  async handleUpdate(values: any) {
    successToast('Updated')
  }

  handleDelete(editedBookId: any, rowData: any) {
    bookPermissionEditForm = (
      <BookPermissionForm
        HeadingText="Change book permission"
        darkProfile={this.props.darkProfile}
        rowData={rowData}
        onCancel={this.handleClosePopup}
        onSubmit={this.handlePopupSubmit}
      />
    )
    this.setState({ openModal: true, editedBookId: editedBookId })
  }

  async handlePopupSubmit(values: any) {
    this.setState({ insertingOrUpdatingPermission: true })
    const assetManagerId = values.userAssetManagerId
    const AMId = values.assetManagerId
    const bookId: any = values.bookId

    try {
      switch (values.permission) {
        case 'read':
          await api.Books.readPermission({
            AMId,
            permissionId: values.permissionId,
            userAssetManagerId: parseInt(assetManagerId),
            bookId
          })
          break
        case 'write':
          await api.Books.writePermission({
            AMId,
            permissionId: values.permissionId,
            userAssetManagerId: parseInt(assetManagerId),
            bookId
          })
          break
        default:
          await api.Books.deactivatePermission({
            AMId,
            permissionId: values.permissionId,
            bookId
          })
      }
      this.props.fetchBookPermissions(values.bookId)
      successToast('Book Permission Updated')
    } catch (e) {
      console.log('error : ' + e)
      errorToast(
        parseError(e) || this.props.intl.formatMessage(messages.updateFailed)
      ) // fallback message
    } finally {
      this.setState({ insertingOrUpdatingPermission: false, openModal: false })
    }
  }

  handleClosePopup() {
    this.setState({ openModal: false })
  }

  handleSubmit() {}

  // CRUD methods : ENDS

  handleSelectBookId(selectedBookId: string) {
    this.props.fetchBookPermissions(selectedBookId)
  }

  render() {
    const { fetching, darkProfile } = this.props
    var actionButton = (
      <Button compact inverted size="tiny" color="green">
        <FormattedMessage {...messages.editPermissions} />
      </Button>
    )

    return (
      <div>
        <Segment basic inverted={darkProfile}>
          <GetBookIdForm
            darkProfile={this.props.darkProfile}
            books={this.props.books}
            handleSelectBookId={this.handleSelectBookId}
          />
          <div>
            <ArgomiGrid
              column={columns}
              data={this.state.data}
              deleteEnable={true}
              actionHeading="Edit"
              actionButton={actionButton}
              filterable={true}
              defaultPageSize={10} // As per react-table limitation number shouldn't be less than 5
              onGridUpdate={this.handleUpdate}
              onGridDelete={this.handleDelete}
              uniqueColumnId="bookId"
              loading={fetching}
              assumedAMID={this.props.assumedAMID}
            />
            <FormDialogBox
              HeadingText="Change Permission"
              dialogForm={bookPermissionEditForm}
              handlePopupSubmit={this.handlePopupSubmit}
              handleClosePopup={this.handleClosePopup}
              openModalProp={this.state.openModal}
              submitButtonLabel="Submit"
              cancelButtonLabel="Cancel"
              loader={this.state.insertingOrUpdatingPermission}
            />
          </div>
        </Segment>

        <ToastContainer />
      </div>
    )
  }

  // methods for top-down-approach communication b/w siblings
  handleGridExpand() {
    this.setState({ gridRowExpanded: true, headerFormVisible: false })
  }

  handleGridCollapse() {
    this.setState({ gridRowExpanded: false })
  }
}

export default injectIntl(PermissionContainer)

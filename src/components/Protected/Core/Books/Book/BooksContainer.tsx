import React from 'react'
import { render } from 'react-dom'
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl'
import BookForm from 'containers/Protected/Core/Books/BookForm'
import BookHeader from '../BookHeader'
import { Button, Header, Icon, Segment } from 'semantic-ui-react'
// import { toast } from 'react-toastify'
import ToastContainer, {
  successToast,
  errorToast
} from 'components/Shared/ArgomiToastContainer'
import { parseError } from 'utils/error'
import messages from '../BooksStrings'
import fieldMessages from 'utils/form/BookConfig/messages'
import ArgomiGrid from 'components/Shared/ArgomiGrid'
import ConfirmDialogBox from 'components/Shared/ConfirmDialogBox'
import { api, books } from '@amaas/amaas-core-sdk-js'

var columns = [
  {
    Header: <FormattedMessage {...fieldMessages.bookId} />,
    accessor: 'bookId'
  },
  {
    Header: <FormattedMessage {...fieldMessages.description} />,
    accessor: 'description'
  },
  {
    Header: <FormattedMessage {...fieldMessages.bookType} />,
    accessor: 'bookType'
  },
  {
    Header: <FormattedMessage {...fieldMessages.partyId} />,
    accessor: 'partyName'
  },
  {
    Header: <FormattedMessage {...fieldMessages.ownerId} />,
    accessor: 'ownerName'
  },
  {
    Header: <FormattedMessage {...fieldMessages.businessUnit} />,
    accessor: 'businessUnit'
  },
  {
    Header: <FormattedMessage {...fieldMessages.baseCurrency} />,
    accessor: 'baseCurrency'
  },
  {
    Header: <FormattedMessage {...fieldMessages.closeTime} />,
    accessor: 'closeTime'
  },
  {
    Header: <FormattedMessage {...fieldMessages.timezone} />,
    accessor: 'timezone'
  },
  {
    Header: <FormattedMessage {...fieldMessages.bookStatus} />,
    accessor: 'bookStatus'
  }
]

export interface IBooksContainerProps {
  assumedAMID: string
  assetManagerId: string
  fetching: boolean
  books: books.Book[]
  darkProfile: boolean
  fetchBooks: () => void
}

interface IBooksContainerState {
  data: books.Book[]
  insert: boolean
  headerFormVisible: boolean
  gridRowExpanded: boolean
  openModal: boolean
  retiredBookId: string
  insertingOrUpdatingBook: boolean
  bookStatus: string
  formData: any
}

// BooksContainer is main component which contain BookHeader and BookGrid components
class BooksContainer extends React.Component<
  IBooksContainerProps & InjectedIntlProps,
  IBooksContainerState
> {
  constructor(props: IBooksContainerProps & InjectedIntlProps) {
    super(props)
    this.state = {
      data: props.books,
      insert: false,
      headerFormVisible: false,
      gridRowExpanded: false,
      openModal: false,
      retiredBookId: '',
      insertingOrUpdatingBook: false,
      bookStatus: '',
      formData: null
    }
    this.handleGridExpand = this.handleGridExpand.bind(this)
    this.handleGridCollapse = this.handleGridCollapse.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleConfirmYes = this.handleConfirmYes.bind(this)
    this.handleConfirmNo = this.handleConfirmNo.bind(this)
    this.getDefaultAddFormValue = this.getDefaultAddFormValue.bind(this)
    this.formOpened = this.formOpened.bind(this)
    this.formClosed = this.formClosed.bind(this)
  }

  componentDidMount() {
    this.props.fetchBooks()
  }

  componentWillReceiveProps(nextProps: any) {
    if (nextProps.books) {
      this.setState({
        data: nextProps.books
      })
    }
    if (nextProps.assumedAMID != this.props.assumedAMID) {
      this.props.fetchBooks()
    }
    if (this.props.assumedAMID && this.props.assumedAMID !== undefined) {
      this.getDefaultAddFormValue()
    }
  }

  // CRUD methods : STARTS
  async handleAdd(values: any) {
    this.setState({ insertingOrUpdatingBook: true, headerFormVisible: true })
    const { assetManagerId, assumedAMID } = this.props
    // build the book
    const book = new books.Book({
      ...values,
      assetManagerId: parseInt(assumedAMID), // ensure int
      ownerId: values.ownerId
    })
    try {
      // All API methods return promises, so we make use of async/await
      await api.Books.insert({ AMId: parseInt(assumedAMID), book })
      this.setState({ headerFormVisible: false })
      this.props.fetchBooks()
      successToast(this.props.intl.formatMessage(messages.addSuccess))
    } catch (e) {
      console.error(parseError(e))
      errorToast(
        parseError(e) || this.props.intl.formatMessage(messages.addFailed)
      )
    } finally {
      this.setState({ insertingOrUpdatingBook: false })
    }
  }

  // See handleAdd for explanations of the steps
  async handleUpdate(values: any) {
    this.setState({ insertingOrUpdatingBook: true })
    const { assetManagerId, assumedAMID } = this.props
    const book = new books.Book({
      ...values,
      assetManagerId: parseInt(assumedAMID),
      ownerId: values.ownerId
    })
    try {
      await api.Books.amend({
        AMId: parseInt(assumedAMID),
        resourceId: book.bookId,
        book
      })
      this.props.fetchBooks()
      successToast(this.props.intl.formatMessage(messages.updateSuccess))
    } catch (e) {
      console.log('error : ' + e)
      errorToast(
        parseError(e) || this.props.intl.formatMessage(messages.updateFailed)
      ) // fallback message
    } finally {
      this.setState({ insertingOrUpdatingBook: false })
    }
  }

  async getDefaultAddFormValue() {
    const { assumedAMID } = this.props
    try {
      const assetManagerDetail = await api.AssetManagers.retrieve({
        AMId: parseInt(assumedAMID)
      })
      const {
        defaultBookOwnerId,
        defaultTimezone,
        defaultBookCloseTime
      } = assetManagerDetail
      var formData = {
        ownerId: defaultBookOwnerId,
        timezone: defaultTimezone,
        closeTime: defaultBookCloseTime
      }
      this.setState({ formData: formData })
    } catch (e) {
      console.log('error : ' + e)
    }
  }

  handleDelete(retiredBookId: any, rowData: any, bookStatus: string) {
    this.setState({
      openModal: true,
      retiredBookId: retiredBookId,
      bookStatus: bookStatus
    })
  }

  async handleConfirmYes() {
    const { assumedAMID } = this.props
    const AMId = parseInt(assumedAMID)
    const { retiredBookId: resourceId, bookStatus } = this.state

    this.setState({ insertingOrUpdatingBook: true })
    try {
      if (bookStatus === 'Active') {
        await api.Books.retire({ AMId, resourceId })
        this.props.fetchBooks()
        this.setState({ openModal: false })
        successToast(this.props.intl.formatMessage(messages.retireSuccess))
      } else {
        await api.Books.reactivate({ AMId, resourceId })
        this.props.fetchBooks()
        this.setState({ openModal: false })
        successToast(this.props.intl.formatMessage(messages.reactivateSuccess))
      }
    } catch (e) {
      console.error(e)
      this.setState({ openModal: false })
      if (bookStatus === 'Active') {
        errorToast(
          parseError(e) || this.props.intl.formatMessage(messages.retireFailed)
        )
      } else {
        errorToast(
          parseError(e) ||
            this.props.intl.formatMessage(messages.reactivateFailed)
        )
      }
    } finally {
      this.setState({ insertingOrUpdatingBook: false })
    }
  }

  handleConfirmNo() {
    this.setState({ openModal: false })
  }

  // CRUD methods : ENDS

  render() {
    if (this.state.data !== undefined) {
      const data = this.state.data
      data.sort(function(a: any, b: any) {
        return b.createdTime.localeCompare(a.createdTime)
      })
    }
    const { fetching, darkProfile } = this.props
    const actionButton = {
      retire: (
        <Button compact color="red" size="tiny">
          <FormattedMessage {...messages.retire} />
        </Button>
      ),
      reactivate: (
        <Button compact color="green" size="tiny">
          <FormattedMessage {...messages.reactivate} />
        </Button>
      )
    }
    // subComponent for grid
    var subComponent = (
      <BookForm
        submitButtonLabel={this.props.intl.formatMessage(
          messages.updateButtonLabel
        )}
        cancelButtonLabel={this.props.intl.formatMessage(
          messages.cancelButtonLabel
        )}
        uniqueColumnId="bookId"
        darkProfile={darkProfile}
        loader={this.state.insertingOrUpdatingBook}
      />
    )

    const retireMessage = (
      <FormattedMessage
        id="book.messageWithRetireId"
        defaultMessage="Are you sure you want to retire {bookId} ?"
        values={{
          bookId: this.state.retiredBookId
        }}
      />
    )

    const reactivateMessage = (
      <FormattedMessage
        id="book.messageWithReactivateId"
        defaultMessage="Are you sure you want to Unretire {bookId} ?"
        values={{
          bookId: this.state.retiredBookId
        }}
      />
    )
    return (
      <div>
        <div>
          <BookHeader
            handleAddBook={this.handleAdd}
            addBookButtonLabel={this.props.intl.formatMessage(
              messages.addBookButtonLabel
            )}
            headerFormVisible={this.state.headerFormVisible}
            gridRowExpanded={this.state.gridRowExpanded}
            darkProfile={darkProfile}
            loader={this.state.insertingOrUpdatingBook}
            formData={this.state.formData}
            formOpened={this.formOpened}
            formClosed={this.formClosed}
          />
          <ArgomiGrid
            column={columns}
            data={this.state.data}
            deleteEnable={true}
            actionButton={actionButton}
            multipleActionButtonRequire={true}
            filterable={true}
            defaultPageSize={10} // As per react-table limitation number shouldn't be less than 5
            subcomponent={subComponent}
            subComponentType="form"
            onGridUpdate={this.handleUpdate}
            onGridDelete={this.handleDelete}
            onGridExpand={this.handleGridExpand}
            onGridCollapse={this.handleGridCollapse}
            loading={fetching}
            assumedAMID={this.props.assumedAMID}
          />
          <ConfirmDialogBox
            HeadingText={
              this.state.bookStatus === 'Active'
                ? this.props.intl.formatMessage(messages.confirmRetireHeading)
                : this.props.intl.formatMessage(
                    messages.confirmReactivateHeading
                  )
            }
            MessageText={
              this.state.bookStatus === 'Active'
                ? retireMessage
                : reactivateMessage
            }
            handleYes={this.handleConfirmYes}
            handleNo={this.handleConfirmNo}
            openModalProp={this.state.openModal}
            loader={this.state.insertingOrUpdatingBook}
          />
        </div>
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

  formOpened() {
    this.setState({ headerFormVisible: true })
  }

  formClosed() {
    this.setState({ headerFormVisible: false })
  }
}

export default injectIntl(BooksContainer)

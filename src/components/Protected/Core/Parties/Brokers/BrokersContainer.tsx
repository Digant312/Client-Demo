import React from 'react'
import { render } from 'react-dom'
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl'
import { Header, Segment, Button } from 'semantic-ui-react'
import PartyForm from 'containers/Protected/Core/Parties/PartyForm'
import PartyHeader from './../PartyHeader'
import ToastContainer, {
  successToast,
  errorToast
} from 'components/Shared/ArgomiToastContainer'
import { parseError } from 'utils/error'
import ArgomiGrid from '../../../../Shared/ArgomiGrid'
import ConfirmDialogBox from '../../../../Shared/ConfirmDialogBox'
import fieldMessages from 'utils/form/PartyConfig/messages'
import messages from './../PartyStrings'
import bookMessages from '../../Books/BooksStrings'
import { api, parties, books } from '@amaas/amaas-core-sdk-js'
import FormDialogBox from 'components/Shared/FormDialogBox'
import BookForm from '../PartiesBookForm'

var bookForm: any
var columns = [
  {
    Header: <FormattedMessage {...fieldMessages.partyId} />,
    accessor: 'partyId'
  },
  {
    Header: <FormattedMessage {...fieldMessages.displayName} />,
    accessor: 'displayName'
  },
  {
    Header: <FormattedMessage {...fieldMessages.baseCurrency} />,
    accessor: 'baseCurrency'
  },
  {
    Header: <FormattedMessage {...fieldMessages.contactNumber} />,
    accessor: 'contactNumber'
  },
  {
    Header: <FormattedMessage {...fieldMessages.legalName} />,
    accessor: 'legalName'
  },
  {
    Header: <FormattedMessage {...fieldMessages.url} />,
    accessor: 'url'
  }
]

export interface IBrokersContainerProps {
  assumedAMID: string
  assetManagerId: string
  brokers: any[] // change to fx or futures
  fetching: boolean
  fetchError: string
  fetchParties: (amidInRequest?: boolean) => void
  fetchBooks: () => void
  darkProfile: boolean
}

interface IBrokersContainerState {
  data: parties.Broker[]
  insert: boolean
  headerFormVisible: boolean
  gridRowExpanded: boolean
  openModal: boolean
  openAddBookModal: boolean
  retiredBrokerId: string
  insertingOrUpdatingParty: boolean
  insertingOrUpdatingBook: boolean
  closeFormOnSuccess: boolean
  partyStatus: string
}

// BrokersContainer is main component which contain BrokerHeader and BrokerGrid components
class BrokersContainer extends React.Component<
  IBrokersContainerProps & InjectedIntlProps,
  IBrokersContainerState
> {
  constructor(props: IBrokersContainerProps & InjectedIntlProps) {
    super(props)
    this.state = {
      data: props.brokers,
      insert: false,
      headerFormVisible: false,
      gridRowExpanded: false,
      openModal: false,
      openAddBookModal: false,
      retiredBrokerId: '',
      insertingOrUpdatingParty: false,
      insertingOrUpdatingBook: false,
      closeFormOnSuccess: false,
      partyStatus: ''
    }
    this.handleGridExpand = this.handleGridExpand.bind(this)
    this.handleGridCollapse = this.handleGridCollapse.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleConfirmYes = this.handleConfirmYes.bind(this)
    this.handleConfirmNo = this.handleConfirmNo.bind(this)
    this.handleAdditionalAction = this.handleAdditionalAction.bind(this)
    this.handleClosePopup = this.handleClosePopup.bind(this)
    this.handlePopupFormSubmit = this.handlePopupFormSubmit.bind(this)
    this.formOpened = this.formOpened.bind(this)
    this.formClosed = this.formClosed.bind(this)
  }
  // on mount, call this.props.fetchParties(false)
  componentDidMount() {
    this.props.fetchParties(false)
  }

  componentWillReceiveProps(
    nextProps: IBrokersContainerProps & InjectedIntlProps
  ) {
    if (nextProps.brokers) {
      this.setState({
        data: nextProps.brokers
      })
    }
    if (this.props.assumedAMID != nextProps.assumedAMID) {
      this.props.fetchParties(false)
    }
  }
  // CRUD methods : STARTS
  convertForDataField(values: any, fields: string) {
    if (values[fields] !== undefined) {
      let JsonStructureComments: any = {}
      values[fields].map(function(field: any, i: number) {
        const { name, ...rest } = field
        JsonStructureComments[field.name] = rest
      })
      return { ...values, [fields]: JsonStructureComments }
    }
    return values
  }

  childLinksToObject(coll: any[]) {
    if (!coll) return {}
    return coll.reduce((arr: any, curr: any) => {
      const { name, ...rest } = curr
      arr[name] = rest.links
      return arr
    }, {})
  }

  async handleAdd(values: any) {
    this.setState({ insertingOrUpdatingParty: true, headerFormVisible: true })
    const { assumedAMID } = this.props
    try {
      if (values.deleteButton) delete values.deleteButton
      values = this.convertForDataField(values, 'comments')
      values = this.convertForDataField(values, 'references')
      values = this.convertForDataField(values, 'emails')
      values = this.convertForDataField(values, 'phoneNumbers')
      values = this.convertForDataField(values, 'addresses')
      const links = this.childLinksToObject(values.links)
      const brokers = new parties.Broker({
        ...values,
        links,
        assetManagerId: parseInt(assumedAMID) // ensure int
      })

      await api.Parties.insert({ AMId: parseInt(assumedAMID), party: brokers })
      successToast(this.props.intl.formatMessage(messages.brokerAddSuccess))
      this.setState({ headerFormVisible: false })
      this.props.fetchParties(false)
    } catch (e) {
      console.log(parseError(e))
      errorToast(
        parseError(e) || this.props.intl.formatMessage(messages.brokerAddFailed)
      )
    } finally {
      this.setState({ insertingOrUpdatingParty: false })
    }
  }

  async handleUpdate(values: any) {
    this.setState({ insertingOrUpdatingParty: true })
    if (values.deleteButton) delete values.deleteButton
    values = this.convertForDataField(values, 'comments')
    values = this.convertForDataField(values, 'references')
    values = this.convertForDataField(values, 'emails')
    values = this.convertForDataField(values, 'phoneNumbers')
    values = this.convertForDataField(values, 'addresses')
    const links = this.childLinksToObject(values.links)
    const { assumedAMID } = this.props

    try {
      const broker = new parties.Broker({
        ...values,
        links,
        assetManagerId: parseInt(assumedAMID) // ensure int
      })

      await api.Parties.amend({
        AMId: parseInt(assumedAMID),
        resourceId: broker.partyId,
        party: broker
      })
      successToast(this.props.intl.formatMessage(messages.brokerUpdateSuccess))
      this.props.fetchParties(false)
    } catch (e) {
      console.error(e)
      errorToast(
        parseError(e) ||
          this.props.intl.formatMessage(messages.brokerUpdateFailed)
      )
    } finally {
      this.setState({ insertingOrUpdatingParty: false })
    }
  }

  handleDelete(retiredBrokerId: any, rowData: any) {
    const { partyStatus } = rowData
    this.setState({
      openModal: true,
      retiredBrokerId: retiredBrokerId,
      partyStatus: partyStatus
    })
  }

  handleAdditionalAction(rowData: any) {
    bookForm = (
      <BookForm
        darkProfile={this.props.darkProfile}
        rowData={rowData}
        HeadingText={this.props.intl.formatMessage(fieldMessages.createBook)}
        submitButtonLabel={this.props.intl.formatMessage(
          messages.addButtonLabel
        )}
        cancelButtonLabel={this.props.intl.formatMessage(
          messages.cancelButtonLabel
        )}
        onCancel={this.handleClosePopup}
        onSubmit={this.handlePopupFormSubmit}
      />
    )
    this.setState({ openModal: false })
    this.setState({ openAddBookModal: true })
  }

  async handleConfirmYes() {
    const { assumedAMID } = this.props
    const AMId = parseInt(assumedAMID)
    const { retiredBrokerId: resourceId, partyStatus } = this.state
    this.setState({ insertingOrUpdatingParty: true })
    try {
      if (partyStatus === 'Active') {
        await api.Parties.deactivate({ AMId, resourceId })
        this.setState({ openModal: false })
        successToast(
          this.props.intl.formatMessage(messages.brokerInactiveSuccess)
        )
        this.props.fetchParties()
      } else {
        await api.Parties.reactivate({ AMId, resourceId })
        this.setState({ openModal: false })
        successToast(
          this.props.intl.formatMessage(messages.brokerActiveSuccess)
        )
        this.props.fetchParties()
      }
    } catch (e) {
      console.error(e)
      this.setState({ openModal: false })
      if (partyStatus === 'Active') {
        errorToast(
          parseError(e) ||
            this.props.intl.formatMessage(messages.brokerInactiveFailed)
        )
      } else {
        errorToast(
          parseError(e) ||
            this.props.intl.formatMessage(messages.brokerActiveFailed)
        )
      }
    } finally {
      this.setState({ insertingOrUpdatingParty: false })
    }
  }

  handleConfirmNo() {
    this.setState({ openModal: false })
  }

  // CRUD methods : ENDS

  render() {
    const { fetching, darkProfile } = this.props
    const actionButton = {
      retire: (
        <Button compact inverted size="tiny" color="red">
          <FormattedMessage {...messages.deactivate} />
        </Button>
      ),
      reactivate: (
        <Button compact inverted size="tiny" color="green">
          <FormattedMessage {...messages.reactivate} />
        </Button>
      )
    }
    // Header add Form
    var headerForm = (
      <PartyForm
        submitButtonLabel={this.props.intl.formatMessage(
          messages.addButtonLabel
        )}
        cancelButtonLabel={this.props.intl.formatMessage(
          messages.cancelButtonLabel
        )}
        onFormSubmit={this.handleAdd}
        darkProfile={darkProfile}
        partyType="broker"
        loader={this.state.insertingOrUpdatingParty}
      />
    )
    // subComponent for grid
    var subComponent = (
      <PartyForm
        submitButtonLabel={this.props.intl.formatMessage(
          messages.updateButtonLabel
        )}
        cancelButtonLabel={this.props.intl.formatMessage(
          messages.cancelButtonLabel
        )}
        assumedAMID={this.props.assumedAMID}
        darkProfile={darkProfile}
        uniqueColumnId="partyId"
        partyType="broker"
        loader={this.state.insertingOrUpdatingParty}
      />
    )
    var additionalActionButton = {
      enabled: (
        <Button compact inverted icon="plus" size="tiny" color="green" />
      ),
      disabled: (
        <Button
          disabled
          compact
          inverted
          icon="plus"
          size="tiny"
          color="green"
        />
      )
    }
    const brockerInActiveMessage = (
      <FormattedMessage
        id="parties.confirmBrokerDeactiveMessage"
        defaultMessage="Are you sure you want to deactivate {partyId} ?"
        values={{
          partyId: this.state.retiredBrokerId
        }}
      />
    )

    const brockerActiveMessage = (
      <FormattedMessage
        id="parties.confirmBrokerActiveMessages"
        defaultMessage="Are you sure you want to reactivate {partyId} ?"
        values={{
          partyId: this.state.retiredBrokerId
        }}
      />
    )
    return (
      <div>
        <div>
          <PartyHeader
            addButtonLabel={this.props.intl.formatMessage(
              messages.addButtonBrokersLabel
            )}
            darkProfile={darkProfile}
            headerFormVisible={this.state.headerFormVisible}
            gridRowExpanded={this.state.gridRowExpanded}
            headerForm={headerForm}
            formOpened={this.formOpened}
            formClosed={this.formClosed}
          />
          <ArgomiGrid
            column={columns}
            data={this.state.data}
            deleteEnable={true}
            actionButton={actionButton}
            multipleActionButtonRequire={true}
            statusId="partyStatus"
            filterable={true}
            defaultPageSize={10} // As per react-table limitation number shouldn't be less than 5
            subcomponent={subComponent}
            subComponentType="form"
            onGridUpdate={this.handleUpdate}
            onGridDelete={this.handleDelete}
            onGridExpand={this.handleGridExpand}
            onGridCollapse={this.handleGridCollapse}
            additionalActionEnable={true}
            additionalAction={this.handleAdditionalAction}
            additionalActionButton={additionalActionButton}
            loading={fetching}
            assumedAMID={this.props.assumedAMID}
          />
          <ConfirmDialogBox
            HeadingText={
              this.state.partyStatus === 'Active'
                ? this.props.intl.formatMessage(
                    messages.confirmBrokerInactiveHeading
                  )
                : this.props.intl.formatMessage(
                    messages.confirmBrokerActiveHeading
                  )
            }
            MessageText={
              this.state.partyStatus === 'Active'
                ? brockerInActiveMessage
                : brockerActiveMessage
            }
            handleYes={this.handleConfirmYes}
            handleNo={this.handleConfirmNo}
            openModalProp={this.state.openModal}
            loader={this.state.insertingOrUpdatingParty}
            darkProfile={darkProfile}
          />
          <FormDialogBox
            darkProfile={darkProfile}
            dialogForm={bookForm}
            openModalProp={this.state.openAddBookModal}
          />
        </div>

        <ToastContainer />
      </div>
    )
  }
  async handlePopupFormSubmit(values: any, data: any) {
    const { assetManagerId, assumedAMID } = this.props
    const book = new books.Book({
      ...values,
      assetManagerId: parseInt(assumedAMID) // ensure int
    })
    try {
      // All API methods return promises, so we make use of async/await
      await api.Books.insert({ AMId: parseInt(assumedAMID), book })
      successToast(this.props.intl.formatMessage(bookMessages.addSuccess))
    } catch (e) {
      console.error(parseError(e))
      errorToast(
        parseError(e) || this.props.intl.formatMessage(bookMessages.addFailed)
      )
    } finally {
      this.setState({ openAddBookModal: false })
    }
  }

  handleClosePopup() {
    this.setState({ openAddBookModal: false })
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

export default injectIntl(BrokersContainer)

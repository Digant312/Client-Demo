import React from 'react'
import { render } from 'react-dom'
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl'
import { api, assets } from '@amaas/amaas-core-sdk-js'
import { Button } from 'semantic-ui-react'
import ToastContainer, {
  successToast,
  errorToast
} from 'components/Shared/ArgomiToastContainer'
import messages from '../AssetsStrings'
import fieldMessages from 'utils/form/AssetConfig/messages'
import ArgomiGrid from '../../../../Shared/ArgomiGrid'
import ConfirmDialogBox from '../../../../Shared/ConfirmDialogBox'
import AssetsForm from 'containers/Protected/Core/Assets/AssetsForm'
import AssetsHeader from '../AssetsHeader'
import AssetGridSearcher from 'containers/Shared/AssetGridSearcher'
import { parseError } from 'utils/error'
import { createAccessor } from 'utils/table'
import { convertToAMaaSDate, getPrimaryChild } from 'utils/form'

var columns = (dateFormat: string) => [
  {
    Header: <FormattedMessage {...fieldMessages.ticker} />,
    id: 'ticker',
    accessor: (d: any) => {
      const { name } = getPrimaryChild(d.references, 'referencePrimary') || {
        name: ''
      }
      return createAccessor(`references.${name}.referenceValue`)(d)
    }
  },
  {
    Header: <FormattedMessage {...fieldMessages.description} />,
    accessor: 'displayName'
  },
  {
    Header: <FormattedMessage {...fieldMessages.underlying} />,
    accessor: 'underlyingDisplayName'
  },
  {
    Header: <FormattedMessage {...fieldMessages.expiryDate} />,
    id: 'expiryDate',
    accessor: (row: any) => {
      if (!row.expiryDate) return ''
      let resolvedDate
      if (row.expiryDate.format) {
        resolvedDate = row.expiryDate.format(dateFormat)
      } else if (row.expiryDate.toString) {
        resolvedDate = row.expiryDate.toString()
      } else {
        resolvedDate = `${row.expiryDate}`
      }
      return resolvedDate
    }
  }
]

export interface IFutureContainerProps {
  assumedAMID: string
  future: any[] // change to fx or futures
  fetching: boolean
  fetchError: string
  fetchAssets: (amidInRequest?: boolean) => void
  darkProfile: boolean
  dateFormat: string
}

interface IFutureContainerState {
  data: assets.Future[]
  insert: boolean
  headerFormVisible: boolean
  gridRowExpanded: boolean
  openModal: boolean
  deactivatedFutureId: string
  insertingOrUpdatingFuture: boolean
  closeFormOnSuccess: boolean
  assetStatus: string
}

class FutureContainer extends React.Component<
  IFutureContainerProps & InjectedIntlProps,
  IFutureContainerState
> {
  constructor(props: IFutureContainerProps & InjectedIntlProps) {
    super(props)
    this.state = {
      data: props.future,
      insert: false,
      headerFormVisible: false,
      gridRowExpanded: false,
      openModal: false,
      deactivatedFutureId: '',
      insertingOrUpdatingFuture: false,
      closeFormOnSuccess: false,
      assetStatus: ''
    }
    this.handleGridExpand = this.handleGridExpand.bind(this)
    this.handleGridCollapse = this.handleGridCollapse.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleConfirmYes = this.handleConfirmYes.bind(this)
    this.handleConfirmNo = this.handleConfirmNo.bind(this)
    this.formOpened = this.formOpened.bind(this)
    this.formClosed = this.formClosed.bind(this)
  }

  // on mount, call this.props.fetchAssets(false)
  componentDidMount() {
    this.props.fetchAssets(false)
  }

  componentWillReceiveProps(
    nextProps: IFutureContainerProps & InjectedIntlProps
  ) {
    if (this.props.future !== nextProps.future) {
      this.setState({ data: nextProps.future })
    }
    if (this.props.assumedAMID != nextProps.assumedAMID) {
      this.props.fetchAssets(false)
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
    this.setState({ insertingOrUpdatingFuture: true, headerFormVisible: true })
    const { assumedAMID } = this.props
    try {
      const convertDate = convertToAMaaSDate(this.props.dateFormat)
      values = this.convertForDataField(values, 'comments')
      values = this.convertForDataField(values, 'references')
      const links = this.childLinksToObject(values.links)
      const issueDate = values.issueDate
        ? values.issueDate.format('YYYY-MM-DD')
        : null
      const expiryDate = values.expiryDate
        ? values.expiryDate.format('YYYY-MM-DD')
        : null
      const future = new assets.Future({
        ...values,
        issueDate,
        expiryDate,
        links,
        assetManagerId: parseInt(assumedAMID) // ensure int
      })
      await api.Assets.insert({ AMId: parseInt(assumedAMID), asset: future })
      this.setState({ headerFormVisible: false })
      successToast(this.props.intl.formatMessage(messages.addFutureSuccess))
      this.props.fetchAssets(false)
    } catch (e) {
      console.error(e)
      errorToast(
        parseError(e) || this.props.intl.formatMessage(messages.addFutureFailed)
      )
    } finally {
      this.setState({ insertingOrUpdatingFuture: false })
    }
  }

  async handleUpdate(values: any) {
    this.setState({ insertingOrUpdatingFuture: true })
    const { assumedAMID } = this.props
    try {
      const convertDate = convertToAMaaSDate(this.props.dateFormat)
      values = this.convertForDataField(values, 'comments')
      values = this.convertForDataField(values, 'references')
      const links = this.childLinksToObject(values.links)
      const assetDates = [
        'issueDate',
        'expiryDate',
        'maturityDate',
        'creationDate'
      ]
      const valueDates: any = {}
      assetDates.map(dateType => {
        if (values[dateType] && values[dateType].format) {
          valueDates[dateType] = values[dateType].format('YYYY-MM-DD')
        }
      })

      const future = new assets.Future({
        ...values,
        ...valueDates,
        links,
        assetManagerId: parseInt(assumedAMID) // ensure int
      })
      await api.Assets.amend({
        AMId: parseInt(assumedAMID),
        resourceId: future.assetId,
        asset: future
      })
      successToast(this.props.intl.formatMessage(messages.updateFutureSuccess))
      this.props.fetchAssets(false)
    } catch (e) {
      console.error(e)
      errorToast(
        parseError(e) ||
          this.props.intl.formatMessage(messages.updateFutureFailed)
      )
    } finally {
      this.setState({ insertingOrUpdatingFuture: false })
    }
  }

  handleDelete(deactivatedFutureId: any, rowData: any) {
    const { assetStatus } = rowData
    this.setState({
      openModal: true,
      deactivatedFutureId: deactivatedFutureId,
      assetStatus: assetStatus
    })
  }

  async handleConfirmYes() {
    const { assumedAMID } = this.props
    const AMId = parseInt(assumedAMID)
    const { deactivatedFutureId: resourceId, assetStatus } = this.state
    this.setState({ insertingOrUpdatingFuture: true })
    try {
      if (assetStatus === 'Active') {
        await api.Assets.deactivate({ AMId, resourceId })
        this.setState({ openModal: false })
        successToast(
          this.props.intl.formatMessage(messages.retireFutureSuccess)
        )
      } else {
        await api.Assets.reactivate({ AMId, resourceId })
        this.setState({ openModal: false })
        successToast(
          this.props.intl.formatMessage(messages.reactivateFutureSuccess)
        )
      }
      this.props.fetchAssets(false)
    } catch (e) {
      console.error(e)
      this.setState({ openModal: false })
      errorToast(
        parseError(e) ||
          this.props.intl.formatMessage(messages.retireFutureFailed)
      )
    } finally {
      this.setState({ insertingOrUpdatingFuture: false })
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
    // form in Header
    var headerForm = (
      <AssetsForm
        submitButtonLabel={this.props.intl.formatMessage(
          messages.addButtonLabel
        )}
        cancelButtonLabel={this.props.intl.formatMessage(
          messages.cancelButtonLabel
        )}
        onFormSubmit={this.handleAdd}
        darkProfile={darkProfile}
        type="future"
        loader={this.state.insertingOrUpdatingFuture}
      />
    )
    // subComponent for grid
    var subComponent = (
      <AssetsForm
        submitButtonLabel={this.props.intl.formatMessage(
          messages.updateButtonLabel
        )}
        cancelButtonLabel={this.props.intl.formatMessage(
          messages.cancelButtonLabel
        )}
        uniqueColumnId="assetId"
        formData={this.props.future}
        darkProfile={darkProfile}
        assumedAMID={this.props.assumedAMID}
        type="future"
        loader={this.state.insertingOrUpdatingFuture}
      />
    )
    const futureInActiveMessage = (
      <FormattedMessage
        id="assets.confirmFutureInActiveMessage"
        defaultMessage="Are you sure you want to deactivate {assetId} ?"
        values={{
          assetId: this.state.deactivatedFutureId
        }}
      />
    )

    const futureActiveMessage = (
      <FormattedMessage
        id="assets.confirmFutureReactivateMessage"
        defaultMessage="Are you sure you want to reactivate {assetId} ?"
        values={{
          assetId: this.state.deactivatedFutureId
        }}
      />
    )
    return (
      <div>
        <div style={{ width: '100%', display: 'block', float: 'left' }}>
          <AssetsHeader
            addButtonLabel={this.props.intl.formatMessage(
              messages.addFutureButtonLabel
            )}
            headerFormVisible={this.state.headerFormVisible}
            gridRowExpanded={this.state.gridRowExpanded}
            headerForm={headerForm}
            darkProfile={darkProfile}
            type="future"
            formOpened={this.formOpened}
            formClosed={this.formClosed}
          />
          <AssetGridSearcher queryFilter={{ assetClass: 'Future' }} />
        </div>
        <div style={{ width: '100%', display: 'block', float: 'left' }}>
          <ArgomiGrid
            column={columns(this.props.dateFormat)}
            data={this.state.data}
            deleteEnable={true}
            actionButton={actionButton}
            multipleActionButtonRequire={true}
            statusId="assetStatus"
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
              this.state.assetStatus === 'Active'
                ? this.props.intl.formatMessage(
                    messages.confirmDeactivateEquityHeading
                  )
                : this.props.intl.formatMessage(
                    messages.confirmReactivateEquityHeading
                  )
            }
            MessageText={
              this.state.assetStatus === 'Active'
                ? futureInActiveMessage
                : futureActiveMessage
            }
            handleYes={this.handleConfirmYes}
            handleNo={this.handleConfirmNo}
            openModalProp={this.state.openModal}
            loader={this.state.insertingOrUpdatingFuture}
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

export default injectIntl(FutureContainer)

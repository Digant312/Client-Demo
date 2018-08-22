import React from 'react'
import { render } from 'react-dom'
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl'
import ToastContainer, {
  successToast,
  errorToast
} from 'components/Shared/ArgomiToastContainer'
import { parseError } from 'utils/error'
import messages from '../AssetsStrings'
import fieldMessages from 'utils/form/AssetConfig/messages'
import ArgomiGrid from '../../../../Shared/ArgomiGrid'
import ConfirmDialogBox from '../../../../Shared/ConfirmDialogBox'
import AssetsForm from 'containers/Protected/Core/Assets/AssetsForm'
import AssetsHeader from '../AssetsHeader'
import AssetGridSearcher from 'containers/Shared/AssetGridSearcher'
import { api, assets } from '@amaas/amaas-core-sdk-js'
import { Button } from 'semantic-ui-react'

var columns = [
  {
    Header: <FormattedMessage {...fieldMessages.pair} />,
    accessor: 'description'
  }
]

// Add the connect Props
export interface IFxContainerProps {
  assumedAMID: string
  fx: any[] // change to fx or futures
  fetching: boolean
  fetchError: string
  fetchAssets: (amidInRequest?: boolean) => void
  darkProfile: boolean
}

interface IFxContainerState {
  data: assets.ForeignExchange[]
  insert: boolean
  headerFormVisible: boolean
  gridRowExpanded: boolean
  openModal: boolean
  deactivatedFxId: string
  insertingOrUpdatingFx: boolean
  closeFormOnSuccess: boolean
  assetStatus: string
}

class FxContainer extends React.Component<
  IFxContainerProps & InjectedIntlProps,
  IFxContainerState
> {
  constructor(props: IFxContainerProps & InjectedIntlProps) {
    super(props)
    this.state = {
      data: props.fx,
      insert: false,
      headerFormVisible: false,
      gridRowExpanded: false,
      openModal: false,
      deactivatedFxId: '',
      insertingOrUpdatingFx: false,
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

  // on mount, call this.props.fetchAssets()
  componentDidMount() {
    this.props.fetchAssets(false)
  }

  componentWillReceiveProps(nextProps: IFxContainerProps & InjectedIntlProps) {
    if (this.props.fx !== nextProps.fx) {
      this.setState({ data: nextProps.fx })
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
    this.setState({ insertingOrUpdatingFx: true, headerFormVisible: true })
    const { assumedAMID } = this.props
    try {
      values = this.convertForDataField(values, 'comments')
      values = this.convertForDataField(values, 'references')
      const links = this.childLinksToObject(values.links)
      const major = values.major || false
      const fx = new assets.ForeignExchange({
        ...values,
        major,
        links,
        assetManagerId: parseInt(assumedAMID) // ensure int
      })
      await api.Assets.insert({ AMId: parseInt(assumedAMID), asset: fx })
      this.setState({ headerFormVisible: false })
      successToast(this.props.intl.formatMessage(messages.addFxSuccess))
      this.props.fetchAssets(true)
    } catch (e) {
      console.error(e)
      errorToast(
        parseError(e) || this.props.intl.formatMessage(messages.addFxFailed)
      )
    } finally {
      this.setState({ insertingOrUpdatingFx: false })
    }
  }

  async handleUpdate(values: any) {
    this.setState({ insertingOrUpdatingFx: true })
    const { assumedAMID } = this.props
    try {
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
      const fx = new assets.ForeignExchange({
        ...values,
        ...valueDates,
        links,
        assetManagerId: parseInt(assumedAMID) // ensure int
      })
      await api.Assets.amend({
        AMId: parseInt(assumedAMID),
        resourceId: fx.assetId,
        asset: fx
      })
      successToast(this.props.intl.formatMessage(messages.updateFxSuccess))
    } catch (e) {
      console.error(e)
      errorToast(
        parseError(e) || this.props.intl.formatMessage(messages.updateFxFailed)
      )
      this.props.fetchAssets(true)
    } finally {
      this.setState({ insertingOrUpdatingFx: false })
    }
  }

  handleDelete(deactivatedFxId: any, rowData: any) {
    const { assetStatus } = rowData
    this.setState({
      openModal: true,
      deactivatedFxId: deactivatedFxId,
      assetStatus: assetStatus
    })
  }

  async handleConfirmYes() {
    const { assumedAMID } = this.props
    const AMId = parseInt(assumedAMID)
    const { deactivatedFxId: resourceId, assetStatus } = this.state
    this.setState({ insertingOrUpdatingFx: true })
    try {
      if (assetStatus === 'Active') {
        await api.Assets.deactivate({ AMId, resourceId })
        this.setState({ openModal: false })
        successToast(this.props.intl.formatMessage(messages.retireFxSuccess))
      } else {
        await api.Assets.reactivate({ AMId, resourceId })
        this.setState({ openModal: false })
        successToast(
          this.props.intl.formatMessage(messages.reactivateFxSuccess)
        )
      }
      this.props.fetchAssets(false)
    } catch (e) {
      console.error(e)
      this.setState({ openModal: false })
      errorToast(
        parseError(e) || this.props.intl.formatMessage(messages.updateFxFailed)
      )
    } finally {
      this.setState({ insertingOrUpdatingFx: false })
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
        type="fx"
        loader={this.state.insertingOrUpdatingFx}
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
        formData={this.props.fx}
        assumedAMID={this.props.assumedAMID}
        darkProfile={darkProfile}
        type="fx"
        loader={this.state.insertingOrUpdatingFx}
      />
    )
    const fxInActiveMessage = (
      <FormattedMessage
        id="assets.confirmFxInActiveMessage"
        defaultMessage="Are you sure you want to deactivate {assetId} ?"
        values={{
          assetId: this.state.deactivatedFxId
        }}
      />
    )

    const fxActiveMessage = (
      <FormattedMessage
        id="assets.confirmFxReactivateMessage"
        defaultMessage="Are you sure you want to reactivate {assetId} ?"
        values={{
          assetId: this.state.deactivatedFxId
        }}
      />
    )
    return (
      <div>
        <div style={{ width: '100%', display: 'block', float: 'left' }}>
          <AssetsHeader
            addButtonLabel={this.props.intl.formatMessage(
              messages.addFxButtonLabel
            )}
            headerFormVisible={this.state.headerFormVisible}
            gridRowExpanded={this.state.gridRowExpanded}
            headerForm={headerForm}
            darkProfile={darkProfile}
            type="fx"
            formOpened={this.formOpened}
            formClosed={this.formClosed}
          />
          <AssetGridSearcher queryFilter={{ assetClass: 'ForeignExchange' }} />
        </div>
        <div style={{ width: '100%', display: 'block', float: 'left' }}>
          <ArgomiGrid
            column={columns}
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
                ? fxInActiveMessage
                : fxActiveMessage
            }
            handleYes={this.handleConfirmYes}
            handleNo={this.handleConfirmNo}
            openModalProp={this.state.openModal}
            loader={this.state.insertingOrUpdatingFx}
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

export default injectIntl(FxContainer)

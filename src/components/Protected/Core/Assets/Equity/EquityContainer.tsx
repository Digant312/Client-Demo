import React from 'react'
import { render } from 'react-dom'
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl'
import { api, assets } from '@amaas/amaas-core-sdk-js'
import { Button } from 'semantic-ui-react'
import messages from '../AssetsStrings'
import fieldMessages from 'utils/form/AssetConfig/messages'
import ArgomiGrid from '../../../../Shared/ArgomiGrid'
import ConfirmDialogBox from '../../../../Shared/ConfirmDialogBox'
import AssetsForm from 'containers/Protected/Core/Assets/AssetsForm'
import AssetsHeader from '../AssetsHeader'
import AssetGridSearcher from 'containers/Shared/AssetGridSearcher'
import ToastContainer, {
  successToast,
  errorToast
} from 'components/Shared/ArgomiToastContainer'
import { parseError } from 'utils/error'
import { createAccessor } from 'utils/table'
import { getPrimaryChild } from 'utils/form'

var columns = [
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
    Header: <FormattedMessage {...fieldMessages.currency} />,
    accessor: 'currency'
  },
  {
    Header: <FormattedMessage {...fieldMessages.countryId} />,
    accessor: 'countryId'
  },
  {
    Header: <FormattedMessage {...fieldMessages.isin} />,
    id: 'isin',
    accessor: createAccessor('references.ISIN.referenceValue')
  }
]

// Add the connect Props
export interface IAssetsContainerProps {
  assumedAMID: string
  equities: any[] // change to fx or futures
  fetching: boolean
  fetchError: string
  fetchAssets: (amidInRequest?: boolean) => void
  darkProfile: boolean
}

interface IAssetsContainerState {
  data: assets.Equity[]
  insert: boolean
  headerFormVisible: boolean
  gridRowExpanded: boolean
  openModal: boolean
  deactivatedEquityId: string
  insertingOrUpdatingEquity: boolean
  assetStatus: string
}

class EquityContainer extends React.Component<
  IAssetsContainerProps & InjectedIntlProps,
  IAssetsContainerState
> {
  constructor(props: IAssetsContainerProps & InjectedIntlProps) {
    super(props)
    this.state = {
      data: props.equities, // data should now come from props.equities OR props.fx OR props.futures
      insert: false,
      headerFormVisible: false,
      gridRowExpanded: false,
      openModal: false,
      deactivatedEquityId: '',
      insertingOrUpdatingEquity: false,
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

  componentWillReceiveProps(
    nextProps: IAssetsContainerProps & InjectedIntlProps
  ) {
    if (this.props.equities !== nextProps.equities) {
      this.setState({ data: nextProps.equities })
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
    this.setState({ insertingOrUpdatingEquity: true, headerFormVisible: true })
    const { assumedAMID } = this.props
    try {
      values = this.convertForDataField(values, 'comments')
      values = this.convertForDataField(values, 'references')
      const links = this.childLinksToObject(values.links)
      const equity = new assets.Equity({
        ...values,
        links,
        assetManagerId: parseInt(assumedAMID) // ensure int
      })

      await api.Assets.insert({ AMId: parseInt(assumedAMID), asset: equity })
      this.setState({ headerFormVisible: false })
      this.props.fetchAssets()
      successToast(this.props.intl.formatMessage(messages.addEquitySuccess))
      this.props.fetchAssets(false)
    } catch (e) {
      console.error(e)
      errorToast(
        parseError(e) || this.props.intl.formatMessage(messages.addEquityFailed)
      )
    } finally {
      this.setState({ insertingOrUpdatingEquity: false })
    }
  }

  async handleUpdate(values: any) {
    this.setState({ insertingOrUpdatingEquity: true })
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
      const equity = new assets.Equity({
        ...values,
        ...valueDates,
        links,
        assetManagerId: parseInt(assumedAMID) // ensure int
      })
      await api.Assets.amend({
        AMId: parseInt(assumedAMID),
        resourceId: equity.assetId,
        asset: equity
      })
      successToast(this.props.intl.formatMessage(messages.updateEquitySuccess))
      this.props.fetchAssets(false)
    } catch (e) {
      console.error(e)
      errorToast(
        parseError(e) ||
          this.props.intl.formatMessage(messages.updateEquityFailed)
      )
    } finally {
      this.setState({ insertingOrUpdatingEquity: false })
    }
  }

  handleDelete(deactivatedEquityId: any, rowData: any) {
    const { assetStatus } = rowData
    this.setState({
      openModal: true,
      deactivatedEquityId: deactivatedEquityId,
      assetStatus: assetStatus
    })
  }

  async handleConfirmYes() {
    const { assumedAMID } = this.props
    const AMId = parseInt(assumedAMID)
    const { deactivatedEquityId: resourceId, assetStatus } = this.state
    this.setState({ insertingOrUpdatingEquity: true })
    try {
      if (assetStatus === 'Active') {
        await api.Assets.deactivate({ AMId, resourceId })
        this.setState({ openModal: false })
        successToast(
          this.props.intl.formatMessage(messages.retireEquitySuccess)
        )
      } else {
        await api.Assets.reactivate({ AMId, resourceId })
        this.setState({ openModal: false })
        successToast(
          this.props.intl.formatMessage(messages.reactivateEquitySuccess)
        )
      }
      this.props.fetchAssets(false)
    } catch (e) {
      console.error(e)
      this.setState({ openModal: false })
      errorToast(
        parseError(e) ||
          this.props.intl.formatMessage(messages.retireEquityFailed)
      )
    } finally {
      this.setState({ insertingOrUpdatingEquity: false })
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
        type="equity"
        loader={this.state.insertingOrUpdatingEquity}
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
        formData={this.props.equities}
        darkProfile={darkProfile}
        assumedAMID={this.props.assumedAMID}
        type="equity"
        loader={this.state.insertingOrUpdatingEquity}
      />
    )
    const equityInActiveMessage = (
      <FormattedMessage
        id="assets.confirmEquityInActiveMessage"
        defaultMessage="Are you sure you want to deactivate {assetId} ?"
        values={{
          assetId: this.state.deactivatedEquityId
        }}
      />
    )

    const equityActiveMessage = (
      <FormattedMessage
        id="assets.confirmEquityReactivateMessage"
        defaultMessage="Are you sure you want to reactivate {assetId} ?"
        values={{
          assetId: this.state.deactivatedEquityId
        }}
      />
    )

    return (
      <div>
        <div style={{ width: '100%', display: 'block', float: 'left' }}>
          <AssetsHeader
            addButtonLabel={this.props.intl.formatMessage(
              messages.addEquityButtonLabel
            )}
            headerFormVisible={this.state.headerFormVisible}
            gridRowExpanded={this.state.gridRowExpanded}
            headerForm={headerForm}
            darkProfile={darkProfile}
            type="equity"
            formOpened={this.formOpened}
            formClosed={this.formClosed}
          />
          <AssetGridSearcher queryFilter={{ assetClass: 'Equity' }} />
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
                ? equityInActiveMessage
                : equityActiveMessage
            }
            handleYes={this.handleConfirmYes}
            handleNo={this.handleConfirmNo}
            openModalProp={this.state.openModal}
            loader={this.state.insertingOrUpdatingEquity}
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

export default injectIntl(EquityContainer)

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

var columns = (dateFormat: string) => [
  {
    Header: <FormattedMessage {...fieldMessages.description} />,
    accessor: 'description'
  },
  {
    Header: <FormattedMessage {...fieldMessages.displayName} />,
    accessor: 'displayName'
  },
  {
    Header: <FormattedMessage {...fieldMessages.assetIssuerId} />,
    accessor: 'assetIssuerId'
  },
  {
    Header: <FormattedMessage {...fieldMessages.assetType} />,
    accessor: 'assetType'
  },
  {
    Header: <FormattedMessage {...fieldMessages.countryId} />,
    accessor: 'countryId'
  },
  {
    Header: <FormattedMessage {...fieldMessages.currency} />,
    accessor: 'currency'
  },
  {
    Header: <FormattedMessage {...fieldMessages.fungible} />,
    id: 'fungible',
    accessor: (row: any) => {
      return row.fungible ? 'True' : 'False'
    }
  },
  {
    Header: <FormattedMessage {...fieldMessages.assetClass} />,
    accessor: 'assetClass'
  },
  {
    Header: <FormattedMessage {...fieldMessages.issueDate} />,
    id: 'issueDate',
    accessor: (row: any) => {
      if (!row.issueDate) return ''
      let resolvedDate
      if (row.issueDate.format) {
        resolvedDate = row.issueDate.format(dateFormat)
      } else if (row.issueDate.toString) {
        resolvedDate = row.issueDate.toString()
      } else {
        resolvedDate = `${row.issueDate}`
      }
      return resolvedDate
    }
  },
  {
    Header: <FormattedMessage {...fieldMessages.maturityDate} />,
    id: 'maturityDate',
    accessor: (row: any) => {
      if (!row.maturityDate) return ''
      let resolvedDate
      if (row.maturityDate.format) {
        resolvedDate = row.maturityDate.format(dateFormat)
      } else if (row.maturityDate.toString) {
        resolvedDate = row.maturityDate.toString()
      } else {
        resolvedDate = `${row.maturityDate}`
      }
      return resolvedDate
    }
  },
  {
    Header: <FormattedMessage {...fieldMessages.venueId} />,
    accessor: 'venueId'
  }
]

interface IAssetsContainerProps {
  dateFormat: string
  assumedAMID: string
  darkProfile: boolean
  assets: any[]
  fetching: boolean
  fetchError: string
  fetchAssets: (amidInRequest?: boolean) => void
}

interface IAssetsContainerState {
  data: {}
  insert: boolean
  headerFormVisible: boolean
  gridRowExpanded: boolean
  openModal: boolean
  deactivatedAssetId: string
  insertingOrUpdatingOther: boolean
  assetStatus: string
}

class OtherAssetsContainer extends React.Component<
  IAssetsContainerProps & InjectedIntlProps,
  IAssetsContainerState
> {
  constructor(props: IAssetsContainerProps & InjectedIntlProps) {
    super(props)
    this.state = {
      data: props.assets,
      insert: false,
      headerFormVisible: false,
      gridRowExpanded: false,
      openModal: false,
      deactivatedAssetId: '',
      insertingOrUpdatingOther: false,
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

  componentDidMount() {
    this.props.fetchAssets(false)
  }

  componentWillReceiveProps(
    nextProps: IAssetsContainerProps & InjectedIntlProps
  ) {
    if (this.props.assets !== nextProps.assets) {
      this.setState({ data: nextProps.assets })
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
    this.setState({ headerFormVisible: true, insertingOrUpdatingOther: true })
    //required process on original array to convert to required API format
    try {
      if (values.deleteButton) delete values.deleteButton
      values = this.convertForDataField(values, 'comments')
      values = this.convertForDataField(values, 'references')
      const links = this.childLinksToObject(values.links)

      const issueDate = values.issueDate
        ? values.issueDate.format('YYYY-MM-DD')
        : null
      const maturityDate = values.maturityDate
        ? values.maturityDate.format('YYYY-MM-DD')
        : null
      const fungible = values.fungible || false

      const assetClasses: any = assets
      const ResolvedAssetClass = assetClasses[values.assetType] || assets.Asset
      const asset = new ResolvedAssetClass({
        ...values,
        fungible,
        issueDate,
        maturityDate,
        links,
        assetManagerId: parseInt(this.props.assumedAMID)
      })
      await api.Assets.insert({ AMId: parseInt(this.props.assumedAMID), asset })
      this.setState({ headerFormVisible: false })
      successToast(this.props.intl.formatMessage(messages.addAssetSuccess))
      this.props.fetchAssets(false)
    } catch (e) {
      console.error(e)
      errorToast(
        parseError(e) || this.props.intl.formatMessage(messages.addAssetFailed)
      )
    } finally {
      this.setState({ insertingOrUpdatingOther: false })
    }
  }

  async handleUpdate(values: any) {
    //required process on original array to convert to required API format
    try {
      if (values.deleteButton) delete values.deleteButton
      values = this.convertForDataField(values, 'comments')
      values = this.convertForDataField(values, 'references')
      const links = this.childLinksToObject(values.links)
      const { assumedAMID } = this.props

      const issueDate = values.issueDate
        ? values.issueDate.format('YYYY-MM-DD')
        : null
      const maturityDate = values.maturityDate
        ? values.maturityDate.format('YYYY-MM-DD')
        : null

      const assetClasses: any = assets
      const ResolvedAssetClass = assetClasses[values.assetType] || assets.Asset
      const asset = new ResolvedAssetClass({
        ...values,
        issueDate,
        maturityDate,
        links,
        assetManagerId: parseInt(assumedAMID)
      })
      await api.Assets.amend({
        AMId: parseInt(assumedAMID),
        resourceId: asset.assetId,
        asset
      })
      successToast(this.props.intl.formatMessage(messages.updateAssetSuccess))
      this.props.fetchAssets(false)
    } catch (e) {
      console.error(e)
      errorToast(
        parseError(e) ||
          this.props.intl.formatMessage(messages.updateAssetFailed)
      )
      this.props.fetchAssets(false)
    } finally {
      this.setState({ insertingOrUpdatingOther: false })
    }
  }

  handleDelete(deactivatedAssetId: any, rowData: any) {
    const { assetStatus } = rowData
    this.setState({
      openModal: true,
      deactivatedAssetId: deactivatedAssetId,
      assetStatus: assetStatus
    })
  }

  async handleConfirmYes() {
    this.setState({ insertingOrUpdatingOther: true })
    const { assumedAMID } = this.props
    const AMId = parseInt(assumedAMID)
    const { deactivatedAssetId: resourceId, assetStatus } = this.state
    try {
      if (assetStatus === 'Active') {
        await api.Assets.deactivate({ AMId, resourceId })
        this.setState({ openModal: false })
        successToast(
          this.props.intl.formatMessage(messages.deactivateAssetSuccess)
        )
      } else {
        await api.Assets.reactivate({ AMId, resourceId })
        this.setState({ openModal: false })
        successToast(
          this.props.intl.formatMessage(messages.reactivateAssetSuccess)
        )
      }
      this.props.fetchAssets(false)
    } catch (e) {
      console.error(e)
      this.setState({ openModal: false })
      errorToast(
        parseError(e) ||
          this.props.intl.formatMessage(messages.deactivateAssetFailed)
      )
    } finally {
      this.setState({ insertingOrUpdatingOther: false })
    }
  }

  handleConfirmNo() {
    this.setState({ openModal: false })
  }

  // CRUD methods : ENDS

  render() {
    const { fetching } = this.props
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
          messages.addAssetButtonLabel
        )}
        cancelButtonLabel={this.props.intl.formatMessage(
          messages.cancelButtonLabel
        )}
        onFormSubmit={this.handleAdd}
        type="otherAsset"
        darkProfile={this.props.darkProfile}
        loader={this.state.insertingOrUpdatingOther}
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
        formData={this.props.assets}
        type="otherAsset"
        assumedAMID={this.props.assumedAMID}
        darkProfile={this.props.darkProfile}
        loader={this.state.insertingOrUpdatingOther}
      />
    )
    const allInActiveMessage = (
      <FormattedMessage
        id="assets.confirmAllInActiveMessage"
        defaultMessage="Are you sure you want to deactivate {assetId} ?"
        values={{
          assetId: this.state.deactivatedAssetId
        }}
      />
    )

    const allActiveMessage = (
      <FormattedMessage
        id="assets.confirmAllReactivateMessage"
        defaultMessage="Are you sure you want to reactivate {assetId} ?"
        values={{
          assetId: this.state.deactivatedAssetId
        }}
      />
    )
    return (
      <div>
        <div style={{ width: '100%', display: 'block', float: 'left' }}>
          <AssetsHeader
            addButtonLabel={this.props.intl.formatMessage(
              messages.addAssetButtonLabel
            )}
            headerFormVisible={this.state.headerFormVisible}
            gridRowExpanded={this.state.gridRowExpanded}
            headerForm={headerForm}
            type="otherAsset"
            darkProfile={this.props.darkProfile}
            formOpened={this.formOpened}
            formClosed={this.formClosed}
          />
          <AssetGridSearcher
            queryFilter={{
              assetClass: ['Asset']
            }}
          />
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
            darkProfile={this.props.darkProfile}
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
                ? allInActiveMessage
                : allActiveMessage
            }
            handleYes={this.handleConfirmYes}
            handleNo={this.handleConfirmNo}
            openModalProp={this.state.openModal}
            darkProfile={this.props.darkProfile}
            loader={this.state.insertingOrUpdatingOther}
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

export default injectIntl(OtherAssetsContainer)

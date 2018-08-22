import React from 'react'
import { render } from 'react-dom'
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl'
import { api, assets } from '@amaas/amaas-core-sdk-js'
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
import { convertToAMaaSDate } from 'utils/form'
import { Button } from 'semantic-ui-react'

var columns = [
  {
    Header: <FormattedMessage {...fieldMessages.displayName} />,
    accessor: 'displayName'
  },
  {
    Header: <FormattedMessage {...fieldMessages.countryId} />,
    accessor: 'countryId'
  },
  {
    Header: <FormattedMessage {...fieldMessages.description} />,
    accessor: 'description'
  },
  {
    Header: <FormattedMessage {...fieldMessages.fundType} />,
    accessor: 'fundType'
  }
]

export interface IETFContainerProps {
  assumedAMID: string
  etf: any[] // change to fx or etfs
  fetching: boolean
  fetchError: string
  fetchAssets: (amidInRequest?: boolean) => void
  darkProfile: boolean
  dateFormat: string
}

interface IETFContainerState {
  data: assets.ExchangeTradedFund[]
  insert: boolean
  headerFormVisible: boolean
  gridRowExpanded: boolean
  openModal: boolean
  deactivatedETFId: string
  insertingOrUpdatingETF: boolean
  closeFormOnSuccess: boolean
  assetStatus: string
}

class ETFContainer extends React.Component<
  IETFContainerProps & InjectedIntlProps,
  IETFContainerState
> {
  constructor(props: IETFContainerProps & InjectedIntlProps) {
    super(props)
    this.state = {
      data: props.etf,
      insert: false,
      headerFormVisible: false,
      gridRowExpanded: false,
      openModal: false,
      deactivatedETFId: '',
      insertingOrUpdatingETF: false,
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

  componentWillReceiveProps(nextProps: IETFContainerProps & InjectedIntlProps) {
    if (this.props.etf !== nextProps.etf) {
      this.setState({ data: nextProps.etf })
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
    this.setState({ insertingOrUpdatingETF: true, headerFormVisible: true })
    const { assumedAMID } = this.props
    try {
      const convertDate = convertToAMaaSDate(this.props.dateFormat)
      values = this.convertForDataField(values, 'comments')
      values = this.convertForDataField(values, 'references')
      const links = this.childLinksToObject(values.links)
      const creationDate = values.creationDate
        ? values.creationDate.format('YYYY-MM-DD')
        : null
      const expiryDate = values.expiryDate
        ? values.expiryDate.format('YYYY-MM-DD')
        : null
      const rollPrice = values.rollPrice || false
      const etf = new assets.ExchangeTradedFund({
        ...values,
        rollPrice,
        creationDate,
        expiryDate,
        links,
        assetManagerId: parseInt(assumedAMID) // ensure int
      })
      await api.Assets.insert({ AMId: parseInt(assumedAMID), asset: etf })
      this.setState({ headerFormVisible: false })
      successToast(this.props.intl.formatMessage(messages.addETFSuccess))
      this.props.fetchAssets(false)
    } catch (e) {
      console.error(e)
      errorToast(
        parseError(e) || this.props.intl.formatMessage(messages.addETFFailed)
      )
    } finally {
      this.setState({ insertingOrUpdatingETF: false })
    }
  }

  async handleUpdate(values: any) {
    this.setState({ insertingOrUpdatingETF: true })
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

      const etf = new assets.ExchangeTradedFund({
        ...values,
        ...valueDates,
        links,
        assetManagerId: parseInt(assumedAMID) // ensure int
      })
      await api.Assets.amend({
        AMId: parseInt(assumedAMID),
        resourceId: etf.assetId,
        asset: etf
      })
      successToast(this.props.intl.formatMessage(messages.updateETFSuccess))
      this.props.fetchAssets(false)
    } catch (e) {
      this.setState({ insertingOrUpdatingETF: false })
      console.error(e)
      errorToast(
        parseError(e) || this.props.intl.formatMessage(messages.updateETFFailed)
      )
    } finally {
      this.setState({ insertingOrUpdatingETF: false })
    }
  }

  handleDelete(deactivatedETFId: any, rowData: any) {
    const { assetStatus } = rowData
    this.setState({
      openModal: true,
      deactivatedETFId: deactivatedETFId,
      assetStatus: assetStatus
    })
  }

  async handleConfirmYes() {
    const { assumedAMID } = this.props
    const AMId = parseInt(assumedAMID)
    const { deactivatedETFId: resourceId, assetStatus } = this.state
    this.setState({ insertingOrUpdatingETF: true })
    try {
      if (assetStatus === 'Active') {
        await api.Assets.deactivate({ AMId, resourceId })
        this.setState({ openModal: false })
        successToast(this.props.intl.formatMessage(messages.retireETFSuccess))
      } else {
        await api.Assets.reactivate({ AMId, resourceId })
        this.setState({ openModal: false })
        successToast(
          this.props.intl.formatMessage(messages.reactivateETFSuccess)
        )
      }
      this.props.fetchAssets(false)
    } catch (e) {
      console.error(e)
      this.setState({ openModal: false })
      errorToast(
        parseError(e) || this.props.intl.formatMessage(messages.retireETFFailed)
      )
    } finally {
      this.setState({ insertingOrUpdatingETF: false })
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
        type="etf"
        loader={this.state.insertingOrUpdatingETF}
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
        formData={this.props.etf}
        darkProfile={darkProfile}
        assumedAMID={this.props.assumedAMID}
        type="etf"
        loader={this.state.insertingOrUpdatingETF}
      />
    )
    const etfInActiveMessage = (
      <FormattedMessage
        id="assets.confirmEtfInActiveMessage"
        defaultMessage="Are you sure you want to deactivate {assetId} ?"
        values={{
          assetId: this.state.deactivatedETFId
        }}
      />
    )

    const etfActiveMessage = (
      <FormattedMessage
        id="assets.confirmEtfReactivateMessage"
        defaultMessage="Are you sure you want to reactivate {assetId} ?"
        values={{
          assetId: this.state.deactivatedETFId
        }}
      />
    )
    return (
      <div>
        <div style={{ width: '100%', display: 'block', float: 'left' }}>
          <AssetsHeader
            addButtonLabel={this.props.intl.formatMessage(
              messages.addETFButtonLabel
            )}
            headerFormVisible={this.state.headerFormVisible}
            gridRowExpanded={this.state.gridRowExpanded}
            headerForm={headerForm}
            darkProfile={darkProfile}
            type="etf"
            formOpened={this.formOpened}
            formClosed={this.formClosed}
          />
          <AssetGridSearcher
            queryFilter={{ assetType: 'ExchangeTradedFund' }}
          />
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
                ? etfInActiveMessage
                : etfActiveMessage
            }
            handleYes={this.handleConfirmYes}
            handleNo={this.handleConfirmNo}
            openModalProp={this.state.openModal}
            loader={this.state.insertingOrUpdatingETF}
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

export default injectIntl(ETFContainer)

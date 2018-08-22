import React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { ReactTableDefaults } from 'react-table'
import { api, transactions } from '@amaas/amaas-core-sdk-js'
import startCase from 'lodash/startCase'
import Loadable from 'react-loadable'
import moment from 'moment'

import Loader from 'components/Shared/Loader'
import { dateFilterMethod, dateSortMethod, numberSortMethod } from 'utils/table'
import { removeTrailingSlash } from 'utils/router'
import { normaliseCurrency } from 'utils/form'
import { dateFormats } from 'reducers/profile'
import TransactionsGrid from 'components/Protected/Portfolio/TransactionsGrid'
import DataLoadingError from 'components/Shared/DataLoadingError'
import TransactionStatusDropDown from 'containers/Protected/Portfolio/TransactionsList/TransactionStatusDropDown'

import DefaultCell from 'components/Shared/ArgomiGrid/ComponentOverrides/CustomDefaultCell'
import NumberCell from 'components/Shared/TableCells/NumberCell'
import LinkCell from 'components/Shared/TableCells/LinkCell'
import DateCell from 'containers/Shared/TableCells/DateCell'

const headerAttributes = [
  'transactionDate',
  'assetPrimaryReference',
  'displayName',
  'transactionType',
  'transactionAction',
  'quantity',
  'price',
  'grossSettlement',
  'netSettlement',
  'transactionCurrency',
  'settlementCurrency',
  'assetBookId',
  'counterpartyBookId',
  'transactionId',
  'assetId',
  'settlementDate',
  'assetType',
  'transactionStatus'
]

const transactionStatusOptions = [
  { key: 'new', value: 'New', text: 'New' },
  { key: 'amended', value: 'Amended', text: 'Amended' },
  { key: 'cancelled', value: 'Cancelled', text: 'Cancelled' }
]

interface ITransactionProps extends RouteComponentProps<{}> {
  version?: boolean
}

interface IConnectInjectedProps {
  dateFormat: dateFormats
  assumedAMID: string
  transactionsFetching: boolean
  fetchTransactions: Function
  transactions: (transactions.Transaction & {
    assetType: string
    assetClass: string
  })[]
  fetchError: string
  transactionStatusDropDownField: string[]
}

interface IExpandedRows {
  [rowIndex: number]: boolean
}

const LoadableEquityForm = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'EditEquityTransaction' */ 'components/Protected/Portfolio/EditTransaction/Forms/equityForm'),
  loading: () => <Loader delay={200} />
})

const LoadableFXForm = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'EditFXTransaction' */ 'components/Protected/Portfolio/EditTransaction/Forms/fxForm'),
  loading: () => <Loader delay={200} />
})

const LoadableFutureForm = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'EditFutureTransaction' */ 'components/Protected/Portfolio/EditTransaction/Forms/futureForm'),
  loading: () => <Loader delay={200} />
})

const LoadableCashForm = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'EditCashTransaction' */ 'components/Protected/Portfolio/EditTransaction/Forms/cashForm'),
  loading: () => <Loader text="Loading Transaction..." />
})

const LoadableGenericForm = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'EditGenericTransaction */ 'components/Protected/Portfolio/EditTransaction/Forms/genericForm'),
  loading: () => <Loader delay={200} />
})

const fetchFields = [
  'assetManagerId',
  'transactionDate',
  'references',
  'displayName',
  'transactionType',
  'transactionAction',
  'quantity',
  'price',
  'grossSettlement',
  'netSettlement',
  'transactionCurrency',
  'settlementCurrency',
  'assetBookId',
  'counterpartyBookId',
  'transactionId',
  'assetId',
  'settlementDate',
  'version',
  'transactionStatus'
]

class Transactions extends React.Component<
  ITransactionProps & IConnectInjectedProps
> {
  constructor(props: ITransactionProps & IConnectInjectedProps) {
    super(props)
  }

  componentDidMount() {
    // this.fetchTransactions(this.props.transactionStatusDropDownField)
    this.props.fetchTransactions({
      fields: fetchFields
    })
  }

  fetchTransactions(queryFilters: string[]) {
    const { fetchTransactions, transactionStatusDropDownField } = this.props
    const query: any = { fields: fetchFields }
    if (queryFilters) {
      query['transactionStatuses'] = queryFilters
    }
    this.props.fetchTransactions(query)
  }

  componentWillReceiveProps(
    nextProps: ITransactionProps & IConnectInjectedProps
  ) {
    if (
      nextProps.assumedAMID != this.props.assumedAMID ||
      nextProps.transactionStatusDropDownField !=
        this.props.transactionStatusDropDownField
    ) {
      this.fetchTransactions(nextProps.transactionStatusDropDownField)
    }
  }

  buildColumns(data: transactions.Transaction[]) {
    return headerAttributes.map((attr: string) => {
      const isNumber =
        attr === 'grossSettlement' ||
        attr === 'netSettlement' ||
        attr === 'price' ||
        attr === 'quantity'
      const isDate = attr === 'transactionDate' || attr === 'settlementDate'
      const isTransactionId = attr === 'transactionId'
      return {
        Header: startCase(attr),
        id: attr,
        accessor: attr,
        Cell: (row: any) => {
          const rawValue = row.original[attr]
          if (isNumber) {
            return <NumberCell number={rawValue} {...row} />
          }
          if (isDate) {
            return <DateCell date={rawValue} {...row} />
          }
          if (isTransactionId) {
            const link = `${removeTrailingSlash(
              this.props.match.url
            )}/${rawValue}`
            const linkContent = rawValue
            return <LinkCell linkTo={link} linkContent={linkContent} {...row} />
          }
          return <DefaultCell {...row} />
        },
        sortMethod: (a: any, b: any) => {
          try {
            if (isDate) return dateSortMethod(this.props.dateFormat)(a, b)
            if (isNumber) return numberSortMethod(a, b)
            return ReactTableDefaults.defaultSortMethod(a, b)
          } catch (e) {
            // just use the default method
            return ReactTableDefaults.defaultSortMethod(a, b)
          }
        },
        filterMethod: isDate
          ? dateFilterMethod(this.props.dateFormat)
          : undefined
      }
    })
  }

  render() {
    const {
      fetchTransactions,
      transactions,
      transactionsFetching,
      fetchError
    } = this.props
    return (
      <div>
        <TransactionStatusDropDown
          formStyles={{
            display: 'inline-block',
            width: '350px',
            margin: '0 0 14px 0'
          }}
          isMultiple={true}
          options={transactionStatusOptions}
          placeholder="Transaction Types"
        />
        {fetchError ? (
          <DataLoadingError
            message={fetchError}
            refetchFunction={this.props.fetchTransactions.bind(this, {
              fields: fetchFields
            })}
          />
        ) : (
          <TransactionsGrid
            data={transactions}
            columns={this.buildColumns(transactions)}
            filterable
            defaultSorted={[
              {
                id: 'transactionDate',
                desc: true
              }
            ]}
            loading={transactionsFetching}
            SubComponent={({ original: row }: { original: any }) => {
              const idFilter = (trans: transactions.Transaction) =>
                trans.transactionId === row.transactionId
              const versionFilter = (trans: transactions.Transaction) =>
                trans.version === row.version
              const trans = transactions.find(
                this.props.version ? versionFilter : idFilter
              ) || {
                assetClass: '',
                assetType: '',
                spotOrForward: '',
                transactionStatus: ''
              }
              const { assetClass, assetType, transactionStatus } = trans

              let type: 'Edit' | 'ReadOnly' | 'New' = 'Edit'
              if (transactionStatus === 'Cancelled') {
                type = 'ReadOnly'
              }
              let initialValues = trans
              switch (assetClass) {
                case 'ForeignExchange':
                  initialValues = {
                    ...initialValues,
                    spotOrForward: trans.assetType
                  }
                  return (
                    <LoadableFXForm
                      type={type}
                      initialValues={initialValues}
                      assetType={assetType}
                    />
                  )
                case 'Future':
                  return (
                    <LoadableFutureForm
                      type={type}
                      initialValues={initialValues}
                      assetType={assetType}
                    />
                  )
                case 'Currency':
                  return (
                    <LoadableCashForm
                      type={type}
                      initialValues={initialValues}
                      assetType={assetType}
                    />
                  )
                case 'Equity':
                case 'Fund':
                  return (
                    <LoadableEquityForm
                      type={type}
                      initialValues={initialValues}
                      assetType={assetType}
                    />
                  )
                default:
                  return (
                    <LoadableGenericForm
                      type={type}
                      initialValues={initialValues}
                      assetType={assetType}
                    />
                  )
              }
            }}
          />
        )}

        {/* Server side rendering won't work because we don't have sorting in the endpoint */}
        {/* <ReactTable
        data={transactions}
        columns={this.renderColumns(transactions)}
        loading={transactionsFetching}
        manual
        onFetchData={(state: any, instance: any) => {
          fetchTransactions({ pageNo: [state.page], pageSize: [state.pageSize] })
        }}
      /> */}
      </div>
    )
  }
}

export default (props: ITransactionProps & IConnectInjectedProps) => (
  <Transactions {...props} />
)

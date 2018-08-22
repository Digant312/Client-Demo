import React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import startCase from 'lodash/startCase'
import { ReactTableDefaults } from 'react-table'
import Loadable from 'react-loadable'
import { transactions } from '@amaas/amaas-core-sdk-js'
import { Button } from 'semantic-ui-react'

import TransactionGrid from '../TransactionsGrid'
import { normaliseCurrency } from 'utils/form'
import { dateSortMethod } from 'utils/table'
import Loader from 'components/Shared/Loader'
import { dateFormats } from 'reducers/profile'

import DefaultCell from 'components/Shared/ArgomiGrid/ComponentOverrides/CustomDefaultCell'
import NumberCell from 'components/Shared/TableCells/NumberCell'
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
  'version'
]

const LoadableEquityForm = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'EditTransaction' */ 'components/Protected/Portfolio/EditTransaction/Forms/equityForm'),
  loading: () => <Loader delay={200} />
})

const LoadableFXForm = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'EditTransaction' */ 'components/Protected/Portfolio/EditTransaction/Forms/fxForm'),
  loading: () => <Loader delay={200} />
})

const LoadableFutureForm = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'EditFutureTransaction' */ 'components/Protected/Portfolio/EditTransaction/Forms/futureForm'),
  loading: () => <Loader delay={200} />
})

export interface ITranasctionHistoryOwnProps
  extends RouteComponentProps<{ transactionId: string }> {}

export interface ITransactionHistoryMapProps {
  assumedAMID: string
  dateFormat: dateFormats
  fetchingTransactionsForGrid: boolean
  transactionsInGrid: (transactions.Transaction & {
    assetClass: string
    assetType: string
  })[]
  fetchTransactionsForGridError: string
  fetchingTransactionForExpandedRow: boolean
  transactionForExpandedRow?: transactions.Transaction
  fetchingTransactionForExpandedRowError: string
}

export interface ITransactionHistoryDispatchProps {
  fetchTransactionsForGrid: (transactionId: string) => void
  fetchTransactionForExpandedRow: (
    transactionId: string,
    version: number
  ) => void
}

export default class TransactionHistory extends React.Component<
  ITranasctionHistoryOwnProps &
    ITransactionHistoryMapProps &
    ITransactionHistoryDispatchProps
> {
  componentDidMount() {
    this.props.fetchTransactionsForGrid(this.props.match.params.transactionId)
  }

  componentWillReceiveProps(
    nextProps: ITranasctionHistoryOwnProps &
      ITransactionHistoryMapProps &
      ITransactionHistoryDispatchProps
  ) {
    if (
      nextProps.assumedAMID &&
      this.props.assumedAMID != nextProps.assumedAMID
    ) {
      this.props.fetchTransactionsForGrid(this.props.match.params.transactionId)
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
          return <DefaultCell {...row} />
        }
        // accessor: (d: any) => {
        //   const isNumber =
        //     attr === 'grossSettlement' ||
        //     attr === 'netSettlement' ||
        //     attr === 'price' ||
        //     attr === 'quantity'
        //   const isDate = attr === 'transactionDate' || attr === 'settlementDate'
        //   if (isNumber) {
        //     return normaliseCurrency(d[attr])
        //   }
        //   if (isDate) {
        //     if (!d[attr].format) {
        //       console.warn(
        //         'Expected moment object with .format method, got: ',
        //         d[attr]
        //       )
        //       return
        //     }
        //     return d[attr].format(this.props.dateFormat)
        //   }
        //   return d[attr]
        //     ? d[attr].toFixed ? d[attr].toFixed() : d[attr]
        //     : null
        // }
      }
    })
  }

  render() {
    const {
      assumedAMID,
      dateFormat,
      transactionsInGrid,
      fetchingTransactionsForGrid
    } = this.props
    return (
      <div>
        <div style={{ marginBottom: '10px' }}>
          <Button
            compact
            size="tiny"
            content="Back to Transactions"
            icon="angle left"
            labelPosition="left"
            as={Link}
            to={this.props.match.path.split(':')[0]}
          />
        </div>
        {fetchingTransactionsForGrid ? (
          <Loader delay={200} />
        ) : (
          <TransactionGrid
            data={transactionsInGrid}
            columns={this.buildColumns(transactionsInGrid)}
            filterable
            defaultSorted={[
              {
                id: 'version',
                desc: true
              }
            ]}
            SubComponent={({ original: row }: { original: any }) => {
              const versionFilter = (
                trans: transactions.Transaction & {
                  assetClass: string
                  assetType: string
                }
              ) => trans.version === row.version
              const trans = transactionsInGrid.find(versionFilter)
              if (!trans) return <div>No Transaction Found</div>

              switch (trans.assetClass) {
                case 'Future':
                  return (
                    <LoadableFutureForm
                      type="Edit"
                      initialValues={trans}
                      assetType={trans.assetType}
                    />
                  )
                case 'ForeignExchange':
                  return (
                    <LoadableFXForm
                      type="ReadOnly"
                      initialValues={trans}
                      assetType={trans.assetType}
                    />
                  )
                case 'Equity':
                default:
                  return (
                    <LoadableEquityForm
                      type="ReadOnly"
                      initialValues={trans}
                      assetType={trans.assetType}
                    />
                  )
              }
            }}
          />
        )}
      </div>
    )
  }
}

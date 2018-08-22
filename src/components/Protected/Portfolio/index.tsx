import React from 'react'
import { Link, Redirect, Route, RouteComponentProps } from 'react-router-dom'
import { defineMessages, FormattedMessage } from 'react-intl'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import union from 'lodash/union'
import startCase from 'lodash/startCase'
import { transactions } from '@amaas/amaas-core-sdk-js'
import { Button } from 'semantic-ui-react'
import Loadable from 'react-loadable'

import MainLayout from 'containers/Shared/Layouts/Protected/Main'
import Transactions from 'containers/Protected/Portfolio/TransactionsList'
import Positions from 'containers/Protected/Portfolio/PositionsList'
import NewTransaction from 'containers/Protected/Portfolio/NewTransaction'
import Loader from 'components/Shared/Loader'
import { IState } from 'reducers'
import { dataSelector } from 'selectors'

const messages = defineMessages({
  positions: {
    id: 'portfolio.positions',
    defaultMessage: 'Positions'
  },
  transactions: {
    id: 'portfolio.transactions',
    defaultMessage: 'Transactions'
  },
  newTransaction: {
    id: 'portfolio.newTransaction',
    defaultMessage: 'New Transaction'
  },
  transactionHistory: {
    id: 'portfolio.transactionHistory',
    defaultMessage: 'Transaction History'
  }
})

const LoadableTransactionHistory = Loadable({
  loader: () =>
    import(/* webpackChunkName: transactionHistoryRoute */ 'containers/Protected/Portfolio/TransactionHistory'),
  loading: () => <Loader delay={200} />
})

interface IPortfolioProps {
  positions: transactions.Position[]
}

const Portfolio = (props: IPortfolioProps & RouteComponentProps<{}>) => {
  const menuConfig = [
    {
      name: <FormattedMessage {...messages.positions} />,
      path: `${props.match.url}/positions`,
      exact: true,
      component: Positions
    },
    {
      name: <FormattedMessage {...messages.transactions} />,
      path: `${props.match.url}/transactions`,
      exact: true,
      component: Transactions
    },
    {
      name: <FormattedMessage {...messages.newTransaction} />,
      path: `${props.match.url}/new-transaction`,
      render: () => <NewTransaction />
    },
    {
      name: <FormattedMessage {...messages.transactionHistory} />,
      path: `${props.match.url}/transactions/:transactionId`,
      component: LoadableTransactionHistory,
      visible: false
    }
  ]
  if (props.location.pathname === props.match.path)
    return <Redirect to={`${props.match.url}/positions`} />
  return <MainLayout showBookSelector subMenu={menuConfig} />
}

export default Portfolio

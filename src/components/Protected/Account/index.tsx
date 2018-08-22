import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { Button, Header, Icon, Segment } from 'semantic-ui-react'
import Loadable from 'react-loadable'
import { defineMessages, FormattedMessage } from 'react-intl'

import MainLayout from 'containers/Shared/Layouts/Protected/Main'
import Loader from 'components/Shared/Loader'

import './styles.scss'

interface IAccountProps extends RouteComponentProps<{}> {
  darkProfile: boolean
}

const LoadablePersonal = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'accountPersonalChunk' */ 'containers/Protected/Account/Personal'),
  loading: () => <Loader delay={200} />
})

const LoadableCompany = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'accountCompanyChunk' */ 'containers/Protected/Account/Company'),
  loading: () => <Loader delay={200} />
})

const messages = defineMessages({
  personal: {
    id: 'account.Personal',
    defaultMessage: 'Personal'
  },
  company: {
    id: 'account.Company',
    defaultMessage: 'Company'
  }
})

const Account = (accountProps: IAccountProps) => {
  const { darkProfile } = accountProps
  const config = [
    {
      name: <FormattedMessage {...messages.personal} />,
      path: `${accountProps.match.url}/personal`,
      exact: true,
      render: (props: RouteComponentProps<{}>) => (
        <LoadablePersonal {...props} />
      )
    },
    {
      name: <FormattedMessage {...messages.company} />,
      path: `${accountProps.match.url}/company`,
      exact: true,
      render: (props: RouteComponentProps<{}>) => <LoadableCompany {...props} />
    }
  ]
  if (accountProps.location.pathname === accountProps.match.path)
    return <Redirect to={`${accountProps.match.url}/personal`} />
  return <MainLayout subMenu={config} />
}

export default Account

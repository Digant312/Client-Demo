import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { defineMessages, FormattedMessage } from 'react-intl'
import Loadable from 'react-loadable'

import MainLayout from 'containers/Shared/Layouts/Protected/Main'
import Loader from 'components/Shared/Loader'

const messages = defineMessages({
  items: {
    id: 'monitor.items',
    defaultMessage: 'Items'
  },
  calendar: {
    id: 'monitor.calendar',
    defaultMessage: 'Calendar'
  },
  activities: {
    id: 'monitor.activities',
    defaultMessage: 'Activities'
  }
})

const LoadableMonitor = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'monitorItemRoute' */ 'containers/Protected/Monitor/ItemList'),
  loading: () => <Loader delay={200} />
})

const LoadableActivity = Loadable({
  loader: () => import('containers/Protected/Monitor/MonitorActivity'),
  loading: () => <Loader delay={200} />
})

interface IMonitorProps {}

const Monitor = (props: IMonitorProps & RouteComponentProps<{}>) => {
  const menuConfig = [
    {
      name: <FormattedMessage {...messages.activities} />,
      path: `${props.match.url}/activities`,
      component: LoadableActivity
    },
    {
      name: <FormattedMessage {...messages.items} />,
      path: `${props.match.url}/items`,
      exact: true,
      component: LoadableMonitor
    }
    // {
    //   name: <FormattedMessage {...messages.calendar} />,
    //   path: `${props.match.url}/calendar`,
    //   component: () => <div>Calendar</div>
    // }
  ]
  if (props.location.pathname === props.match.path)
    return <Redirect to={`${props.match.url}/items`} />
  return <MainLayout subMenu={menuConfig} />
}

export default Monitor

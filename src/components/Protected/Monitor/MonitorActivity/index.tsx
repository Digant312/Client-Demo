import React from 'react'
import ReactTable from 'react-table'
import { api, monitor } from '@amaas/amaas-core-sdk-js'
import {
  Button,
  Header,
  Icon,
  Label,
  Segment,
  List,
  Divider,
  Message,
  Grid
} from 'semantic-ui-react'

import MainLayout from 'containers/Shared/Layouts/Protected/Main'
import Loader from 'components/Shared/Loader'
import injectProps from 'components/Shared/InjectProps'
import ActivityList from './ActivityList'

interface IMonitorActivityProps {
  close: Function
  resubmit: Function
  darkProfile: boolean
}

interface IConnectInjectedProps {
  assumedAMID: string
  activities: monitor.Activity[]
  fetchMonitorActivities: () => void
  activitiesFetching: boolean
}

interface IMonitorActivityState {
  closing: boolean
  resubmitting: boolean
  closeError: string
  resubmitError: string
}

class MonitorActivity extends React.Component<
  IMonitorActivityProps & IConnectInjectedProps,
  IMonitorActivityState
> {
  mounted: boolean
  constructor() {
    super()
    this.state = {
      closing: false,
      resubmitting: false,
      closeError: '',
      resubmitError: ''
    }
  }

  componentDidMount() {
    this.props.fetchMonitorActivities()
  }

  componentWillReceiveProps(
    nextProps: IMonitorActivityProps & IConnectInjectedProps
  ) {
    if (this.props.assumedAMID !== nextProps.assumedAMID)
      this.props.fetchMonitorActivities()
  }

  render() {
    const {
      assumedAMID,
      darkProfile,
      activities,
      activitiesFetching,
      fetchMonitorActivities
    } = this.props

    return (
      <div>
        <Segment basic inverted={darkProfile}>
          <Header as="h2" floated="left">
            <Icon name="list ul" inverted={darkProfile} />
            Activities
          </Header>
          <Button
            icon="refresh"
            floated="right"
            onClick={this.props.fetchMonitorActivities}
          />
          {activitiesFetching ? (
            <div style={{ clear: 'left' }}>
              <Loader delay={200} />
            </div>
          ) : (
            <ActivityList data={activities} />
          )}
        </Segment>
      </div>
    )
  }
}

export default injectProps<IMonitorActivityProps & IConnectInjectedProps>({})(
  MonitorActivity
)

import { connect } from 'react-redux'
import { monitor } from '@amaas/amaas-core-sdk-js'

import { IState } from 'reducers'
import { dataSelector, profileSelector } from 'selectors'
import { fetchActivities } from 'actions/data'
import MonitorActivity from 'components/Protected/Monitor/MonitorActivity'

interface IMapStateProps {
  activities: any[]
  activitiesFetching: boolean
}

interface IMapDispatchProps {
  fetchMonitorActivities: Function
}

const mapStateToProps = (state: IState) => ({
  assumedAMID: profileSelector(state).assumedAMID,
  activities: dataSelector(state).activities.data,
  activitiesFetching: dataSelector(state).activities.fetching
})

const mapDispatchToProps = (dispatch: Function) => ({
  fetchMonitorActivities: () => dispatch(fetchActivities())
})

export default connect<IMapStateProps, IMapDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps
)(MonitorActivity)

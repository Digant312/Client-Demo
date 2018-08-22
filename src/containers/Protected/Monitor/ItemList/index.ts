import { connect } from 'react-redux'
import { monitor } from '@amaas/amaas-core-sdk-js'

import { IState } from 'reducers'
import { dataSelector, profileSelector } from 'selectors'
import { fetchMonitor } from 'actions/data'
import ItemList from 'components/Protected/Monitor/ItemList'

interface IMapStateProps {
  monitor: monitor.Item[]
  monitorFetching: boolean
}

interface IMapDispatchProps {
  fetchMonitorItems: Function
}

const mapStateToProps = (state: IState) => (
  {
    assumedAMID: profileSelector(state).assumedAMID,
    monitor: dataSelector(state).monitor.data,
    monitorFetching: dataSelector(state).monitor.fetching
  }
)

const mapDispatchToProps = (dispatch: Function) => (
  {
    fetchMonitorItems: () => dispatch(fetchMonitor())
  }
)

export default connect<IMapStateProps, IMapDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps
)(ItemList)
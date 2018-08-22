import { connect } from 'react-redux'

import NewTransaction from 'components/Protected/Portfolio/NewTransaction'
import { fetchTransactions } from 'actions/data'
import { IState } from 'reducers'
import { dataSelector, profileSelector } from 'selectors'

interface IMapStateProps {
  assumedAMID: string
}

interface IMapDispatchProps {
  fetchTransactions: Function
}

const mapStateToProps = (state: IState) => (
  {
    assumedAMID: profileSelector(state).assumedAMID
  }
)

const mapDispatchToProps = (dispatch: Function) => (
  {
    fetchTransactions: (query?: any) => dispatch(fetchTransactions(query))
  }
)

export default connect<{}, IMapDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps
)(NewTransaction)
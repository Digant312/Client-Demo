import { connect } from 'react-redux'

import { IState } from 'reducers'
import { profileSelector } from 'selectors'
import { fetchParties } from 'actions/data'

import PartyGridSearcher from 'components/Shared/PartyGridSearcher'

interface IQuery {
  [queryKey: string]: string | string[]
}

const mapStateToProps = (state: IState) => (
  {
    assumedAMID: profileSelector(state).assumedAMID
  }
)

const mapDispatchToProps = (dispatch: Function) => (
  {
    getParties: (query: IQuery) => dispatch(fetchParties(query))
  }
)
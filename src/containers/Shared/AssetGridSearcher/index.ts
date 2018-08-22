import { connect } from 'react-redux'

import { IState } from 'reducers'
import { profileSelector } from 'selectors'
import { fetchAssets } from 'actions/data'

import AssetGridSearcher from 'components/Shared/AssetGridSearcher'

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
    getAssets: (query: IQuery) => dispatch(fetchAssets(query))
  }
)

export default connect<{ assumedAMID: string }, { getAssets: Function }, { queryFilter?: object }>(
  mapStateToProps,
  mapDispatchToProps
)(AssetGridSearcher)
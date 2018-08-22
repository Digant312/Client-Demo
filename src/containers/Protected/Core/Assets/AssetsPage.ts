import { connect } from 'react-redux'
import AssetsPage, {
  IAssetsPageProps
} from 'components/Protected/Core/Assets/AssetsPage'
import { IState } from 'reducers'
import { dataSelector, profileSelector } from 'selectors'
import { fetchAssets } from 'actions/data'

// Return shape of mapStateToProps
interface IMapStateProps {
  assetId: string
  assets: any[] // change equities to fx or futures
  fetching: boolean
  fetchError: string
  darkProfile: boolean
}
const mapStateToProps = (state: IState) => ({
  assumedAMID: profileSelector(state).assumedAMID,
  assetManagerId: profileSelector(state).assetManagerId,
  fetching: dataSelector(state).assets.fetching,
  assets: dataSelector(state).assets.data,
  darkProfile: profileSelector(state).darkProfile
})

const mapDispatchToProps = (dispatch: Function) => ({
  fetchAssets: (assetId: string) => {
    const query = {
      assetIds: assetId
    }
    dispatch(fetchAssets(query))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(AssetsPage)

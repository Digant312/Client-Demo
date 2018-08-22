import { connect } from 'react-redux'
import OtherAssetsContainer from 'components/Protected/Core/Assets/OtherAssets/OtherAssetsContainer'
import { IState } from 'reducers'
import { dataSelector, profileSelector } from 'selectors'
import { fetchAssets } from 'actions/data'

interface IMapStateProps {
  dateFormat: string
  assumedAMID: string
  darkProfile: boolean
  assets: any[]
  fetching: boolean
  fetchError: string
}

interface IDispatchProps {
  fetchAssets: (userQuery?: object) => void
}

const mapStateToProps = (state: IState) => ({
  dateFormat: profileSelector(state).dateFormat,
  assumedAMID: profileSelector(state).assumedAMID,
  darkProfile: profileSelector(state).darkProfile,
  assets: dataSelector(state).assets.data,
  fetching: dataSelector(state).assets.fetching,
  fetchError: dataSelector(state).assets.error
})

const mapDispatchToProps = (dispatch: Function) => ({
  fetchAssets: (userQuery?: any) => {
    const query = {
      assetClasses: ['Asset'],
      ...userQuery
    }
    dispatch(fetchAssets(query))
  }
})

const mergeProps = (
  stateProps: IMapStateProps,
  dispatchProps: IDispatchProps,
  ownProps: any
) =>
  Object.assign({}, ownProps, stateProps, {
    fetchAssets: (amidInRequest: boolean = true, userQuery?: object) => {
      const { assumedAMID } = stateProps
      if (!amidInRequest) {
        userQuery = {
          ...userQuery,
          includePublic: false,
          includeDataSources: false
        }
      }
      dispatchProps.fetchAssets(userQuery)
    }
  })

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  OtherAssetsContainer
)

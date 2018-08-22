import { connect } from 'react-redux'
import { InjectedIntlProps } from 'react-intl'

import EquityContainer, {
  IAssetsContainerProps
} from 'components/Protected/Core/Assets/Equity/EquityContainer'
import { IState } from 'reducers'
import { dataSelector, profileSelector } from 'selectors'
import { fetchAssets } from 'actions/data'

// Set up the interfaces for mapStateToProps and mapDispatchToProps

// Return shape of mapStateToProps
interface IMapStateProps {
  assumedAMID: string
  equities: any[] // change equities to fx or futures
  fetching: boolean
  fetchError: string
  darkProfile: boolean
}

// Return shape of mapDispatchToProps
interface IDispatchProps {
  fetchAssets: (userQuery?: object) => void
}

const mapStateToProps = (state: IState) => ({
  assumedAMID: profileSelector(state).assumedAMID,
  equities: dataSelector(state).assets.data, // this will be same for fx and futures. Just change the key 'equities' to 'fx', 'futures'
  fetching: dataSelector(state).assets.fetching,
  fetchError: dataSelector(state).assets.error,
  darkProfile: profileSelector(state).darkProfile
})

const mapDispatchToProps = (dispatch: Function) => ({
  fetchAssets: (userQuery?: any) => {
    const query = {
      assetClasses: 'Equity', // here change this to 'ForeignExchange' or 'Future'
      ...userQuery
    }
    dispatch(fetchAssets(query))
  }
})

// This will be same for FX and Future
const mergeProps = (
  stateProps: IMapStateProps,
  dispatchProps: IDispatchProps,
  ownProps: {}
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
  EquityContainer
)

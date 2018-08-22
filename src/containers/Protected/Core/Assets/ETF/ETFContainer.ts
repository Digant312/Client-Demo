import { connect } from 'react-redux'
import { InjectedIntlProps } from 'react-intl'
import ETFContainer, {
  IETFContainerProps
} from 'components/Protected/Core/Assets/ETF/ETFContainer'
import { IState } from 'reducers'
import { dataSelector, profileSelector } from 'selectors'
import { fetchAssets } from 'actions/data'

// Set up the interfaces for mapStateToProps and mapDispatchToProps

// Return shape of mapStateToProps
interface IMapStateProps {
  assumedAMID: string
  etf: any[] // change equities to fx or etf
  fetching: boolean
  fetchError: string
  darkProfile: boolean
  dateFormat: string
}

// Return shape of mapDispatchToProps
interface IDispatchProps {
  fetchAssets: (userQuery?: object) => void
}

const mapStateToProps = (state: IState) => ({
  assumedAMID: profileSelector(state).assumedAMID,
  etf: dataSelector(state).assets.data,
  fetching: dataSelector(state).assets.fetching,
  fetchError: dataSelector(state).assets.error,
  darkProfile: profileSelector(state).darkProfile,
  dateFormat: profileSelector(state).dateFormat
})

const mapDispatchToProps = (dispatch: Function) => ({
  fetchAssets: (userQuery?: any) => {
    const query = {
      ...userQuery,
      assetTypes: 'ExchangeTradedFund'
    }
    dispatch(fetchAssets(query))
  }
})

// This will be same for FX and ETF
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
  ETFContainer
)

import { connect } from 'react-redux'

import PartyPage, {
  IPartyPageProps
} from 'components/Protected/Core/Parties/PartyPage'
import { IState } from 'reducers'
import { dataSelector, profileSelector } from 'selectors'
import { fetchParties } from 'actions/data'

// Return shape of mapStateToProps
interface IMapStateProps {
  partyId: string
  parties: any[] // change equities to fx or futures
  fetching: boolean
  fetchError: string
  darkProfile: boolean
}

interface IDispatchProps {
  fetchParties: (userQuery?: object) => void
}

const mapStateToProps = (state: IState) => ({
  assumedAMID: profileSelector(state).assumedAMID,
  assetManagerId: profileSelector(state).assetManagerId,
  fetching: dataSelector(state).parties.fetching,
  parties: dataSelector(state).parties.data,
  darkProfile: profileSelector(state).darkProfile
})

const mapDispatchToProps = (dispatch: Function) => ({
  fetchParties: (partyId: string) => {
    const query = {
      partyIds: partyId
    }
    dispatch(fetchParties(query))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(PartyPage)

import { connect } from 'react-redux'
import { InjectedIntlProps } from 'react-intl'

import OrganisationsContainer, {
  IOrganisationsContainerProps
} from 'components/Protected/Core/Parties/Organisations/OrganisationsContainer'
import { IState } from 'reducers'
import { dataSelector, profileSelector } from 'selectors'
import { fetchParties, fetchBooks } from 'actions/data'

// Set up theIndividual interfaces for mapStateToProps and mapDispatchToProps

// Return shape of mapStateToProps
interface IMapStateProps {
  assumedAMID: string
  company: any[] // change organisations to fx or futures
  fetching: boolean
  fetchError: string
  darkProfile: boolean
}

// Return shape of mapDispatchToProps
interface IDispatchProps {
  fetchParties: (userQuery?: object) => void
  fetchBooks: () => void
}

const mapStateToProps = (state: IState) => ({
  assumedAMID: profileSelector(state).assumedAMID,
  assetManagerId: profileSelector(state).assetManagerId,
  company: dataSelector(state).parties.data,
  fetching: dataSelector(state).parties.fetching,
  fetchError: dataSelector(state).parties.error,
  darkProfile: profileSelector(state).darkProfile
})

const mapDispatchToProps = (dispatch: Function) => ({
  fetchParties: (userQuery?: any) => {
    const query = {
      partyClasses: ['Organisation', 'Company'],
      fields: [
        'assetManagerId',
        'partyId',
        'baseCurrency',
        'contactNumber',
        'displayName',
        'legalName',
        'url',
        'partyStatus',
        'partyClass',
        'partyType'
      ],
      ...userQuery
    }
    dispatch(fetchParties(query))
    dispatch(fetchBooks())
  }
})

// This will be same for FX and Future
const mergeProps = (
  stateProps: IMapStateProps,
  dispatchProps: IDispatchProps,
  ownProps: {}
) =>
  Object.assign({}, ownProps, stateProps, {
    fetchParties: (amidInRequest?: boolean, userQuery?: object) => {
      const { assumedAMID } = stateProps
      if (!amidInRequest) {
        userQuery = {
          ...userQuery,
          includePublic: true
        }
      }
      dispatchProps.fetchParties(userQuery)
    }
  })

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  OrganisationsContainer
)

import { connect } from 'react-redux'
import { InjectedIntlProps } from 'react-intl'

import IndividualContainer, {
  IIndividualContainerProps
} from 'components/Protected/Core/Parties/Individual/IndividualContainer'
import { IState } from 'reducers'
import { dataSelector, profileSelector } from 'selectors'
import { fetchParties, fetchBooks } from 'actions/data'

// Set up theIndividual interfaces for mapStateToProps and mapDispatchToProps

// Return shape of mapStateToProps
interface IMapStateProps {
  assumedAMID: string
  individual: any[] // change individual to fx or futures
  fetching: boolean
  fetchError: string
  darkProfile: boolean
  dateFormat: string
}

// Return shape of mapDispatchToProps
interface IDispatchProps {
  fetchParties: (userQuery?: object) => void
  fetchBooks: () => void
}

const mapStateToProps = (state: IState) => ({
  assumedAMID: profileSelector(state).assumedAMID,
  individual: dataSelector(state).parties.data, // this will be same for fx and futures. Just change the key 'individual' to 'fx', 'futures'
  fetching: dataSelector(state).parties.fetching,
  fetchError: dataSelector(state).parties.error,
  darkProfile: profileSelector(state).darkProfile,
  dateFormat: profileSelector(state).dateFormat
})

const mapDispatchToProps = (dispatch: Function) => ({
  fetchParties: (userQuery?: any) => {
    const query = {
      partyClasses: 'Individual', // here change this to 'ForeignExchange' or 'Future'
      fields: [
        'assetManagerId',
        'partyId',
        'title',
        'givenNames',
        'surname',
        'dateOfBirth',
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
    fetchParties: (amidInRequest: boolean = true, userQuery?: object) => {
      const { assumedAMID } = stateProps
      if (!amidInRequest) {
        userQuery = {
          ...userQuery,
          includePublic: false
        }
      }
      dispatchProps.fetchParties(userQuery)
    }
  })

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  IndividualContainer
)

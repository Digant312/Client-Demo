import { connect } from 'react-redux'
import { InjectedIntlProps } from 'react-intl'

import * as actions from 'actions/bookSelector'
import AccordionComp from 'components/Shared/Layouts/Protected/Main/Accordion'
import { fetchBooks } from 'actions/data'
import { IState } from 'reducers'
import { dataSelector, profileSelector } from 'selectors'

interface IMapStateProps {
  assumedAMID: string
  booksFetching: boolean
  darkProfile: boolean
}

interface IMapDispatchProps {
  toggleBookSelector: Function
  fetchBooks: () => void
}

const mapStateToProps = (state: IState) => (
  {
    assumedAMID: profileSelector(state).assumedAMID,
    booksFetching: dataSelector(state).books.fetching,
    darkProfile: profileSelector(state).darkProfile
  }
)

const mapDispatchToProps = (dispatch: Function) => (
  {
    toggleBookSelector: (e: any) => {
      switch (e.type) {
        case 'allBU':
          dispatch(actions.toggleAllBUs())
          break
        case 'allParties':
          dispatch(actions.toggleAllParties())
          break
        case 'allOwners':
          dispatch(actions.toggleAllOwners())
          break
        case 'businessUnit':
          dispatch(actions.toggleSingleBU(e.value))
            break
        case 'partyId':
          dispatch(actions.toggleSingleParty(e.value))
          break
        case 'ownerId':
          dispatch(actions.toggleOwner(e.value))
          break
        case 'book':
          dispatch(actions.toggleBook(e.value))
          break
        case 'selectAll':
          dispatch(actions.selectAllBooks())
          break
        case 'deselectAll':
          dispatch(actions.deSelectAllBooks())
          break
        default:
          console.error(`Unknown type: ${e.type}`)
      }
    },
    fetchBooks: () => dispatch(fetchBooks())
  }
)

export default connect<IMapStateProps, IMapDispatchProps, { options: any[], visible: boolean }>(
  mapStateToProps,
  mapDispatchToProps
)(AccordionComp)
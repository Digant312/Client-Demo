import { connect } from 'react-redux'

import BooksContainer, { IBooksContainerProps } from 'components/Protected/Core/Books/Book/BooksContainer'
import { IState } from 'reducers'
import { dataSelector, profileSelector } from 'selectors'
import { fetchBooks } from 'actions/data'

// Return shape of mapStateToProps
interface IMapStateProps {
  assumedAMID: string
  books: any[] // change equities to fx or futures
  fetching: boolean
  fetchError: string
  darkProfile:boolean
}

// Return shape of mapDispatchToProps
// interface IDispatchProps {
//   fetchBooks: (userQuery?: object) => void
// }

const mapStateToProps = (state: IState) => (
  {
    assumedAMID: profileSelector(state).assumedAMID,
    assetManagerId: profileSelector(state).assetManagerId,
    fetching: dataSelector(state).books.fetching,
    books: dataSelector(state).books.data,
    darkProfile: profileSelector(state).darkProfile
  }
)

const mapDispatchToProps = (dispatch: Function) => (
  {
    fetchBooks: () => {
      dispatch(fetchBooks())
    }
  }
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BooksContainer)
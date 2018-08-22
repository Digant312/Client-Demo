import { connect } from 'react-redux'

import BookPage, {
  IBookPageProps
} from 'components/Protected/Core/Books/BookPage'
import { IState } from 'reducers'
import { dataSelector, profileSelector } from 'selectors'
import { fetchBooks } from 'actions/data'

// Return shape of mapStateToProps
interface IMapStateProps {
  bookId: string
  books: any[] // change equities to fx or futures
  fetching: boolean
  fetchError: string
  darkProfile: boolean
}

const mapStateToProps = (state: IState) => ({
  assumedAMID: profileSelector(state).assumedAMID,
  assetManagerId: profileSelector(state).assetManagerId,
  fetching: dataSelector(state).books.fetching,
  books: dataSelector(state).books.data,
  darkProfile: profileSelector(state).darkProfile
})

const mapDispatchToProps = (dispatch: Function, ownProps: any) => ({
  fetchBooks: () => {
    dispatch(fetchBooks())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(BookPage)

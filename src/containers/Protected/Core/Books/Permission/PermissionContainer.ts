import { connect } from 'react-redux'

import PermissionContainer from 'components/Protected/Core/Books/Permission/PermissionContainer'
import { IState } from 'reducers'
import { dataSelector, profileSelector } from 'selectors'
import { fetchBooks, fetchBookPermissions } from 'actions/data'

// Return shape of mapStateToProps
interface IMapStateProps {
  assumedAMID: string
  assetManagerId: string
  permission: any[] // change equities to fx or futures
  fetching: boolean
  fetchError: string
  darkProfile:boolean
}

// Return shape of mapDispatchToProps
interface IDispatchProps {
  fetchBookPermissions: (bookId?: object) => void
} 

const mapStateToProps = (state: IState) => (
  {
    assumedAMID: profileSelector(state).assumedAMID,
    assetManagerId: profileSelector(state).assetManagerId,
    fetching: dataSelector(state).books.fetching ,
    fetchPermissions: dataSelector(state).bookPermissions.fetching,
    books: dataSelector(state).books.data,
    permissions: dataSelector(state).bookPermissions.data,
    darkProfile: profileSelector(state).darkProfile 
  }
)

const mapDispatchToProps = (dispatch: Function) => (
  {
    fetchBooks: () => {
      dispatch(fetchBooks())
    },
    fetchBookPermissions: (bookId: string) => {
      dispatch(fetchBookPermissions(bookId))
    }
  }
)


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PermissionContainer)
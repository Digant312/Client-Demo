import { connect } from 'react-redux'

import BookPermissionForm from 'components/Protected/Core/Books/BookPermissionForm'
import { IState } from 'reducers'
import { formValueSelector, FormProps } from 'redux-form'
import { dataSelector, profileSelector } from 'selectors'
import { fetchBooks, fetchBookPermissions } from 'actions/data'

// Return shape of mapStateToProps
interface IMapStateProps {
  rowData : any
  darkProfile : boolean
  onCancel : any
  onSubmit : any
  assumedAMID: number
  assetManagerId: number
  fetching:boolean
  initialize:any
  HeadingText: string
}

// Return shape of mapDispatchToProps
interface IDispatchProps {
  fetchBookPermissions: (bookId?: object) => void
} 
const formSelector = formValueSelector('book-permission-form')

const mapStateToProps = (state: IState) => ({
    permissionRead: formSelector(state, 'permissionRead'),
    permissionWrite: formSelector(state, 'permissionWrite'),
    permissionNone: formSelector(state, 'permissionNone')
  })

const mapDispatchToProps = (dispatch: Function, ownProps: any) => (
  {
    fetchBookPermissions: (bookId: string) => {
      dispatch(fetchBookPermissions(bookId))
    }
  }
)


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BookPermissionForm)
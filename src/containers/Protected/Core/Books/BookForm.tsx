import bookForm from 'components/Protected/Core/Books/BookForm';
import { connect } from 'react-redux'
import { IState } from 'reducers'
import { getFormValues } from 'redux-form'

const mapStateToProps = (state: IState) => ({
  bookData: getFormValues('book-form')(state)
})

export default connect<any, any, any>(mapStateToProps)(bookForm)
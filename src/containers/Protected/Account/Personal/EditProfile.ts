import { connect } from 'react-redux'

import EditProfile, {
  IEditProfileNonFormProps
} from 'components/Protected/Account/Personal/EditProfile'
import { IState } from 'reducers'
import { profileSelector } from 'selectors'

const mapStateToProps = (state: IState) => (
  {
    darkProfile: profileSelector(state).darkProfile
  }
)

const mapDispatchToProps = (dispatch: Function) => ({
  onSubmit: (values: Object) => console.log(values)
})

export default connect<{ darkProfile: boolean }, any, IEditProfileNonFormProps & { initialValues: any }>(
  mapStateToProps,
  mapDispatchToProps
)(EditProfile)

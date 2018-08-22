import { connect } from 'react-redux'

import EditEmail, { IEditEmailProps } from 'components/Protected/Account/Personal/EditEmail'
import { authSuccess } from 'actions/session'
import { checkSession } from 'utils/auth'
import { IState } from 'reducers'
import { profileSelector } from 'selectors'

const mapStateToProps = (state: IState) => (
  {
    darkProfile: profileSelector(state).darkProfile
  }
)

const mapDispatchToProps = (dispatch: Function) => ({
  handleSuccess: async () => {
    const session = await checkSession() as any
    dispatch(authSuccess(session))
  }
})

export default connect<{ darkProfile: boolean }, {handleSuccess: Function}, IEditEmailProps>(
  mapStateToProps,
  mapDispatchToProps
)(EditEmail)
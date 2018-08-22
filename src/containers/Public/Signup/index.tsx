import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { injectIntl, InjectedIntlProps } from 'react-intl'

import { requestSignup } from 'actions/signup'
import Register from 'components/Public/Signup'
import { IState } from 'reducers'
import { signupSelector } from 'selectors'

interface IMapStateProps {
  registerError: string
}

interface IMapDispatchProps {
  onSubmit: Function
}

const mapStateToProps = (state: IState) => (
  {
    registerError: signupSelector(state).error,
    signingUp: signupSelector(state).signingUp
  }
)

const mapDispatchToProps = (dispatch: Function, ownProps: RouteComponentProps<{}> & InjectedIntlProps) => (
  {
    onSubmit: (values: { username: string, password: string, email: string, firstName: string, lastName: string }) => {
      dispatch(requestSignup({ ...values, history: ownProps.history }))
    }
  }
)

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(Register))
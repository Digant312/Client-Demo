import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { injectIntl, InjectedIntlProps } from 'react-intl'

import { requestLogin } from 'actions/session'
import Login from 'components/Public/Login'
import { IState } from 'reducers'
import { sessionSelector } from 'selectors'

interface IMapStateProps {
  loginError: string
  loggingIn: boolean
}

interface IMapDispatchProps {
  onSubmit: Function
}

const mapStateToProps = (state: IState) => ({
  loginError: sessionSelector(state).error,
  loggingIn: sessionSelector(state).authenticating
})

const mapDispatchToProps = (dispatch: Function, ownProps: RouteComponentProps<{ type: string }> & InjectedIntlProps) => (
  {
    onSubmit: (values: { username: string, password: string }) => {
      const { from } = ownProps.location.state || { from: { pathname: '/' } }
      dispatch(requestLogin({ ...values, history: ownProps.history, nextPath: from }))
  }
})

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(Login))
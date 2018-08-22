import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { injectIntl, InjectedIntlProps } from 'react-intl'

import Home from 'components/Public/Home'
import { requestLogin } from 'actions/session'
import { changeLanguage } from 'actions/intl'
import { IState } from 'reducers'
import { sessionSelector } from 'selectors'

const mapStateToProps = (state: IState) => ({
  loggingIn: sessionSelector(state).authenticating,
  loginError: sessionSelector(state).error
})

const mapDispatchToProps = (
  dispatch: Function,
  ownProps: RouteComponentProps<{}> & InjectedIntlProps
) => ({
  onSubmit: (values: { username: string; password: string }) => {
    const { username, password } = values
    const { history } = ownProps
    dispatch(
      requestLogin({
        username,
        password,
        history,
        nextPath: { pathname: '/a-a/portfolio' }
      })
    )
  },
  selectLanguage: (locale: string) => dispatch(changeLanguage(locale))
})

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Home))

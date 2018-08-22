import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { History } from 'history'
import { injectIntl, InjectedIntlProps } from 'react-intl'

import { requestResetPass } from 'actions/reset'
import Reset from 'components/Public/Reset'
import { IState } from 'reducers'
import { resetPasswordSelector, forgotPasswordSelector } from 'selectors'

const mapStateToProps = (state: IState) => (
  {
    resetError: resetPasswordSelector(state).error,
    email: forgotPasswordSelector(state).email,
    resetting: forgotPasswordSelector(state).sending
  }
)

const mapDispatchToProps = (dispatch: Function, ownProps: RouteComponentProps<{}> & InjectedIntlProps) => (
  {
    dispatchSubmit: (code: string, password: string, email: string) => {
      const { history } = ownProps
      dispatch(requestResetPass({ code, password, email, history }))
    }
  }
)

const mergeProps = (stateProps: { resetError: string, email: string, resetting: boolean }, dispatchProps: { dispatchSubmit: Function }, ownProps: RouteComponentProps<{}> & InjectedIntlProps) => (
  Object.assign({}, ownProps, stateProps, {
    onSubmit: (values: { resetCode: string, newPassword: string, confirmNewPassword: string,  }) => {
      const { resetCode: code, newPassword: password } = values
      const { email } = stateProps
      dispatchProps.dispatchSubmit(code, password, email)
    }
  })
)

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Reset))
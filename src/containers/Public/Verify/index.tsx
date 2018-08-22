import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { injectIntl, InjectedIntlProps } from 'react-intl'

import { requestVerify, requestResend } from 'actions/verify'
import Verify from 'components/Public/Verify'
import { IState } from 'reducers'
import { verifySelector } from 'selectors'

const mapStateToProps = (state: IState) => (
  {
    verifying: verifySelector(state).verifying,
    verifyError: verifySelector(state).verifyError,
    resending: verifySelector(state).resendingCode,
    resendError: verifySelector(state).resendError,
    resentSuccess: verifySelector(state).codeResent
  }
)

const mapDispatchToProps = (dispatch: Function, ownProps: RouteComponentProps<{ username: string }> & InjectedIntlProps) => (
  {
    onSubmit: (values: { verificationCode: string }) => {
      const { username } = ownProps.match.params
      dispatch(requestVerify({ code: values.verificationCode, username, history: ownProps.history }))
    },
    resendCode: (event: React.MouseEvent<HTMLButtonElement>) => {
      const { username } = ownProps.match.params
      event.preventDefault()
      dispatch(requestResend({ username }))
    }
  }
)

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(Verify))
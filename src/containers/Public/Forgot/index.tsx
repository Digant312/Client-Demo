import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { InjectedIntlProps } from 'react-intl'

import { requestForgot } from 'actions/forgot'
import Forgot from 'components/Public/Forgot'
import { IState } from 'reducers'
import { forgotPasswordSelector } from 'selectors'

interface IMapStateProps {
  forgotError: string
  sentSuccess: boolean
  sendingCode: boolean
}

interface IMapDispatchProps {
  onSubmit: Function
}

const mapStateToProps = (state: IState) => (
  {
    forgotError: forgotPasswordSelector(state).error,
    sendingCode: forgotPasswordSelector(state).sending,
    sentSuccess: forgotPasswordSelector(state).sent
  }
)

const mapDispatchToProps = (dispatch: Function) => (
  {
    onSubmit: (values: { email: string }) => dispatch(requestForgot(values))
  }
)

export default connect<IMapStateProps, IMapDispatchProps, RouteComponentProps<{}>>(
  mapStateToProps,
  mapDispatchToProps
)(Forgot)
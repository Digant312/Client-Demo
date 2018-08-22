import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'

import { requestNewCompany, newCompanyFailed } from 'actions/newCompany'
import { IState } from 'reducers'
import { newCompanySelector, signupSelector } from 'selectors'
import TermsAndConditions from 'components/Protected/TermsAndConditions'

const mapStateToProps = (state: IState) => ({
  newCompanyError: newCompanySelector(state).error,
  creating: newCompanySelector(state).creating,
  progress: signupSelector(state).accountCreationProgress
})

const mapDispatchToProps = (
  dispatch: Function,
  ownProps: RouteComponentProps<{}>
) => {
  const { history, location } = ownProps
  const { name, type, domain, regulated } = location.state || {
    name: '',
    type: '',
    domain: '',
    regulated: false
  }
  return {
    onSubmit: (data: any) => {
      const { termsAndConditions, privacyPolicy, outsourcingGuidelines } = data
      if (!termsAndConditions || !privacyPolicy) {
        return dispatch(
          newCompanyFailed('You must agree to all policies to sign up.')
        )
      }
      if (regulated && !outsourcingGuidelines) {
        return dispatch(
          newCompanyFailed('You must agree to all policies to sign up.')
        )
      }
      dispatch(requestNewCompany({ name, type, history, domain }))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TermsAndConditions)

import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { formValueSelector, FormProps } from 'redux-form'

import {
  requestNewCompany,
  redirectToTermsAndConditions,
  newCompanyFailed
} from 'actions/newCompany'
import NewCompany from 'components/Protected/NewCompany'
import { IState } from 'reducers'
import { newCompanySelector, signupSelector } from 'selectors'

interface IMapStateProps {
  regulatedChoice: { unregulatedCompany: boolean; regulatedCompany: boolean }
  newCompanyError: string
  creating: boolean
  progress?: number
}

interface IMapDispatchProps {
  onSubmit: Function
}

const selector = formValueSelector('newCompany')

const mapStateToProps = (state: IState) => {
  const regulatedChoice = selector(
    state,
    'unregulatedCompany',
    'regulatedCompany'
  )
  return {
    regulatedChoice,
    newCompanyError: newCompanySelector(state).error,
    creating: newCompanySelector(state).creating,
    progress: signupSelector(state).accountCreationProgress
  }
}

const mapDispatchToProps = (
  dispatch: Function,
  ownProps: RouteComponentProps<{}>
) => ({
  onSubmit: (values: {
    companyName: string
    companyType: string
    unregulatedCompany: boolean
    regulatedCompany: boolean
  }) => {
    const { unregulatedCompany, regulatedCompany } = values
    if (unregulatedCompany == regulatedCompany) return
    // return dispatch(
    //   newCompanyFailed('Please indicate whether you are regulated or not')
    // )
    const regulated = regulatedCompany || !unregulatedCompany
    let state = ownProps.location.state
    state = state || { domain: '' }
    dispatch(
      redirectToTermsAndConditions(
        values.companyName,
        values.companyType,
        regulated,
        state.domain,
        ownProps.history
      )
    )
  }
})

export default connect<
  IMapStateProps,
  IMapDispatchProps,
  RouteComponentProps<{}>
>(mapStateToProps, mapDispatchToProps)(NewCompany)

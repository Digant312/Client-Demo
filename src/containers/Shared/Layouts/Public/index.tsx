import React from 'react'
import { connect } from 'react-redux'

import { cancelSignupFlow } from 'actions/signup'
import Layout from 'components/Shared/Layouts/Public'

const mapDispatchToProps = (dispatch: Function) => (
  {
    handleCancelSignup: () => dispatch(cancelSignupFlow())
  }
)

export default connect<{}, { handleCancelSignup: Function }, { children: JSX.Element[] | JSX.Element }>(
  null,
  mapDispatchToProps
)(Layout)
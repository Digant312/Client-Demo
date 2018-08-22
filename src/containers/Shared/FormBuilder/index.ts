import { connect } from 'react-redux'
import { SemanticWIDTHSNUMBER } from 'semantic-ui-react'

import FormBuilder, { IConfigInterface } from 'components/Shared/FormBuilder'
import { IState } from 'reducers'
import { profileSelector } from 'selectors'

interface IFormBuilderOwnProps {
  formConfig: IConfigInterface[]
  columnNumber?: SemanticWIDTHSNUMBER
  readOnly?: boolean
}

const mapStateToProps = (state: IState, ownProps: IFormBuilderOwnProps) => ({
  darkProfile: profileSelector(state).darkProfile
})

export default connect(mapStateToProps)(FormBuilder)

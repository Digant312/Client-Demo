import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'

import FormTogglePosition, { IFormTogglePositionProps, IDarkProfileProps } from 'components/Protected/Portfolio/PositionsList/FormTogglePosition'
import { IState } from 'reducers'
import { profileSelector } from 'selectors'

const selector = formValueSelector('toggle-position-form')

const mapStateToProps = (state: IState) => ({
    togglePositionCheckBox: selector(state, 'togglePositionCheckBox'),
    darkProfile: profileSelector(state).darkProfile,
})

export default connect<
  IDarkProfileProps, {} , IFormTogglePositionProps
>(mapStateToProps)(FormTogglePosition)
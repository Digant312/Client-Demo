import { connect } from 'react-redux'

import FixingDateInput from 'components/Shared/TransactionInputs/FixingDate'
import { IState } from 'reducers'
import { profileSelector } from 'selectors'

const mapStateToProps = (
  state: IState,
  ownProps: { readOnly?: boolean; fieldLabel?: string }
) => ({
  dateFormat: profileSelector(state).dateFormat
})

export default connect(mapStateToProps)(FixingDateInput)

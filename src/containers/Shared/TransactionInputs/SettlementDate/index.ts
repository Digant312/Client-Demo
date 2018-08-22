import { connect } from 'react-redux'

import SettlementDateInput from 'components/Shared/TransactionInputs/SettlementDate'
import { IState } from 'reducers'
import { profileSelector } from 'selectors'

const mapStateToProps = (
  state: IState,
  ownProps: { readOnly?: boolean; fieldLabel?: string }
) => ({
  dateFormat: profileSelector(state).dateFormat
})

export default connect(mapStateToProps)(SettlementDateInput)

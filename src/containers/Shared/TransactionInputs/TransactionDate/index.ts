import { connect } from 'react-redux'

import TransactionDate from 'components/Shared/TransactionInputs/TransactionDate'
import { profileSelector } from 'selectors'
import { IState } from 'reducers'

const mapStateToProps = (
  state: IState,
  ownProps: { readOnly?: boolean; fieldLabel?: string }
) => ({
  dateFormat: profileSelector(state).dateFormat
})

export default connect(mapStateToProps)(TransactionDate)

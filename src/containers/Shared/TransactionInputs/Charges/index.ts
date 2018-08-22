import { connect } from 'react-redux'

import Charges from 'components/Shared/TransactionInputs/Charges'
import { IState } from 'reducers'
import { profileSelector } from 'selectors'

const mapStateToProps = (
  state: IState,
  ownProps: { readOnly?: boolean; currencyLabel?: string }
) => ({
  darkProfile: profileSelector(state).darkProfile
})

export default connect(mapStateToProps)(Charges)

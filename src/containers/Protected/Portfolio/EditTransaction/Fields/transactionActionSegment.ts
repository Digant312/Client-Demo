import { connect } from 'react-redux'

import TransactionActions, {
  ITransactionActionSegmentOwnProps
} from 'components/Protected/Portfolio/EditTransaction/Fields/transactionActionSegment'
import { IState } from 'reducers'
import { profileSelector } from 'selectors'

export interface ITransactionActionMapStateProps {
  darkProfile: boolean
}

const mapStateToProps = (state: IState) => ({
  darkProfile: profileSelector(state).darkProfile
})

export default connect<
  ITransactionActionMapStateProps,
  {},
  ITransactionActionSegmentOwnProps
>(mapStateToProps)(TransactionActions)

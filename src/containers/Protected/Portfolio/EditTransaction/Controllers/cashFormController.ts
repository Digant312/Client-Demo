import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import CashFormController, { ICashFormControllerProps } from 'components/Protected/Portfolio/EditTransaction/Controllers/cashFormController'
import { profileSelector, transactionFormTransactionSelector } from 'selectors'
import { IState } from 'reducers'

interface ICashTransactionProp {
  assumedAMID: string
  transactionForForm: any
  assetBookId: string
  parties: any[]
  transactionAction: string
}

const mapStateToProps = (state: IState, ownProps: ICashFormControllerProps) => {
  const cashFormSelector = formValueSelector(ownProps.formName)
  const assetBookId = cashFormSelector(state, 'assetBookId')
  const parties = cashFormSelector(state, 'parties')
  const transactionAction = cashFormSelector(state, 'transactionAction')
  return {
    assumedAMID: profileSelector(state).assumedAMID,
    transactionForForm: transactionFormTransactionSelector(state).transaction,
    assetBookId,
    parties,
    transactionAction
  }
}

export default connect<
  ICashTransactionProp, {}, ICashFormControllerProps
>(mapStateToProps)(CashFormController)

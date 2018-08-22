import { connect } from 'react-redux'
import { IState } from 'reducers'
import { profileSelector } from 'selectors'
import { formValueSelector } from 'redux-form'
import TransactionStatusDropDown, { ITransactionStatusDropDownProps, IConnectProps } from 'components/Protected/Portfolio/TransactionsList/TransactionStatusDropDown'  

const formSelector = formValueSelector('transactionStatusDropDownForm')


const mapStateToProps = (state: IState) => ({
  transactionStatusDropDownField: formSelector(state, 'transactionStatusDropDownField'),
  darkProfile: profileSelector(state).darkProfile
})

export default connect<
  IConnectProps, {}, ITransactionStatusDropDownProps
>(mapStateToProps)(TransactionStatusDropDown)
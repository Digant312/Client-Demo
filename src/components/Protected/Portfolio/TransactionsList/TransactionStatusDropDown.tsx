import { IConnectInjectedProps } from '../../../Shared/Dropdown';
import React from 'react'
import Dropdown from 'containers/Shared/Dropdown'
import { Form, Label } from 'semantic-ui-react'
import { Field, reduxForm, FormProps } from 'redux-form'
import { profileSelector } from 'selectors'
import { connect } from 'react-redux'

export interface ITransactionStatusDropDownProps {
  formStyles?: {}
  options: any[]
  isMultiple: boolean
  placeholder: string
}

export interface IConnectProps {
  darkProfile: boolean
  transactionStatusDropDownField: string[]
}

class TransactionStatusDropDown extends React.Component<
  FormProps<{}, {}, {}> & IConnectProps & ITransactionStatusDropDownProps
> {
  render() {
    const { formStyles, options, isMultiple, placeholder } = this.props
    return (
      <Form
        style={formStyles}>
        <Field
          placeholder={placeholder}
          name="transactionStatusDropDownField"
          component={Dropdown}
          multiple={isMultiple}
          options={options}
          >
        </Field>
      </Form>
    )
  }
}

export default reduxForm({
  form: 'transactionStatusDropDownForm',
})(TransactionStatusDropDown)
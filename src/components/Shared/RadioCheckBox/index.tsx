import React from 'react'
import { WrappedFieldProps, WrappedFieldInputProps } from 'redux-form'
import { Checkbox, CheckboxProps, Form, Label } from 'semantic-ui-react'

export default (props: any) => {
  const { meta: { touched, error, warning }, input, disabled, darkProfile, dispatch, readOnly, ...rest } = props
  const { value, ...inputRest } = input as WrappedFieldInputProps
  const checkBoxClassName = darkProfile ? 'inverted' : ''
  return readOnly ? <div className='read-only-form-value'>{value}</div> : <Form.Field style={{ padding: '0' }} error={(error && touched)} disabled={disabled}>
    <Checkbox radio className={checkBoxClassName} {...inputRest} {...rest} checked={input && input.checked} onChange={(e, {checked}) => {
      input && input.onChange(checked as any)
    }} />
    { touched && ((error && <Label style={{ marginTop: '5px' }} basic color='red' size='tiny'>{error}</Label>) || (warning && <Label style={{ marginTop: '5px' }} basic color='red' size='tiny'>{warning}</Label>)) }
  </Form.Field>
}
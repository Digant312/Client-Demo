import React from 'react'
import { Form, Input, Label } from 'semantic-ui-react'
import { WrappedFieldProps, WrappedFieldInputProps } from 'redux-form'

import './styles.scss'

interface ICompactInputProps {
  label?: string
  disabled?: boolean
  normal?: boolean
  fluid?: boolean
  darkProfile: boolean
  readOnly?: boolean
}

export default (
  props: WrappedFieldProps<{}> & ICompactInputProps & { dispatch: Function }
) => {
  // export default (props: { meta: { autofilled: boolean, touched: boolean, error: string, warning: string }, input: object, label: string, disabled?: boolean, normal?: boolean }) => {
  const {
    meta: { autofilled, touched, error, warning, pristine },
    input,
    disabled,
    normal,
    darkProfile,
    dispatch,
    fluid,
    readOnly,
    label,
    ...rest
  } = props
  const { onBlur, ...inputRest } = input as WrappedFieldInputProps

  // Override the default onBlur in order to prevent the default action of running validation.
  // If we don't do this and we autofocus a field on mount and close the form without touhcing
  // any fields, it will prevent the close due to validation.
  const handleBlur = (event: any) => {
    const { relatedTarget } = event
    if (relatedTarget && 'cancel' === relatedTarget.getAttribute('type')) {
      event.preventDefault()
    } else {
      onBlur(event)
    }
  }

  // TODO: Change this inline style in the stylesheet. I think can safely assume we will never want this padding
  return readOnly ? (
    <div className="read-only-form-value">
      {label}&nbsp;{inputRest.value.toFixed ? (
        inputRest.value.toFixed()
      ) : (
        inputRest.value
      )}
    </div>
  ) : (
    <Form.Field
      style={{ padding: '0' }}
      error={touched && !!error}
      disabled={disabled}
    >
      <Input
        transparent={darkProfile}
        fluid={fluid === false ? false : true}
        onBlur={handleBlur}
        label={label}
        {...inputRest}
        {...rest}
      />
      {touched &&
        ((error && (
          <Label style={{ marginTop: '5px' }} basic color="red" size="tiny">
            {error}
          </Label>
        )) ||
          (warning && (
            <Label style={{ marginTop: '5px' }} basic color="red" size="tiny">
              {warning}
            </Label>
          )))}
    </Form.Field>
  )
}

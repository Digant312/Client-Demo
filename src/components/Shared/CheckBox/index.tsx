import React from 'react'
import { WrappedFieldProps, WrappedFieldInputProps } from 'redux-form'
import { Checkbox, Form, Icon, Label } from 'semantic-ui-react'

interface ICheckBoxProps {
  fieldLabel?: string | JSX.Element
  disabled?: boolean
  normal?: boolean
  darkProfile: boolean
  readOnly?: boolean
  onToggle?: Function
  label?: string | JSX.Element
}

export default (
  props: WrappedFieldProps<{}> & ICheckBoxProps & { dispatch: Function }
) => {
  const {
    meta: { touched, error, warning },
    input,
    disabled,
    normal,
    darkProfile,
    dispatch,
    readOnly,
    onToggle,
    label,
    fieldLabel,
    ...rest
  } = props
  const { value, ...inputRest } = input as WrappedFieldInputProps
  return readOnly ? <div className="read-only-form-value">{!!value}</div> ? (
    <Icon name="check" />
  ) : (
    <Icon name="close" />
  ) : (
    <Form.Field error={touched && !!error} disabled={disabled}>
      <Checkbox
        className={darkProfile ? 'inverted' : ''}
        {...inputRest}
        {...rest}
        label={label}
        checked={input && input.checked}
        onChange={(e, { checked }) => {
          if (onToggle) {
            onToggle(checked)
          }
          input && input.onChange(checked as any)
        }}
      />
      {fieldLabel ? (
        <span style={{ verticalAlign: 'text-bottom', marginLeft: '5px' }}>
          {fieldLabel}
        </span>
      ) : null}
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

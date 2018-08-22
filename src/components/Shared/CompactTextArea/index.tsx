import React from 'react'
import { WrappedFieldProps, WrappedFieldInputProps } from 'redux-form'
import { Form, Label, TextArea } from 'semantic-ui-react'

interface ITextAreaProps {
  darkProfile: boolean
  title?: string
  ghostText?: string
  disabled?: boolean
  readOnly?: boolean
}

export default (
  props: WrappedFieldProps<{}> & ITextAreaProps & { dispatch: Function }
) => {
  const {
    meta: { touched, error, warning },
    input,
    disabled,
    darkProfile,
    dispatch,
    readOnly,
    ...rest
  } = props
  const invertedBackgroundColor = darkProfile
    ? { backgroundColor: '#1b1c1d' }
    : {}
  const invertedTextColor = darkProfile ? { color: 'white' } : {}
  const invertedErrorBorderColor =
    darkProfile && error && touched ? { borderColor: 'red' } : {}
  const styles = {
    ...invertedBackgroundColor,
    ...invertedTextColor,
    ...invertedErrorBorderColor
  }
  return readOnly && input ? (
    <div className='read-only-form-value'>{input.value}</div>
  ) : (
    <Form.Field error={touched && !!error} disabled={disabled}>
      <TextArea style={styles} {...input} {...rest} rows={1} />
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

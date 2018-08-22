import React from 'react'
import { Form, Label, TextArea } from 'semantic-ui-react'
import { WrappedFieldProps, WrappedFieldInputProps } from 'redux-form'

export default (
  props: WrappedFieldProps<{}> & {
    title?: string
    ghostText?: string
    disabled?: boolean
    readOnly?: boolean
  }
) => {
  const {
    meta: { touched, error, warning },
    input,
    title,
    ghostText,
    disabled,
    readOnly,
    ...rest
  } = props
  return readOnly && input ? (
    <div className='read-only-form-value'>{input.value}</div>
  ) : (
    <Form.Field error={touched && !!error} disabled={disabled}>
      {title ? <h3 className="input-title">{title}</h3> : null}
      <TextArea {...input} {...rest} />
      {ghostText ? (
        <p className="ghost-text">{ghostText}</p>
      ) : (
        <div style={{ height: '1em' }} />
      )}
      {touched &&
        ((error && (
          <Label basic color="red" size="tiny">
            {error}
          </Label>
        )) ||
          (warning && (
            <Label basic color="red" size="tiny">
              {warning}
            </Label>
          )))}
    </Form.Field>
  )
}

import React from 'react'
import DatePicker from 'react-datepicker'
import { Form, Label } from 'semantic-ui-react'
import {
  FieldValue,
  WrappedFieldProps,
  WrappedFieldInputProps
} from 'redux-form'

import 'react-datepicker/dist/react-datepicker.css'
import './styles.scss'

interface IMapStateProps {
  darkProfile: boolean
  dateFormat: string
}

export default (
  props: IMapStateProps & WrappedFieldProps<{}> & { readOnly?: boolean }
) => {
  const {
    darkProfile,
    dateFormat,
    input,
    readOnly,
    meta: { touched, error, warning },
    ...rest
  } = props
  const { onChange, value } = input as WrappedFieldInputProps
  if (readOnly) {
    let parsedValue = value.format
      ? value.format(dateFormat)
      : value.toString ? value.toString() : `${value}`
    return <div className="read-only-form-value">{parsedValue}</div>
  }
  return (
    <Form.Field error={touched && !!error}>
      <DatePicker
        dateFormat={dateFormat}
        onChange={(date, event) => onChange(date as FieldValue)}
        selected={value}
        className={darkProfile ? 'datepicker-input-inverted' : 'error'}
        calendarClassName={darkProfile ? 'datepicker-calendar-inverted' : ''}
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

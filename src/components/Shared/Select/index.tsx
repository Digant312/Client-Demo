import React from 'react'
import { Dropdown, Form, Label } from 'semantic-ui-react'

export default (props: { meta: { touched: boolean, error: string, warning: string }, input: { onChange: Function }, options: any[] }) => {

  // There is a need to separate onChange because by default it will only receive SyntheticEvent, but it needs to receive value
  const { meta: { touched, error, warning }, input: { onChange, ...inputRest }, options, ...rest } = props

  return <Form.Field error={ touched && !!error }>
    <Dropdown selection fluid onChange={(e, {value}) => onChange(value)} {...inputRest} {...rest} options={options} />
    <br />
    {touched && ((error && <Label basic color='red' size='tiny'>{error}</Label>) || (warning && <Label basic color='red' size='tiny'>{warning}</Label>))}
  </Form.Field>
}
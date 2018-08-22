import React from 'react'
import { Form, Input, Label } from 'semantic-ui-react'

import './styles.scss'

export default (props: { meta: { touched: boolean, error: string, warning: string }, input: object, title?: string, ghostText?: string, disabled?: boolean }) => {
  const { meta: { touched, error, warning }, input, title, ghostText, disabled, ...rest } = props
  return <Form.Field error={ touched && !!error } disabled={disabled}>
    { title ? <h3 className='input-title'>{ title }</h3> : null }
    <Input { ...input } {...rest} />
    { ghostText ? <p className='ghost-text'>{ ghostText }</p> : <div style={{ height: '1em' }} /> }
    { touched && ((error && <Label basic color='red' size='tiny'>{error}</Label>) || (warning && <Label basic color='red' size='tiny'>{warning}</Label>)) }
  </Form.Field>
}
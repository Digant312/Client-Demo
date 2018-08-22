import React from 'react'
import { Field, FormProps, reduxForm } from 'redux-form'
import { Form, Label } from 'semantic-ui-react'
import { defineMessages, FormattedMessage, InjectedIntlProps } from 'react-intl'

import Input from 'components/Shared/Input'
import { required } from 'utils/form'

interface IResetProps extends FormProps<{}, {}, {}>, InjectedIntlProps {
  resetError: string
  resetting: boolean
  email: string
}

const messages = defineMessages({
  resetCode: {
    id: 'reset.resetCode',
    defaultMessage: 'Reset Code'
  },
  resetCodePlaceholder: {
    id: 'reset.resetCodePlaceholder',
    defaultMessage: 'e.g. 123456'
  },
  newPassword: {
    id: 'reset.newPassword',
    defaultMessage: 'New Password'
  },
  newPasswordGhostText: {
    id: 'reset.newPasswordGhostText',
    defaultMessage: 'For enhanced security, please use a password with at least 10 characters, containing one uppercase letter, one lowercase letter, one number, and no space'
  },
  confirmPassword: {
    id: 'reset.confirmPassword',
    defaultMessage: 'Confirm Password'
  },
  resetPassword: {
    id: 'reset.resetPassword',
    defaultMessage: 'Reset Password'
  }
})

const Reset = (props: IResetProps) => {
  return <Form style={{ marginTop: '100px' }} onSubmit={props.handleSubmit}>
    <Field
      name='resetCode'
      component={Input}
      type='text'
      placeholder={props.intl.formatMessage(messages.resetCodePlaceholder)}
      validate={required}
      title={props.intl.formatMessage(messages.resetCode)}
    />
    <br/>
    <Field
      name='newPassword'
      component={Input}
      type='password'
      validate={required}
      title={props.intl.formatMessage(messages.newPassword)}
      ghostText={props.intl.formatMessage(messages.newPasswordGhostText)}
    />
    <br/>
    <Field
      name='confirmNewPassword'
      component={Input}
      type='password'
      validate={required}
      title={props.intl.formatMessage(messages.confirmPassword)}
    />
    <br/>
    <Form.Button type='submit' color='green' floated='right' disabled={props.resetting} loading={props.resetting}>
      <FormattedMessage {...messages.resetPassword} />
    </Form.Button>
    { props.resetError ? <Label basic color='red'>{ props.resetError }</Label> : null }
  </Form>
}

export default reduxForm({
  form: 'resetPassPublic'
})(Reset)
import React from 'react'
import { Field, FormProps, reduxForm } from 'redux-form'
import { Button, Form, Label, Message } from 'semantic-ui-react'
import { defineMessages, FormattedMessage, InjectedIntlProps } from 'react-intl'

import Layout from 'containers/Shared/Layouts/Public'
import Input from 'components/Shared/Input'
import { required } from 'utils/form'

interface IVerifyProps extends FormProps<{}, {}, {}>, InjectedIntlProps {
  verifying: boolean
  verifyError: string
  resending: boolean
  resendError: string
  resendCode: Function
  resentSuccess: boolean
}

// TODO: Secondary messages
const messages = defineMessages({
  verificationCode: {
    id: 'verify.verificationCode',
    defaultMessage: 'Verification Code'
  },
  verificationCodePlaceholder: {
    id: 'verify.verificationCodePlaceholder',
    defaultMessage: 'e.g. 123456'
  },
  verify: {
    id: 'verify.verify',
    defaultMessage: 'Verify'
  },
  resend: {
    id: 'verify.resend',
    defaultMessage: 'Resend Code'
  },
  resendSuccess: {
    id: 'verify.resendSuccess',
    defaultMessage: 'Code successfully resent'
  }
})

let Verify = (props: IVerifyProps) => (
  <Layout>
    <Form onSubmit={props.handleSubmit}>
      <Field
        name='verificationCode'
        component={Input}
        type='text'
        placeholder={props.intl.formatMessage(messages.verificationCodePlaceholder)}
        validate={required}
        title={props.intl.formatMessage(messages.verificationCode)}
      />
      <div style={{ height: '50px' }} />
      <div style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
        <div>
          <Button type='submit' color='green' disabled={props.verifying} loading={props.verifying}>
            <FormattedMessage {...messages.verify} />
          </Button>
        </div>
        <div>
          <Button basic color='blue' disabled={props.resending} loading={props.resending} onClick={(e) => props.resendCode(e)}>
            <FormattedMessage {...messages.resend} />
          </Button> 
        </div>
      </div>
      { props.resentSuccess ? <Label basic color='green'><FormattedMessage {...messages.resendSuccess} /></Label> : null }
      { props.verifyError ? <Label basic color='red'>{props.verifyError}</Label> : null }
      { props.resendError ? <Label basic color='red'>{props.resendError}</Label> : null }
    </Form>
    <Message color='green'>
      <Message.Header>Verify your email address</Message.Header>
      <br/>
      <p>We have sent a verification code to your email, please enter it here.</p>
    </Message>
  </Layout>
)

export default reduxForm({
  form: 'verify'
})(Verify)
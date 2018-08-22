import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Field, FormProps, reduxForm } from 'redux-form'
import { Form , Label } from 'semantic-ui-react'
import { defineMessages, FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl'

import Layout from 'containers/Shared/Layouts/Public'
import Input from 'components/Shared/Input'
import { required } from 'utils/form'
import Reset from 'containers/Public/Reset'

interface IForgotProps {
  forgotError: string
  sentSuccess: boolean
  sendingCode: boolean
}

const messages = defineMessages({
  sendResetCode: {
    id: 'forgot.sendResetCode',
    defaultMessage: 'Send Reset Code'
  },
  emailAddress: {
    id: 'forgot.emailAddress',
    defaultMessage: 'Email Address'
  },
  ghostText: {
    id: 'forgot.emailGhostText',
    defaultMessage: 'Please enter the email address you used to sign up with, or if you have changed it since then, the most recent one'
  }
})

const Forgot = (props: IForgotProps & RouteComponentProps<{}> & InjectedIntlProps & FormProps<{}, {}, {}>) => {
  const { history, location, match } = props
  const routeProps = {
    history,
    location,
    match
  }
  return <Layout>
    <div>
      <Form onSubmit={props.handleSubmit}>
        <Field
          name='email'
          component={Input}
          type='text'
          validate={required}
          title={props.intl.formatMessage(messages.emailAddress)}
          ghostText={props.intl.formatMessage(messages.ghostText)}
          disabled={ props.sentSuccess }
        />
        <br/>
        <Form.Button type='submit' color='green' floated='right' disabled={ props.sentSuccess || props.sendingCode } loading={props.sendingCode} >
          <FormattedMessage {...messages.sendResetCode} />
        </Form.Button>
        { props.forgotError ? <Label basic color='red'>{ props.forgotError }</Label>: null }
      </Form>
      {/* Change password form after successful send of code */}
      { props.sentSuccess ? <Reset {...routeProps} /> : null }
    </div>
  </Layout>
}

const Component = injectIntl(reduxForm({
  form: 'forgot'
})(Forgot))

export default (props: IForgotProps & RouteComponentProps<{}>) => <Component {...props} />
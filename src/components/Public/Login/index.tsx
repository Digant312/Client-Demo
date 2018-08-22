import React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Field, FormProps, reduxForm } from 'redux-form'
import { Button, Form, Label, Message } from 'semantic-ui-react'
import { defineMessages, FormattedMessage, InjectedIntlProps } from 'react-intl'

import Layout from 'containers/Shared/Layouts/Public'
import Input from 'components/Shared/Input'
import { required } from 'utils/form'

interface ILoginProps extends FormProps<{}, {}, {}>, RouteComponentProps<{ type?: string }>, InjectedIntlProps {
  loginError: string
  loggingIn: boolean
}


// TODO: all the secondary messages
const messages = defineMessages({
  email: {
    id: 'login.email',
    defaultMessage: 'Email'
  },
  password: {
    id: 'login.password',
    defaultMessage: 'Password'
  },
  login: {
    id: 'login.login',
    defaultMessage: 'Login'
  },
  forgotPassword: {
    id: 'login.forgotPassword',
    defaultMessage: 'Forgot Password?'
  }
})

let Login = (props: ILoginProps) => {

  const renderMessage = (type?: string) => {
    switch (type) {
      case 'verified':
        return <Message color='green'>
          <Message.Header>Successfully Verified!</Message.Header>
          <br/>
          <p>Your email address has been successfully verified. Please login in to continue.</p>
        </Message>
      case 'reset':
        return <Message color='green'>
          <Message.Header>Password Successfully Reset!</Message.Header>
          <br/>
          <p>You have successfully reset your password, please log in.</p>
        </Message>
      case 'forbidden':
        return <Message color='green'>
          <Message.Header>Sorry, you cannot view this page.</Message.Header>
          <br/>
          <p>You need to log in to access this page. If you were previously logged in, your session may have timed out. Please log in to continue.</p>
        </Message>
      case 'rel':
        return <Message color='green'>
          <Message.Header>Awaiting Relationship Approval.</Message.Header>
          <br/>
          <p>Sorry, you cannot login until your Relationship has been approved. You will be able to login once an admin of your company has approved you.</p>
        </Message>
      default:
        return <Message color='green'>
          <Message.Header>Sorry, something went wrong.</Message.Header>
          <br/>
          <p>We're afraid something went wrong, please try logging in again or contact us for help.</p>
        </Message>
    }
  }

  return <Layout>
    {/* This component will be a specific login route, to be used when redirecting from:
    1. Any protected route;
    2. Successful verification for new user;
    3. Successful change of forgot password;
    4. Attempted login when there are no Active relationships for the user
    As a result there will be a message displayed related to that specific action for user info.
    We should also consider storing a specific location to redirect to (for case 1 above) */}
    <Form onSubmit={props.handleSubmit}> 
      <Field
        name='username'
        component={Input}
        type='text'
        validate={required}
        title={props.intl.formatMessage(messages.email)}
      />
      <Field
        name='password'
        component={Input}
        type='password'
        validate={required}
        title={props.intl.formatMessage(messages.password)}
      />
      <br />
      <div style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
        <div>
          <Form.Button type='submit' color='green' floated='right' disabled={props.loggingIn} loading={props.loggingIn}>
            <FormattedMessage {...messages.login} />
          </Form.Button>
        </div>
        <div>
          <Button basic color='blue' as={Link} to='/a-p/forgot'>
            <FormattedMessage {...messages.forgotPassword} />
          </Button>
        </div>
      </div>
      { props.loginError ? <Label basic color='red'>{props.loginError}</Label> : null }
    </Form>
    {renderMessage(props.match.params.type)}
  </Layout>
}

export default reduxForm({
  form: 'login'
})(Login)
import React from 'react'
import { Field, FormProps, reduxForm } from 'redux-form'
import { Form, Label, Message } from 'semantic-ui-react'
import { defineMessages, FormattedMessage, InjectedIntlProps } from 'react-intl'

import Layout from 'containers/Shared/Layouts/Public'
import Input from 'components/Shared/Input'
import {
  containsNumber,
  findCommonDomain,
  hasSpace,
  lowerUpper,
  minLength,
  required
} from 'utils/form'

import './styles.scss'

interface IRegisterProps extends FormProps<{}, {}, {}>, InjectedIntlProps {
  registerError: string
  signingUp: boolean
}

const passwordMinLength10 = minLength(10)('Password')
const emailValidation = () => {
  switch (process.env.DEPLOY_ENV) {
    case 'production':
      return [required, findCommonDomain]
    default:
      return required
  }
}
// TODO: The secondary messages
const messages = defineMessages({
  firstName: {
    id: 'signup.firstName',
    defaultMessage: 'First Name'
  },
  lastName: {
    id: 'signup.lastName',
    defaultMessage: 'Last Name'
  },
  companyEmail: {
    id: 'signup.companyEmail',
    defaultMessage: 'Company Email'
  },
  companyEmailPlaceholder: {
    id: 'signup.companyEmailPlaceholder',
    defaultMessage: 'e.g. yourname@company.com'
  },
  companyEmailGhostText: {
    id: 'signup.companyEmailGhostText',
    defaultMessage:
      'Start your journey with Argomi using your company email address'
  },
  password: {
    id: 'signup.password',
    defaultMessage: 'Password'
  },
  passwordGhostText: {
    id: 'signup.passwordGhostText',
    defaultMessage:
      'For enhanced security, please use a password with at least 10 characters, containing one uppercase letter, one lowercase letter, one number, and no space'
  },
  next: {
    id: 'signup.next',
    defaultMessage: 'Next'
  }
})

let Register = (props: IRegisterProps) => (
  <Layout>
    <Form onSubmit={props.handleSubmit}>
      <div className="signup-name-container">
        <div className="signup-name-field">
          <Field
            name="firstName"
            component={Input}
            type="text"
            validate={required}
            title={props.intl.formatMessage(messages.firstName)}
          />
        </div>
        <div className="signup-name-field">
          <Field
            name="lastName"
            component={Input}
            type="text"
            validate={required}
            title={props.intl.formatMessage(messages.lastName)}
          />
        </div>
      </div>
      {/* <div style={{ height: '20px' }} /> */}
      <Field
        name="email"
        component={Input}
        type="text"
        placeholder={props.intl.formatMessage(messages.companyEmailPlaceholder)}
        validate={emailValidation()}
        title={props.intl.formatMessage(messages.companyEmail)}
        ghostText={props.intl.formatMessage(messages.companyEmailGhostText)}
      />
      {/* <div style={{ height: '20px' }} /> */}
      <Field
        name="password"
        component={Input}
        type="password"
        validate={[
          required,
          passwordMinLength10,
          containsNumber('Password'),
          lowerUpper('Password'),
          hasSpace('Password')
        ]}
        title={props.intl.formatMessage(messages.password)}
        ghostText={props.intl.formatMessage(messages.passwordGhostText)}
      />
      {/* <div style={{ height: '50px' }} /> */}
      <div className="form-button-left">
        <Form.Button
          type="submit"
          color="green"
          floated="right"
          disabled={props.signingUp}
          loading={props.signingUp}
        >
          <FormattedMessage {...messages.next} />
        </Form.Button>
      </div>
      {props.registerError ? (
        <Label style={{ marginTop: '20px' }} basic color="red">
          {props.registerError}
        </Label>
      ) : null}
    </Form>
    <Message color="green">
      <Message.Header>Welcome to Argomi!</Message.Header>
      <br />
      <p>
        To start your journey with us, please sign up with your company email
        address.
      </p>
      <p>
        If you are the first from your company to use Argomi, you will be able
        to create your company’s account in the next step; if someone has
        already created your company, you will be able to request for access to
        join.
      </p>
    </Message>
    <Message.Header />
  </Layout>
)

export default reduxForm({
  form: 'register'
})(Register)

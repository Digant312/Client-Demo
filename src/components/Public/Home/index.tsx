import React from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  Dropdown,
  Flag,
  Form,
  Input,
  Label,
  Menu
} from 'semantic-ui-react'
import { Field, FormProps, reduxForm } from 'redux-form'
import { defineMessages, FormattedMessage, InjectedIntlProps } from 'react-intl'

import { staticAssets } from 'config'
import { required } from 'utils/form'

const logo = staticAssets(process.env.DEPLOY_ENV as string).darkLogoOnWhiteBig

import './styles.scss'

interface IHomeProps extends FormProps<{}, {}, {}>, InjectedIntlProps {
  loggingIn: boolean
  loginError: string
  selectLanguage: Function
}

const messages = defineMessages({
  username: {
    id: 'home.username',
    defaultMessage: 'Username'
  },
  password: {
    id: 'home.password',
    defaultMessage: 'Password'
  },
  login: {
    id: 'home.login',
    defaultMessage: 'Login'
  },
  signup: {
    id: 'home.signup',
    defaultMessage: 'Sign Up'
  },
  loginError: {
    id: 'home.error',
    defaultMessage: 'Error logging in, please try again'
  },
  forgotPassword: {
    id: 'home.forgotPassword',
    defaultMessage: 'Forgot Password?'
  }
})

const languages = [
  { value: 'en', flag: 'us', text: 'English' },
  { value: 'fr', flag: 'fr', text: 'French' }
]

const Home = (props: IHomeProps) => {
  return (
    <div className="public-wrapper">
      <div className="public-menu">
        <Menu secondary>
          <Menu.Item style={{ padding: '0' }}>
            <img style={{ width: '10em', paddingLeft: '10px' }} src={logo} />
          </Menu.Item>
          {/* <Menu.Item>
          <Dropdown text='Language' options={languages} onChange={(e, {value}) => props.selectLanguage(value)} />
        </Menu.Item> */}
          <Menu.Menu position="right">
            {props.loginError ? (
              <Menu.Item>
                <Label basic color="red">
                  <FormattedMessage {...messages.loginError} />
                </Label>
              </Menu.Item>
            ) : null}
            <Menu.Item>
              <Form onSubmit={props.handleSubmit}>
                <Form.Group style={{ margin: '0' }} inline>
                  <Field
                    name="username"
                    component={FormInput}
                    type="text"
                    validate={required}
                    placeholder={props.intl.formatMessage(messages.username)}
                  />
                  <Field
                    name="password"
                    component={FormInput}
                    type="password"
                    validate={required}
                    placeholder={props.intl.formatMessage(messages.password)}
                  />
                  <Form.Button
                    color="green"
                    size="mini"
                    disabled={props.loggingIn}
                    loading={props.loggingIn}
                  >
                    <FormattedMessage {...messages.login} />
                  </Form.Button>
                </Form.Group>
              </Form>
            </Menu.Item>
            <Menu.Item>
              <div>
                <Link to="/a-p/forgot">
                  <FormattedMessage {...messages.forgotPassword} />
                </Link>
              </div>
            </Menu.Item>
            <Menu.Item>
              <div>
                <Button
                  basic
                  as={Link}
                  to="/a-p/signup"
                  size="mini"
                  color="blue"
                >
                  <FormattedMessage {...messages.signup} />
                </Button>
              </div>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
      <div className="public-main" />
    </div>
  )
}

export default reduxForm({
  form: 'homeLogin'
})(Home)

const FormInput = (props: {
  meta: { touched: boolean; error: string; warning: string }
  input: object
  title?: string
  ghostText?: string
  disabled?: boolean
}) => {
  const {
    meta: { touched, error, warning },
    input,
    title,
    ghostText,
    disabled,
    ...rest
  } = props
  return (
    <Form.Field>
      <Input size="mini" {...input} {...rest} />
    </Form.Field>
  )
}

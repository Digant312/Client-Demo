import React from 'react'
import { Field, FormProps, reduxForm } from 'redux-form'
import { Button, Form, Grid, Label, Modal, Segment } from 'semantic-ui-react'
import {
  defineMessages,
  FormattedMessage,
  Messages,
  injectIntl,
  InjectedIntlProps
} from 'react-intl'

import Input from 'containers/Shared/CompactInput'
import { changePassword } from 'utils/auth'
import {
  required,
  minLength,
  containsNumber,
  lowerUpper,
  hasSpace
} from 'utils/form'

export interface IEditEmailProps {
  isOpen: boolean
  handleEditPasswordClose: Function
}

interface IConnectInjectedProps {
  darkProfile: boolean
}

interface IEditEmailState {
  isChanging: boolean
  changeSuccess: boolean
  error: string | JSX.Element
}

interface IFormFields {
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
}

const messages = defineMessages({
  header: {
    id: 'editPassword.modalHeader',
    defaultMessage: 'Edit Password'
  },
  noMatch: {
    id: 'editPassword.notMatching',
    defaultMessage: 'New Password does not match'
  },
  password: {
    id: 'editPassword.password',
    defaultMessage: 'Password'
  },
  oldPassword: {
    id: 'editPassword.oldPassword',
    defaultMessage: 'Old Password'
  },
  newPassword: {
    id: 'editPassword.newPassword',
    defaultMessage: 'New Password'
  },
  confirmNewPassword: {
    id: 'editPassword.confirmNewPassword',
    defaultMessage: 'Confirm New Password'
  },
  cancel: {
    id: 'editPassword.cancel',
    defaultMessage: 'Cancel'
  },
  change: {
    id: 'editPassword.change',
    defaultMessage: 'Change'
  }
})

class EditPassword extends React.Component<
  IEditEmailProps &
    IConnectInjectedProps &
    FormProps<IFormFields, {}, {}> &
    InjectedIntlProps,
  IEditEmailState
> {
  constructor() {
    super()
    this.state = {
      isChanging: false,
      changeSuccess: false,
      error: ''
    }
  }

  handleClose(reset?: Function) {
    reset ? reset() : null
    this.setState({
      isChanging: false,
      changeSuccess: false,
      error: ''
    })
    this.props.handleEditPasswordClose()
  }

  async handleChangePassword(data: IFormFields, reset?: Function) {
    this.setState({
      isChanging: true
    })
    const { oldPassword, newPassword, confirmNewPassword } = data
    if (newPassword !== confirmNewPassword)
      return this.setState({
        isChanging: false,
        changeSuccess: false,
        error: <FormattedMessage {...messages.noMatch} />
      })
    try {
      await changePassword({ oldPassword, Password: newPassword })
      reset ? reset() : null
      this.handleClose()
    } catch (error) {
      this.setState({
        isChanging: false,
        changeSuccess: false,
        error: error.message || error
      })
    }
  }

  render() {
    const { darkProfile, handleSubmit, isOpen, reset, intl } = this.props
    const { isChanging, error } = this.state
    return (
      <Modal
        closeOnEscape={false}
        closeOnDimmerClick={false}
        open={isOpen}
        onClose={() => this.handleClose(reset)}
        size="tiny"
      >
        <Segment.Group>
          <Segment inverted={darkProfile}>
            <FormattedMessage {...messages.header} />
          </Segment>
          <Segment inverted={darkProfile}>
            <Form
              inverted={darkProfile}
              onSubmit={
                handleSubmit
                  ? handleSubmit(data => {
                      this.handleChangePassword(data)
                    })
                  : () => console.log('no handleSubmit function')
              }
            >
              <Grid columns={2}>
                <Grid.Row>
                  <Grid.Column>
                    <FormattedMessage {...messages.oldPassword} />
                  </Grid.Column>
                  <Grid.Column>
                    <Field
                      name="oldPassword"
                      component={Input}
                      type="password"
                      validate={required}
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <FormattedMessage {...messages.newPassword} />
                  </Grid.Column>
                  <Grid.Column>
                    <Field
                      name="newPassword"
                      component={Input}
                      type="password"
                      validate={[
                        required,
                        minLength(10)(intl.formatMessage(messages.password)),
                        containsNumber(intl.formatMessage(messages.password)),
                        lowerUpper(intl.formatMessage(messages.password)),
                        hasSpace(intl.formatMessage(messages.password))
                      ]}
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <FormattedMessage {...messages.confirmNewPassword} />
                  </Grid.Column>
                  <Grid.Column>
                    <Field
                      name="confirmNewPassword"
                      component={Input}
                      type="password"
                      validate={[
                        required,
                        minLength(10)('Password'),
                        containsNumber(intl.formatMessage(messages.password)),
                        lowerUpper(intl.formatMessage(messages.password)),
                        hasSpace(intl.formatMessage(messages.password))
                      ]}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
            <br />
            {error ? (
              <Label basic color="red">
                {error}
              </Label>
            ) : null}
          </Segment>
          <Segment inverted={darkProfile}>
            <Button
              basic
              color="red"
              onClick={() => {
                this.handleClose(reset)
              }}
            >
              <FormattedMessage {...messages.cancel} />
            </Button>
            <Button
              disabled={isChanging}
              loading={isChanging}
              color="green"
              onClick={
                handleSubmit
                  ? handleSubmit(data => {
                      this.handleChangePassword(data, reset)
                    })
                  : () => null
              }
            >
              <FormattedMessage {...messages.change} />
            </Button>
          </Segment>
        </Segment.Group>
      </Modal>
    )
  }
}

export default injectIntl(
  reduxForm({
    form: 'AccountEditPassword'
  })(EditPassword)
)

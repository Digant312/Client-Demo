import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, FormProps } from 'redux-form'
import { Button, Grid, Form, Label, Modal, Segment } from 'semantic-ui-react'
import { defineMessages, FormattedMessage, Messages } from 'react-intl'

import Input from 'containers/Shared/CompactInput'
import { changeAttribute, verifyAttribute } from 'utils/auth'
import { required } from 'utils/form'

export interface IEditEmailProps extends FormProps<{ newEmailAddress: string, verificationCode: string }, {}, {}> {
  isOpen: boolean
  handleEditEmailClose: (e?: React.MouseEvent<HTMLElement>) => void
}

interface IConnectInjectedProps {
  darkProfile: boolean
  handleSuccess: Function
}

interface IEditEmailState {
  sendingVerificationCode: boolean
  verificationCodeSent: boolean
  verificationSuccess: boolean
  verifying: boolean
  error: string
}

const messages = defineMessages({
  header: {
    id: 'editEmail.modalHeader',
    defaultMessage: 'Edit Email Address'
  },
  info: {
    id: 'editEmail.info',
    defaultMessage: 'After changing your email, we will send you a verification code. Please verify your email immediately to ensure your account is secure.'
  },
  newEmailAddress: {
    id: 'editEmail.newEmailAddress',
    defaultMessage: 'New Email Address'
  },
  getVerificationCode: {
    id: 'editEmail.getVerificationCode',
    defaultMessage: 'Get Verification Code'
  },
  verificationCode: {
    id: 'editEmail.verificationCode',
    defaultMessage: 'Verification Code'
  },
  cancel: {
    id: 'editEmail.cancel',
    defaultMessage: 'Cancel'
  },
  save: {
    id: 'editEmail.save',
    defaultMessage: 'Save'
  },
  addNewEmail: {
    id: 'editEmail.addNewEmail',
    defaultMessage: 'Enter a new email address'
  }
})

class EditEmail extends React.Component<IEditEmailProps & IConnectInjectedProps, IEditEmailState> {
  constructor() {
    super()
    this.state = {
      sendingVerificationCode: false,
      verificationCodeSent: false,
      verificationSuccess: false,
      verifying: false,
      error: ''
    }
  }

  async handleChangeEmail(email: string) {
    this.setState({
      sendingVerificationCode: true
    })
    let params = { type: 'email', attr: email }
    try {
      await changeAttribute(params)
      this.setState({
        sendingVerificationCode: false,
        verificationCodeSent: true
      })
    } catch(error) {
      this.setState({
        sendingVerificationCode: false,
        error
      })
    }
  }

  async handleVerifyEmail(code: string, reset?: Function) {
    this.setState({
      verifying: true
    })
    try {
      await verifyAttribute({ type: 'email', code })
      this.setState({
        verifying: false,
        verificationCodeSent: false,
        verificationSuccess: false
      })
      this.props.handleSuccess()
      reset ? reset() : null
      this.handleClose()
    } catch(error) {
      this.setState({
        verifying: false,
        error
      })
    }
  }

  handleClose(reset?: Function) {
    this.setState({
      sendingVerificationCode: false,
      verificationCodeSent: false,
      verificationSuccess: false,
      verifying: false,
      error: ''
    })
    reset ? reset() : null
    this.props.handleEditEmailClose()
  }
  render() {
    const { darkProfile, isOpen, handleEditEmailClose, handleSubmit, reset } = this.props
    const { error, sendingVerificationCode, verificationCodeSent, verifying } = this.state
    return (
      <Modal closeOnEscape={false} closeOnDimmerClick={false} open={isOpen} onClose={() => this.handleClose(reset)} size="tiny">
        <Segment.Group>
          <Segment inverted={darkProfile}><FormattedMessage {...messages.header} /></Segment>
          <Segment inverted={darkProfile}>
            <p>
              <FormattedMessage {...messages.info} />
            </p>
            <Form onSubmit={handleSubmit} inverted={darkProfile}>
              <Grid columns={2}>
                <Grid.Row>
                  <Grid.Column><FormattedMessage {...messages.newEmailAddress} /></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Field name="newEmailAddress" component={Input} type="text" validate={required} />
                  </Grid.Column>
                  <Grid.Column>
                    <Button size='tiny' color='green' disabled={sendingVerificationCode || verificationCodeSent} loading={sendingVerificationCode} onClick={handleSubmit ? handleSubmit(data => {
                      this.handleChangeEmail(data.newEmailAddress)
                    }) : () => null}>
                      <FormattedMessage {...messages.getVerificationCode} />
                    </Button>
                  </Grid.Column>
                </Grid.Row>
                {verificationCodeSent ? <Grid.Row>
                  <Grid.Column><FormattedMessage {...messages.verificationCode} /></Grid.Column>
                </Grid.Row> : null}
                {verificationCodeSent ? <Grid.Row>
                  <Grid.Column>
                    <Field
                      name="verificationCode"
                      component={Input}
                      type="text"
                      validate={required}
                    />
                  </Grid.Column>
                </Grid.Row> : null}
              </Grid>
            </Form>
            <br />
            { error ? <Label basic color='red'>{error}</Label> : null }
          </Segment>
          <Segment inverted={darkProfile}>
            <Button basic color="red" onClick={() => this.handleClose(reset)}>
              <FormattedMessage {...messages.cancel} />
            </Button>
            <Button disabled={!verificationCodeSent || verifying} loading={verifying} color="green" onClick={handleSubmit ? handleSubmit(data => {
              this.handleVerifyEmail(data.verificationCode, reset)
            }) : () => null}>
              {verificationCodeSent ? <FormattedMessage {...messages.save} /> : <FormattedMessage {...messages.addNewEmail} />}
            </Button>
          </Segment>
        </Segment.Group>
      </Modal>
    )
  }
}

export default reduxForm({
  form: 'AccountEditEmail'
})(EditEmail)
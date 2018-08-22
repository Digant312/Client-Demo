import React from 'react'
import { reduxForm, Field, FormProps } from 'redux-form'
import {
  defineMessages,
  FormattedMessage,
  injectIntl,
  InjectedIntlProps
} from 'react-intl'
import { Button, Form, Message, Modal, ModalProps } from 'semantic-ui-react'
import { api, assetManagers, parties } from '@amaas/amaas-core-sdk-js'

import Input from 'components/Shared/Input'
import Dropdown from 'containers/Shared/Dropdown'
import { required } from 'utils/form'

const messages = defineMessages({
  missingFields: {
    id: 'invite.missingFields',
    defaultMessage: 'Missing Fields'
  },
  inviteTitle: {
    id: 'invite.inviteTitle',
    defaultMessage: 'Invite colleague'
  },
  inviteText: {
    id: 'invite.inviteText',
    defaultMessage:
      "Enter your colleague's email address below to invite them to Argomi. They will receive an email with instructions on how to sign up."
  },
  emailLocalPlaceholder: {
    id: 'invite.emailLocalPlaceholder',
    defaultMessage: 'e.g. john_smith'
  },
  cancel: {
    id: 'invite.cancel',
    defaultMessage: 'Cancel'
  },
  invite: {
    id: 'invite.inviteAction',
    defaultMessage: 'Invite'
  }
})

export interface IInviteOwnProps extends ModalProps {
  toggleModal: Function
}
export interface IInviteInjectedProps
  extends FormProps<{ emailLocal: string; emailDomain: string }, {}, {}> {}
export interface IMapStateProps {
  userEmail: string
  assumedAMID: string
  fetchingDomains: boolean
  domains: assetManagers.Domain[]
}
export interface IMapDispatchProps {
  fetchDomains: Function
}

interface IInviteState {
  inviting: boolean
  inviteError: string
}

class InviteModal extends React.Component<
  IInviteOwnProps &
    IInviteInjectedProps &
    IMapStateProps &
    IMapDispatchProps &
    InjectedIntlProps,
  IInviteState
> {
  mounted: boolean
  constructor() {
    super()
    this.state = {
      inviting: false,
      inviteError: ''
    }
  }
  componentDidMount() {
    this.mounted = true
    this.props.fetchDomains()
    const domainOptions =
      (this.props.domains.length > 0 && this.props.domains[0].domain) || ''
    this.props.initialize &&
      this.props.initialize({ emailLocal: '', emailDomain: domainOptions })
  }

  componentWillUnmount() {
    this.props.destroy && this.props.destroy()
  }

  componentWillReceiveProps(
    nextProps: IInviteOwnProps & IInviteInjectedProps & IMapStateProps
  ) {
    if (this.props.domains.length === 0 && nextProps.domains.length > 0) {
      const domainOptions =
        (nextProps.domains.length > 0 && nextProps.domains[0].domain) || ''
      this.props.change && this.props.change('emailDomain', domainOptions)
    }
    const amidChanged = this.props.assumedAMID != nextProps.assumedAMID
    if (amidChanged) this.props.fetchDomains()
  }

  async handleInvite(local: string, domain: string) {
    if (this.mounted) {
      this.setState({ inviting: true, inviteError: '' })
      if (!local || !domain)
        return this.setState({
          inviting: false,
          inviteError: this.props.intl.formatMessage(messages.missingFields)
        })
      let companyInfo: { description: string; displayName: string }
      try {
        companyInfo = (await api.Parties.retrieve({
          AMId: parseInt(this.props.assumedAMID),
          resourceId: `AMID${this.props.assumedAMID}`
        })) as any // this can be changed once the declaration is update to return single object
      } catch (e) {
        return this.setState({
          inviting: false,
          inviteError: 'Error retrieving data, please try again'
        })
      }
      const params = {
        AMId: parseInt(this.props.assumedAMID),
        email: `${local}@${domain}`,
        companyName: companyInfo.displayName || companyInfo.description
      }
      let promise = api.Relationships.sendInvitation(params) as Promise<any>
      promise
        .then(res => {
          this.props.change && this.props.change('emailLocal', '')
          this.setState({ inviting: false })
          this.props.toggleModal()
        })
        .catch(err => {
          this.setState({ inviting: false })
        })
    }
  }

  render() {
    const {
      closeOnDimmerClick,
      closeOnEscape,
      open,
      size,
      onClose,
      toggleModal,
      handleSubmit,
      fetchingDomains,
      domains
    } = this.props
    const { inviting, inviteError } = this.state
    const domainOptions = domains
      .filter((domain: assetManagers.Domain) => domain.isPrimary)
      .map((domain: assetManagers.Domain, i: number) => ({
        key: i,
        text: domain.domain,
        value: domain.domain
      }))
    return (
      <Modal
        closeOnDimmerClick={closeOnDimmerClick}
        closeOnEscape={closeOnEscape}
        open={open}
        size={size}
        onClose={onClose}
      >
        <Modal.Header>
          <FormattedMessage {...messages.inviteTitle} />
        </Modal.Header>
        <Modal.Content>
          <Message
            compact
            content={
              <p>
                <FormattedMessage {...messages.inviteText} />
              </p>
            }
          />
          <Form
            onSubmit={
              handleSubmit ? (
                handleSubmit(data =>
                  this.handleInvite(data.emailLocal, data.emailDomain)
                )
              ) : (
                () => null
              )
            }
          >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Field
                name="emailLocal"
                component={Input}
                type="text"
                placeholder={this.props.intl.formatMessage(
                  messages.emailLocalPlaceholder
                )}
                label={{
                  basic: true,
                  content:
                    domainOptions.length === 1
                      ? `@${domainOptions[0].text}`
                      : '@'
                }}
                labelPosition="right"
                validate={required}
              />
              &nbsp;
              {domainOptions.length > 1 ? (
                <Field
                  name="emailDomain"
                  component={Dropdown}
                  loading={fetchingDomains}
                  options={domainOptions}
                />
              ) : null}
            </div>
          </Form>
          {inviteError ? (
            <Message compact error size="mini">
              {inviteError}
            </Message>
          ) : null}
        </Modal.Content>
        <Modal.Actions>
          <Button
            basic
            color="red"
            size="small"
            disabled={inviting}
            loading={inviting}
            onClick={() => toggleModal()}
            tabIndex={-1}
          >
            <FormattedMessage {...messages.cancel} />
          </Button>
          <Button
            color="green"
            size="small"
            disabled={inviting}
            loading={inviting}
            onClick={
              handleSubmit ? (
                handleSubmit(data =>
                  this.handleInvite(data.emailLocal, data.emailDomain)
                )
              ) : (
                () => null
              )
            }
          >
            <FormattedMessage {...messages.invite} />
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

const WrappedModal = reduxForm({
  form: 'relationshipsInvite'
})(injectIntl(InviteModal))

export default (
  props: IInviteOwnProps &
    IInviteInjectedProps &
    IMapStateProps &
    IMapDispatchProps
) => <WrappedModal {...props} />

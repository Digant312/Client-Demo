import React from 'react'
import {
  Button,
  Grid,
  Form,
  Label,
  Message,
  Modal,
  Segment
} from 'semantic-ui-react'
import { Field, FormProps, reduxForm } from 'redux-form'
import { FormattedMessage, Messages } from 'react-intl'
import { api, parties } from '@amaas/amaas-core-sdk-js'

import FormBuilder from 'containers/Shared/FormBuilder'
import formConfig from './FormConfig'
import messages from '../CompanyStrings'

interface IEditCompanyFields {
  displayName: string
  addressName: string
  lineOne: string
  lineTwo: string
  city: string
  region: string
  postalCode: string
  countryId: string
  contactNumber: string
  assetsUnderManagement: string
  licenseType: string
  licenseNumber: string
  registrationNumber: string
  yearOfIncorporation: string
}

export interface IEditCompanyProps
  extends FormProps<IEditCompanyFields, {}, {}> {
  assumedAMID: string
  isOpen: boolean
  handleEditCompanyClose: Function
  fetchProfileData: Function
  messagesProp: Messages
  initialValues: IEditCompanyFields
}

interface IEditCompanyState {
  updatingProfile: boolean
  updateProfileError: boolean
}

class EditCompany extends React.Component<
  IEditCompanyProps & { darkProfile: boolean },
  IEditCompanyState
> {
  mounted: boolean
  constructor() {
    super()
    this.state = {
      updatingProfile: false,
      updateProfileError: false
    }
  }

  componentDidMount() {
    this.mounted = true
  }

  componentWillReceiveProps(nextProps: IEditCompanyProps) {
    if (nextProps.initialValues !== this.props.initialValues) {
      this.props.initialize &&
        this.props.initialize(nextProps.initialValues as IEditCompanyFields)
    }
  }

  async handleEditCompanyProfile(data: IEditCompanyFields) {
    this.setState({ updatingProfile: true })
    if (!this.props.assumedAMID) return
    const AMId = parseInt(this.props.assumedAMID)

    const existingData = (await api.Parties.retrieve({
      AMId,
      resourceId: `AMID${AMId}`
    })) as { phoneNumbers: any }
    let { phoneNumbers } = existingData

    let phoneNumber: string | object = data.contactNumber
    if (phoneNumber) {
      phoneNumber = {
        PRIMARY: { phoneNumber: data.contactNumber, phoneNumberPrimary: true }
      }
    } else {
      phoneNumber = {}
    }
    phoneNumbers = { ...phoneNumbers, ...phoneNumber }
    const changes = {
      displayName: data.displayName,
      phoneNumbers,
      assetsUnderManagement: data.assetsUnderManagement,
      licenseType: data.licenseType,
      licenseNumber: data.licenseNumber,
      registrationNumber: data.registrationNumber,
      yearOfIncorporation: data.yearOfIncorporation,
      addresses: {
        [(this.props.initialValues && this.props.initialValues.addressName) ||
        'Work']: {
          lineOne: data.lineOne,
          lineTwo: data.lineTwo,
          city: data.city,
          region: data.region,
          postalCode: data.postalCode,
          countryId: data.countryId,
          addressPrimary: true
        }
      }
    }
    const promise = api.Parties.partialAmend({
      AMId,
      resourceId: `AMID${AMId}`,
      changes
    }) as Promise<parties.PartiesClassType>
    promise
      .then(() => {
        this.setState({
          updatingProfile: false
        })
        this.props.handleEditCompanyClose()
        this.props.fetchProfileData(this.props.assumedAMID)
      })
      .catch(() => {
        this.setState({
          updatingProfile: false,
          updateProfileError: true
        })
      })
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    const {
      isOpen,
      handleEditCompanyClose,
      handleSubmit,
      destroy,
      messagesProp,
      darkProfile
    } = this.props
    const { updatingProfile, updateProfileError } = this.state
    return (
      <Modal
        closeOnDimmerClick={false}
        closeOnEscape={false}
        open={isOpen}
        onClose={() => handleEditCompanyClose()}
      >
        <Segment.Group>
          <Segment inverted={darkProfile}>
            <h2>
              <FormattedMessage {...messages.header} />
            </h2>
          </Segment>
          <Segment inverted={darkProfile}>
            <Form onSubmit={handleSubmit} inverted={darkProfile}>
              <FormBuilder formConfig={formConfig} columnNumber={2} />
            </Form>
            {updateProfileError ? (
              <Message negative>
                <FormattedMessage {...messages.profileUpdateError} />
              </Message>
            ) : null}
          </Segment>
          <Segment inverted={darkProfile}>
            <Button
              basic
              color="red"
              disabled={updatingProfile}
              loading={updatingProfile}
              onClick={() => {
                destroy ? destroy() : null
                handleEditCompanyClose()
              }}
              tabIndex={-1}
            >
              <FormattedMessage {...messages.cancel} />
            </Button>
            <Button
              color="green"
              disabled={updatingProfile}
              loading={updatingProfile}
              onClick={
                handleSubmit ? (
                  handleSubmit(data => {
                    this.handleEditCompanyProfile(data)
                  })
                ) : (
                  () => null
                )
              }
            >
              <FormattedMessage {...messages.save} />
            </Button>
          </Segment>
        </Segment.Group>
      </Modal>
    )
  }
}

export default reduxForm({
  form: 'AccountEditCompany'
})(EditCompany)

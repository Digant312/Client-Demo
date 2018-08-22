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
import startCase from 'lodash/startCase'
import {
  defineMessages,
  FormattedMessage,
  injectIntl,
  InjectedIntlProps,
  Messages
} from 'react-intl'
import { api, parties } from '@amaas/amaas-core-sdk-js'

import Input from 'containers/Shared/CompactInput'
import CountryDropdown from 'components/Shared/CountryDropdown'
import Loader from 'components/Shared/Loader'
import { required } from 'utils/form'

interface IEditProfileFields {
  name: string
  addressName: string
  addressOne: string
  addressTwo: string
  city: string
  region: string
  postalCode: string
  country: string
  department: string
  role: string
  officeNumber: string | object
  mobileNumber: string | object
}

export interface IEditProfileNonFormProps {
  fetching: boolean
  isOpen: boolean
  handleEditProfileClose: Function
  fetchProfileData: Function
  messagesProp: Messages
  assetManagerId: string
}
interface IConnectInjectedProps {
  darkProfile: boolean
}
export interface IEditProfileProps
  extends FormProps<IEditProfileFields, {}, {}>,
    IEditProfileNonFormProps {}

interface IEditProfileState {
  updatingProfile: boolean
  updatingProfileError: boolean
}

const messages = defineMessages({
  header: {
    id: 'editProfile.modalHeader',
    defaultMessage: 'Edit Profile Information'
  },
  cancel: {
    id: 'editProfile.cancel',
    defaultMessage: 'Cancel'
  },
  save: {
    id: 'editProfile.save',
    defaultMessage: 'Save'
  },
  loadingProfile: {
    id: 'editProfile.loadingProfile',
    defaultMessage: 'Loading Profile'
  },
  updateError: {
    id: 'editProfile.updateError',
    defaultMessage: 'Error updating profile, please try again'
  }
})

class EditProfile extends React.Component<
  IEditProfileNonFormProps &
    FormProps<IEditProfileFields, {}, {}> &
    InjectedIntlProps &
    IConnectInjectedProps,
  IEditProfileState
> {
  mounted: boolean
  constructor() {
    super()
    this.state = {
      updatingProfile: false,
      updatingProfileError: false
    }
  }

  componentDidMount() {
    this.mounted = true
  }

  componentWillReceiveProps(nextProps: IEditProfileProps) {
    if (nextProps.initialValues !== this.props.initialValues) {
      this.props.initialize &&
        this.props.initialize(nextProps.initialValues as IEditProfileFields)
    }
  }

  async handleEditPersonalProfile(data: IEditProfileFields) {
    if (this.props.assetManagerId && this.mounted) {
      this.setState({ updatingProfile: true })

      const existingData = (await api.Parties.retrieve({
        AMId: parseInt(this.props.assetManagerId),
        resourceId: `AMID${this.props.assetManagerId}`
      })) as { phoneNumbers: any; addresses: any }
      let {
        phoneNumbers: existingPhoneNumbers,
        addresses: existingAddresses
      } = existingData

      let {
        addressOne: lineOne,
        addressTwo: lineTwo,
        city,
        region,
        postalCode,
        country: countryId,
        officeNumber,
        mobileNumber,
        ...rest
      } = data
      officeNumber = { phoneNumber: officeNumber, phoneNumberPrimary: true }
      mobileNumber = { phoneNumber: mobileNumber, phoneNumberPrimary: false }
      const changes = {
        department: rest.department,
        role: rest.role,
        phoneNumbers: {
          ...existingPhoneNumbers,
          OFFICE: officeNumber,
          MOBILE: mobileNumber
        },
        addresses: {
          ...existingAddresses,
          [(this.props.initialValues && this.props.initialValues.addressName) ||
          'Work']: {
            lineOne,
            lineTwo,
            city,
            region,
            postalCode,
            countryId,
            addressPrimary: true
          }
        }
      }
      let promise = api.Parties.partialAmend({
        AMId: parseInt(this.props.assetManagerId),
        resourceId: `AMID${this.props.assetManagerId}`,
        changes
      }) as Promise<parties.Individual>
      promise
        .then(() => {
          this.setState({ updatingProfile: false })
          this.props.handleEditProfileClose()
          this.props.fetchProfileData(this.props.assetManagerId)
        })
        .catch(() => {
          this.setState({ updatingProfile: false, updatingProfileError: true })
        })
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    const {
      darkProfile,
      messagesProp,
      isOpen,
      handleEditProfileClose,
      handleSubmit,
      fetching
    } = this.props
    const { updatingProfile, updatingProfileError } = this.state
    const columns = Object.keys(messagesProp).reduce(
      (arr: any, curr: any) => {
        switch (curr) {
          case 'name':
          // case 'company':
          case 'department':
          case 'role':
          case 'officeNumber':
          case 'mobileNumber':
            arr.first.push(curr)
            break
          case 'addressOne':
          case 'addressTwo':
          case 'city':
          case 'region':
          case 'postalCode':
          case 'country':
            arr.second.push(curr)
            break
          default:
            null
        }
        return arr
      },
      { first: [], second: [] }
    )
    const col = (coll: string[]) =>
      coll.map((type, i) => {
        const requiredFields = [
          'name',
          'officeNumber',
          'addressOne',
          'addressTwo',
          'city',
          'region',
          'postalCode',
          'country'
        ]
        return (
          <div className="column-inner-row" key={i}>
            <div className="column-inner-column">
              <p>
                <FormattedMessage {...messagesProp[type]} />
              </p>
            </div>
            <div className="column-inner-column">
              {type === 'country' ? (
                <Field
                  name={type}
                  component={CountryDropdown}
                  type="text"
                  initialValues={
                    this.props.initialValues
                      ? [
                          {
                            text: this.props.initialValues.country,
                            value: this.props.initialValues.country
                          }
                        ]
                      : []
                  }
                />
              ) : (
                <Field
                  name={type}
                  component={Input}
                  type="text"
                  validate={
                    requiredFields.indexOf(type) !== -1 ? required : undefined
                  }
                />
              )}
            </div>
          </div>
        )
      })
    return (
      <Modal
        closeOnDimmerClick={false}
        closeOnEscape={false}
        open={isOpen}
        onClose={() => handleEditProfileClose()}
      >
        <Segment.Group>
          <Segment inverted={darkProfile}>
            <FormattedMessage {...messages.header} />
          </Segment>
          <Segment inverted={darkProfile}>
            {fetching ||
            (this.props.initialValues && !this.props.initialValues.name) ? (
              <Loader delay={200} />
            ) : (
              <Form onSubmit={handleSubmit} inverted={darkProfile}>
                <Grid columns={2} divided>
                  <Grid.Row>
                    <Grid.Column>{col(columns.first)}</Grid.Column>
                    <Grid.Column>{col(columns.second)}</Grid.Column>
                  </Grid.Row>
                </Grid>
              </Form>
            )}
            {updatingProfileError ? (
              <Message negative>
                <FormattedMessage {...messages.updateError} />
              </Message>
            ) : null}
          </Segment>
          <Segment inverted={darkProfile}>
            <Button
              basic
              color="red"
              disabled={updatingProfile}
              loading={updatingProfile}
              onClick={() => handleEditProfileClose()}
            >
              <FormattedMessage {...messages.cancel} />
            </Button>
            <Button
              color="green"
              disabled={updatingProfile}
              loading={updatingProfile}
              onClick={
                handleSubmit
                  ? handleSubmit(data => {
                      this.handleEditPersonalProfile(data)
                    })
                  : () => null
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
  form: 'AccountEditProfile'
})(injectIntl(EditProfile))

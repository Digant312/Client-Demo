import React from 'react'
import { Button, Grid, Header, Icon, Message, Segment } from 'semantic-ui-react'
import {
  defineMessages,
  FormattedMessage,
  injectIntl,
  InjectedIntlProps
} from 'react-intl'
import { api, parties } from '@amaas/amaas-core-sdk-js'
import forEach from 'lodash/forEach'

import EditProfileModal from 'containers/Protected/Account/Personal/EditProfile'
import EditEmailAddress from 'containers/Protected/Account/Personal/EditEmail'
import EditPassword from 'containers/Protected/Account/Personal/EditPassword'
import Skeleton from 'components/Shared/Skeleton'

export interface IPersonalProps {}

interface IMappedProps {
  darkProfile: boolean
  assetManagerId: string
  assumedAMId: string
  email: string
}

interface IPersonalState {
  editEmailOpen: boolean
  editPasswordOpen: boolean
  editProfileOpen: boolean
  fetchingProfile: boolean
  profileError: boolean
  fullName: string
  companyName: string
  addressName: string
  addressLineOne: string
  addressLineTwo: string
  city: string
  region: string
  postalCode: string
  countryId: string
  department: string
  role: string
  officeNumber: string
  mobileNumber: string
}

const messages = defineMessages({
  loadingProfileError: {
    id: 'editPersonal.loadingProfileError',
    defaultMessage: 'Error fetching profile information, please refresh'
  },
  account: {
    id: 'editPersonal.account',
    defaultMessage: 'Account'
  },
  accountSubheading: {
    id: 'editPersonal.accountSubheading',
    defaultMessage: 'Manage your profile'
  },
  securitySettings: {
    id: 'editPersonal.securitySettings',
    defaultMessage: 'Security Settings'
  },
  emailAddress: {
    id: 'editPersonal.emailAddress',
    defaultMessage: 'Email Address'
  },
  password: {
    id: 'editPersonal.password',
    defaultMessage: 'Password'
  },
  profileInformation: {
    id: 'editPersonal.profileInformation',
    defaultMessage: 'Profile Information'
  },
  name: {
    id: 'editPersonal.name',
    defaultMessage: 'Name'
  },
  company: {
    id: 'editPersonal.company',
    defaultMessage: 'Company'
  },
  department: {
    id: 'editPersonal.department',
    defaultMessage: 'Department'
  },
  role: {
    id: 'editPersonal.role',
    defaultMessage: 'Role'
  },
  officeNumber: {
    id: 'editPersonal.officeNumber',
    defaultMessage: 'Office No.'
  },
  mobileNumber: {
    id: 'editPersonal.mobileNumber',
    defaultMessage: 'Mobile No.'
  },
  addressOne: {
    id: 'editPersonal.addressLineOne',
    defaultMessage: 'Line One'
  },
  addressTwo: {
    id: 'editPersonal.addressLineTwo',
    defaultMessage: 'Line Two'
  },
  city: {
    id: 'editPersonal.city',
    defaultMessage: 'City'
  },
  region: {
    id: 'editPersonal.region',
    defaultMessage: 'Region'
  },
  postalCode: {
    id: 'editPersonal.postalCode',
    defaultMessage: 'Postal Code'
  },
  country: {
    id: 'editPersonal.countryCode',
    defaultMessage: 'Country'
  }
})

class Personal extends React.Component<
  IPersonalProps & IMappedProps & InjectedIntlProps,
  IPersonalState
> {
  mounted: boolean
  constructor() {
    super()
    this.state = {
      editEmailOpen: false,
      editPasswordOpen: false,
      editProfileOpen: false,
      fetchingProfile: false,
      profileError: false,
      fullName: '',
      companyName: '',
      addressName: '',
      addressLineOne: '',
      addressLineTwo: '',
      city: '',
      region: '',
      postalCode: '',
      countryId: '',
      department: '',
      role: '',
      officeNumber: '',
      mobileNumber: ''
    }
    this.fetchProfileInfo = this.fetchProfileInfo.bind(this)
  }

  componentDidMount() {
    this.mounted = true
    if (this.props.assetManagerId && this.props.assumedAMId) {
      this.fetchProfileInfo(this.props.assetManagerId, this.props.assumedAMId)
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  componentWillReceiveProps(nextProps: IPersonalProps & IMappedProps) {
    if (
      this.props.assetManagerId !== nextProps.assetManagerId ||
      this.props.assumedAMId != nextProps.assumedAMId
    ) {
      this.fetchProfileInfo(nextProps.assetManagerId, nextProps.assumedAMId)
    }
  }

  async fetchCompanyName(assumedAMId: string) {
    const query = { partyIds: `AMID${assumedAMId}`, fields: 'displayName' }
    const companyInfo = await api.Parties.fieldsSearch({
      AMId: parseInt(assumedAMId),
      query
    })
    const companyName = companyInfo[0].displayName
    this.setState({
      companyName
    })
  }

  async fetchProfileInfo(AMId: string, assumedAMId?: string) {
    if (!this.mounted) return
    this.setState({ fetchingProfile: true })
    await this.fetchCompanyName(assumedAMId || this.props.assumedAMId)
    let promise = api.Parties.retrieve({
      AMId: parseInt(AMId),
      resourceId: `AMID${AMId}`
    }) as Promise<parties.Individual[]>
    promise
      .then((res: any) => {
        const addressArray: any[] = []
        forEach(res.addresses, (value: any, key: string) =>
          addressArray.push({ ...value, name: key })
        )
        const primaryAddress: {
          name: string
          lineOne: string
          lineTwo: string
          city: string
          region: string
          postalCode: string
          countryId: string
        } = addressArray.filter(
          (address: { addressPrimary: boolean }) => address.addressPrimary
        )[0]

        const phoneNumberArray: any[] = []
        forEach(res.phoneNumbers, (value: any, key: string) =>
          phoneNumberArray.push({ ...value, name: key })
        )
        const { phoneNumber: officeNumber } = res.phoneNumbers.OFFICE || {
          phoneNumber: ''
        }
        const { phoneNumber: mobileNumber } = res.phoneNumbers.MOBILE || {
          phoneNumber: ''
        }

        const {
          name,
          lineOne: addressLineOne,
          lineTwo: addressLineTwo,
          city,
          region,
          postalCode,
          countryId
        } = primaryAddress || {
          name: '',
          lineOne: '',
          lineTwo: '',
          city: '',
          region: '',
          postalCode: '',
          countryId: ''
        }
        if (!this.mounted) return
        this.setState({
          fetchingProfile: false,
          fullName: `${res.givenNames} ${res.surname}`,
          addressName: name,
          addressLineOne,
          addressLineTwo,
          city,
          region,
          postalCode,
          countryId,
          department: res.department,
          role: res.role,
          officeNumber,
          mobileNumber
        })
      })
      .catch(err => {
        this.setState({ fetchingProfile: false })
        console.error(err)
      })
  }

  toggleEditProfile() {
    this.setState({
      editProfileOpen: !this.state.editProfileOpen
    })
  }

  toggleEditEmail() {
    this.setState({
      editEmailOpen: !this.state.editEmailOpen
    })
  }

  toggleEditPassword() {
    this.setState({
      editPasswordOpen: !this.state.editPasswordOpen
    })
  }

  render() {
    const { assetManagerId, darkProfile, email } = this.props
    const { fetchingProfile, profileError } = this.state
    const infoGroup = (
      name: JSX.Element,
      value?: string | JSX.Element,
      changeFunction?: Function
    ) => (
      <div className="account-info">
        <div className="account-column account-labels">
          <p>{name}</p>
        </div>
        <div className="account-column left">{value || ''}</div>
        {changeFunction ? (
          <div className="account-column left">
            <Button
              basic
              icon="configure"
              inverted={darkProfile}
              size="tiny"
              onClick={() => changeFunction()}
            />
          </div>
        ) : null}
      </div>
    )
    const {
      fullName: name,
      addressName,
      addressLineOne: addressOne,
      addressLineTwo: addressTwo,
      city,
      region,
      postalCode,
      countryId: country,
      department,
      role,
      officeNumber,
      mobileNumber
    } = this.state
    return (
      <div>
        <EditProfileModal
          isOpen={this.state.editProfileOpen}
          handleEditProfileClose={() => this.toggleEditProfile()}
          fetchProfileData={this.fetchProfileInfo}
          messagesProp={messages}
          initialValues={{
            name,
            addressName,
            addressOne,
            addressTwo,
            city,
            region,
            postalCode,
            country,
            department,
            role,
            officeNumber,
            mobileNumber
          }}
          fetching={fetchingProfile}
          assetManagerId={assetManagerId}
        />
        <EditEmailAddress
          isOpen={this.state.editEmailOpen}
          handleEditEmailClose={() => this.toggleEditEmail()}
        />
        <EditPassword
          isOpen={this.state.editPasswordOpen}
          handleEditPasswordClose={() => this.toggleEditPassword()}
        />
        <Header as="h2" inverted={darkProfile}>
          <Icon name="settings" />
          <Header.Content>
            <FormattedMessage {...messages.account} />
            <Header.Subheader>
              <FormattedMessage {...messages.accountSubheading} />
            </Header.Subheader>
          </Header.Content>
        </Header>
        <Segment.Group compact>
          <Segment inverted={darkProfile}>
            <div
              className={`account-container ${darkProfile ? 'inverted' : ''}`}
            >
              <div className="account-action">
                <h4>
                  <FormattedMessage {...messages.securitySettings} />
                </h4>
              </div>
              <div className="account-info">
                <div className="account-column-container">
                  {infoGroup(
                    <FormattedMessage {...messages.emailAddress} />,
                    email || 'Loading...',
                    this.toggleEditEmail.bind(this)
                  )}
                  {infoGroup(
                    <FormattedMessage {...messages.password} />,
                    undefined,
                    this.toggleEditPassword.bind(this)
                  )}
                </div>
              </div>
            </div>
          </Segment>
          <Segment inverted={darkProfile}>
            {this.state.profileError ? (
              <Message negative>
                <FormattedMessage {...messages.loadingProfileError} />
              </Message>
            ) : null}
            <div
              className={`account-container ${darkProfile ? 'inverted' : ''}`}
            >
              <div className="account-action">
                <h4>
                  <FormattedMessage {...messages.profileInformation} />
                </h4>
                <Button
                  basic
                  size="mini"
                  icon="configure"
                  inverted={darkProfile}
                  onClick={() => this.toggleEditProfile()}
                />
              </div>
              <div className="account-info">
                <div className="account-column-container">
                  {infoGroup(
                    <FormattedMessage {...messages.name} />,
                    fetchingProfile ? (
                      <Skeleton size="mini" />
                    ) : (
                      <p>{this.state.fullName}</p>
                    )
                  )}
                  {infoGroup(
                    <FormattedMessage {...messages.company} />,
                    fetchingProfile ? (
                      <Skeleton size="mini" />
                    ) : (
                      <p>{this.state.companyName}</p>
                    )
                  )}
                  {infoGroup(
                    <FormattedMessage {...messages.department} />,
                    fetchingProfile ? (
                      <Skeleton size="mini" />
                    ) : (
                      <p>{department}</p>
                    )
                  )}
                  {infoGroup(
                    <FormattedMessage {...messages.role} />,
                    fetchingProfile ? <Skeleton size="mini" /> : <p>{role}</p>
                  )}
                  {infoGroup(
                    <FormattedMessage {...messages.officeNumber} />,
                    fetchingProfile ? (
                      <Skeleton size="mini" />
                    ) : (
                      <p>{this.state.officeNumber}</p>
                    )
                  )}
                  {infoGroup(
                    <FormattedMessage {...messages.mobileNumber} />,
                    fetchingProfile ? (
                      <Skeleton size="mini" />
                    ) : (
                      <p>{mobileNumber}</p>
                    )
                  )}
                </div>
                <div className="account-column-container">
                  {infoGroup(
                    <FormattedMessage {...messages.addressOne} />,
                    fetchingProfile ? (
                      <Skeleton size="mini" />
                    ) : (
                      <p>{this.state.addressLineOne}</p>
                    )
                  )}
                  {infoGroup(
                    <FormattedMessage {...messages.addressTwo} />,
                    fetchingProfile ? (
                      <Skeleton size="mini" />
                    ) : (
                      <p>{this.state.addressLineTwo}</p>
                    )
                  )}
                  {infoGroup(
                    <FormattedMessage {...messages.city} />,
                    fetchingProfile ? (
                      <Skeleton size="mini" />
                    ) : (
                      <p>{this.state.city}</p>
                    )
                  )}
                  {infoGroup(
                    <FormattedMessage {...messages.region} />,
                    fetchingProfile ? (
                      <Skeleton size="mini" />
                    ) : (
                      <p>{this.state.region}</p>
                    )
                  )}
                  {infoGroup(
                    <FormattedMessage {...messages.postalCode} />,
                    fetchingProfile ? (
                      <Skeleton size="mini" />
                    ) : (
                      <p>{this.state.postalCode}</p>
                    )
                  )}
                  {infoGroup(
                    <FormattedMessage {...messages.country} />,
                    fetchingProfile ? (
                      <Skeleton size="mini" />
                    ) : (
                      <p>{this.state.countryId}</p>
                    )
                  )}
                </div>
              </div>
            </div>
          </Segment>
        </Segment.Group>
      </div>
    )
  }
}

export default injectIntl(
  (props: IPersonalProps & IMappedProps & InjectedIntlProps) => (
    <Personal {...props} />
  )
)

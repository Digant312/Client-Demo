import React from 'react'
import forEach from 'lodash/forEach'
import { Button, Message, Segment } from 'semantic-ui-react'
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl'
import { api, parties } from '@amaas/amaas-core-sdk-js'

import EditCompany from 'containers/Protected/Account/Company/EditCompany'
import Loader from 'components/Shared/Loader'
import Skeleton from 'components/Shared/Skeleton'
import fieldMessages from 'utils/form/PartyConfig/messages'
import messages from '../CompanyStrings'

export interface ICompanyInformationOwnProps {
  darkProfile: boolean
}

export interface ICompanyInformationMapInjectedProps {
  isAdmin: boolean
  assumedAMID: string
}

type ICompanyInformationProps = ICompanyInformationOwnProps &
  ICompanyInformationMapInjectedProps

interface ICompanyInformationState {
  editCompanyOpen: boolean
  fetchingCompanyProfile: boolean
  fetchCompanyProfileError: boolean
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

class CompanyInformation extends React.Component<
  ICompanyInformationProps & InjectedIntlProps,
  ICompanyInformationState
> {
  mounted: boolean
  constructor() {
    super()
    this.state = {
      editCompanyOpen: false,
      fetchingCompanyProfile: false,
      displayName: '',
      fetchCompanyProfileError: false,
      addressName: '',
      lineOne: '',
      lineTwo: '',
      city: '',
      region: '',
      postalCode: '',
      countryId: '',
      contactNumber: '',
      assetsUnderManagement: '',
      licenseType: '',
      licenseNumber: '',
      registrationNumber: '',
      yearOfIncorporation: ''
    }
    this.toggleEditCompany = this.toggleEditCompany.bind(this)
    this.fetchCompanyInfo = this.fetchCompanyInfo.bind(this)
  }

  componentDidMount() {
    this.mounted = true
    if (this.props.assumedAMID) {
      this.fetchCompanyInfo(this.props.assumedAMID)
    }
  }

  componentWillReceiveProps(nextProps: ICompanyInformationProps) {
    if (this.props.assumedAMID !== nextProps.assumedAMID) {
      this.fetchCompanyInfo(nextProps.assumedAMID)
    }
  }

  toggleEditCompany() {
    if (this.mounted) {
      this.setState({
        editCompanyOpen: !this.state.editCompanyOpen
      })
    }
  }

  fetchCompanyInfo(AMId: string) {
    if (!this.mounted) return
    this.setState({ fetchingCompanyProfile: true })
    let promise = api.Parties.retrieve({
      AMId: parseInt(AMId),
      resourceId: `AMID${AMId}`
    }) as any // Fix this one the type declaration is update to allow non-array return types
    promise
      .then((res: parties.AssetManager) => {
        if (!this.mounted) return

        const phoneNumberArray: any[] = []
        forEach(res.phoneNumbers, (value: object, key: string) =>
          phoneNumberArray.push({ ...value, name: key })
        )
        const primaryPhoneNumber =
          phoneNumberArray.find(
            phoneNumberObj => phoneNumberObj.phoneNumberPrimary
          ) || ''

        this.setState({
          fetchingCompanyProfile: false,
          displayName: res.displayName || '',
          contactNumber: primaryPhoneNumber.phoneNumber,
          assetsUnderManagement: res.assetsUnderManagement || '',
          licenseType: res.licenseType || '',
          licenseNumber: res.licenseNumber || '',
          registrationNumber: res.registrationNumber || '',
          yearOfIncorporation: res.yearOfIncorporation || ''
        })
        const addressArray: any[] = []
        forEach(res.addresses, (value: object, key: string) =>
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
        if (primaryAddress) {
          const {
            name: addressName,
            lineOne,
            lineTwo,
            city,
            region,
            postalCode,
            countryId
          } = primaryAddress
          if (!this.mounted) return
          this.setState({
            addressName,
            lineOne,
            lineTwo,
            city,
            region,
            postalCode,
            countryId
          })
        }
      })
      .catch((err: any) => {
        console.log(err)
        if (!this.mounted) return
        this.setState({
          fetchCompanyProfileError: true,
          fetchingCompanyProfile: false
        })
      })
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    const { darkProfile, isAdmin } = this.props
    const {
      editCompanyOpen,
      fetchingCompanyProfile,
      fetchCompanyProfileError,
      displayName,
      addressName,
      lineOne,
      lineTwo,
      city,
      region,
      postalCode,
      countryId,
      contactNumber,
      assetsUnderManagement,
      licenseType,
      licenseNumber,
      registrationNumber,
      yearOfIncorporation
    } = this.state
    const infoGroup = (
      name?: JSX.Element,
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
              inverted={darkProfile}
              size="tiny"
              icon="configure"
              onClick={() => changeFunction()}
            />
          </div>
        ) : null}
      </div>
    )
    return (
      <div>
        <EditCompany
          assumedAMID={this.props.assumedAMID}
          isOpen={editCompanyOpen}
          handleEditCompanyClose={this.toggleEditCompany}
          fetchProfileData={this.fetchCompanyInfo}
          messagesProp={messages}
          initialValues={{
            displayName,
            addressName,
            lineOne,
            lineTwo,
            city,
            region,
            postalCode,
            countryId,
            contactNumber,
            assetsUnderManagement,
            licenseType,
            licenseNumber,
            registrationNumber,
            yearOfIncorporation
          }}
        />
        <Segment.Group compact>
          <Segment inverted={darkProfile}>
            {this.state.fetchCompanyProfileError ? (
              <Message negative>
                Error fetching profile information, please refresh
              </Message>
            ) : null}
            <div
              className={`account-container ${darkProfile ? 'inverted' : ''}`}
            >
              <div className="account-action">
                <h4>
                  <FormattedMessage {...messages.companyInfo} />
                </h4>
                {isAdmin ? (
                  <Button
                    basic
                    size="mini"
                    icon="configure"
                    inverted={darkProfile}
                    onClick={this.toggleEditCompany}
                  />
                ) : null}
              </div>
              <div className="account-info">
                <div className="account-column-container">
                  {infoGroup(
                    <FormattedMessage {...fieldMessages.displayName} />,
                    fetchingCompanyProfile ? (
                      <Skeleton size="mini" />
                    ) : (
                      <p>{displayName}</p>
                    )
                  )}
                  {infoGroup(
                    <FormattedMessage {...fieldMessages.lineOne} />,
                    fetchingCompanyProfile ? (
                      <Skeleton size="mini" />
                    ) : (
                      <p>{lineOne}</p>
                    )
                  )}
                  {infoGroup(
                    <FormattedMessage {...fieldMessages.lineTwo} />,
                    fetchingCompanyProfile ? (
                      <Skeleton size="mini" />
                    ) : (
                      <p>{lineTwo}</p>
                    )
                  )}
                  {infoGroup(
                    <FormattedMessage {...fieldMessages.city} />,
                    fetchingCompanyProfile ? (
                      <Skeleton size="mini" />
                    ) : (
                      <p>{city}</p>
                    )
                  )}
                  {infoGroup(
                    <FormattedMessage {...fieldMessages.region} />,
                    fetchingCompanyProfile ? (
                      <Skeleton size="mini" />
                    ) : (
                      <p>{region}</p>
                    )
                  )}
                  {infoGroup(
                    <FormattedMessage {...fieldMessages.postalCode} />,
                    fetchingCompanyProfile ? (
                      <Skeleton size="mini" />
                    ) : (
                      <p>{postalCode}</p>
                    )
                  )}
                  {infoGroup(
                    <FormattedMessage {...fieldMessages.countryId} />,
                    fetchingCompanyProfile ? (
                      <Skeleton size="mini" />
                    ) : (
                      <p>{countryId}</p>
                    )
                  )}
                </div>
                <div className="account-column-container">
                  {infoGroup(
                    <FormattedMessage {...fieldMessages.contactNumber} />,
                    fetchingCompanyProfile ? (
                      <Skeleton size="mini" />
                    ) : (
                      <p>{contactNumber}</p>
                    )
                  )}
                  {infoGroup(
                    <FormattedMessage
                      {...fieldMessages.assetsUnderManagement}
                    />,
                    fetchingCompanyProfile ? (
                      <Skeleton size="mini" />
                    ) : (
                      <p>{assetsUnderManagement}</p>
                    )
                  )}
                  {infoGroup(
                    <FormattedMessage {...fieldMessages.licenseType} />,
                    fetchingCompanyProfile ? (
                      <Skeleton size="mini" />
                    ) : (
                      <p>{licenseType}</p>
                    )
                  )}
                  {infoGroup(
                    <FormattedMessage {...fieldMessages.licenseNumber} />,
                    fetchingCompanyProfile ? (
                      <Skeleton size="mini" />
                    ) : (
                      <p>{licenseNumber}</p>
                    )
                  )}
                  {infoGroup(
                    <FormattedMessage {...fieldMessages.registrationNumber} />,
                    fetchingCompanyProfile ? (
                      <Skeleton size="mini" />
                    ) : (
                      <p>{registrationNumber}</p>
                    )
                  )}
                  {infoGroup(
                    <FormattedMessage {...fieldMessages.yearOfIncorporation} />,
                    fetchingCompanyProfile ? (
                      <Skeleton size="mini" />
                    ) : (
                      <p>{yearOfIncorporation}</p>
                    )
                  )}
                  <div style={{ flex: '1' }} />
                </div>
              </div>
            </div>
          </Segment>
        </Segment.Group>
      </div>
    )
  }
}

export default injectIntl(CompanyInformation)

import flow from 'lodash/flow'
import moment from 'moment'

import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import startCase from 'lodash/startCase'
import { Form, Grid, Segment } from 'semantic-ui-react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { api, parties } from '@amaas/amaas-core-sdk-js'
import Input from 'containers/Shared/CompactInput'

import formConfig from 'utils/form/PartyConfig'
import ToastContainer, {
  successToast,
  errorToast
} from 'components/Shared/ArgomiToastContainer'
import FormBuilder from 'containers/Shared/FormBuilder'
import { IConfigInterface } from 'components/Shared/FormBuilder'
import {
  individualConfig,
  companyConfig,
  fundConfig,
  brokerConfig,
  exchangeConfig,
  organisationConfig
} from 'utils/form/PartyConfig'
import {
  required,
  formatDate,
  hasSpace,
  makeUpperCase,
  trimSpace
} from 'utils/form'
import messages from './PartyStrings'
import Dropdown from 'containers/Shared/Dropdown'
import { parseError } from 'utils/error'
import { parseAMaaSDate } from 'utils/form'

const bookIdNoSpace = hasSpace('Book Id')
const bookIdNormaliser = flow([trimSpace, makeUpperCase])

interface IPartyFormState {
  partyType: string
  loadingData: boolean
  formData: any
  retired: boolean
  amidOfParty: number
  readOnlyMode: boolean
}

// BrokerForm component creates Broker form
class PartyForm extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    let initialType = ''
    if (props.formData && props.formData.partyId) {
      // this means the form is being used for edit
      initialType = props.formData.partyType
    } else if (!Array.isArray(props.partyType)) {
      // we have only one option for party types
      initialType = props.partyType
    }
    this.state = {
      partyType: initialType || '', // new party form and multiple options? User must make a selection
      loadingData: true,
      formData: '',
      retired: false,
      amidOfParty: -1,
      readOnlyMode: false
    }
    this.renderFields = this.renderFields.bind(this)
    this.handleSelectPartyType = this.handleSelectPartyType.bind(this)
    this.filterConfig = this.filterConfig.bind(this)
    this.getCommentField = this.getCommentField.bind(this)
    this.getLinksField = this.getLinksField.bind(this)
    this.getReferencesField = this.getReferencesField.bind(this)
    this.getAddressField = this.getAddressField.bind(this)
    this.getEmailField = this.getEmailField.bind(this)
    //this.individualfilterConfig = this.individualfilterConfig.bind(this)
  }
  getAddressField(frmData: any) {
    const addresses =
      frmData.addresses &&
      Object.keys(frmData.addresses).map(key => ({
        ...frmData.addresses[key],
        name: key
      }))
    return addresses
  }

  getLinksField(frmData: any) {
    const links =
      frmData.links &&
      Object.keys(frmData.links).map(key => ({
        name: key,
        links: frmData.links[key].map((link: any) => ({ ...link }))
      }))
    return links
  }

  getReferencesField(frmData: any) {
    const references =
      frmData.references &&
      Object.keys(frmData.references).map(key => ({
        ...frmData.references[key],
        name: key
      }))
    return references
  }

  getCommentField(frmData: any) {
    const comments =
      frmData.comments &&
      Object.keys(frmData.comments).map(key => ({
        ...frmData.comments[key],
        commentValue: frmData.comments[key].commentValue
          ? frmData.comments[key].commentValue.toString()
          : '0',
        name: key
      }))
    return comments
  }

  getEmailField(frmData: any) {
    const emails =
      frmData.emails &&
      Object.keys(frmData.emails).map(key => ({
        ...frmData.emails[key],
        name: key
      }))
    return emails
  }

  getPhoneNumberField(frmData: any) {
    const phoneNumbers =
      frmData.phoneNumbers &&
      Object.keys(frmData.phoneNumbers).map(key => ({
        ...frmData.phoneNumbers[key],
        name: key
      }))
    return phoneNumbers
  }

  componentDidMount() {
    if (!this.props.formData) {
      this.setState({ loadingData: false })
      return // initialize with default values
    }
    if (
      this.props.assumedAMID &&
      this.props.assumedAMID != this.props.formData.assetManagerId
    ) {
      this.setState({ readOnlyMode: true })
    }
    const { partyId, assetManagerId } = this.props.formData
    if (partyId && (assetManagerId || assetManagerId === 0)) {
      this.setState({ loadingData: true })
      let promise = api.Parties.retrieve({
        AMId: assetManagerId,
        resourceId: partyId
      }) as Promise<any[]>
      promise
        .then((res: any) => {
          // here you will have access to the whole asset object (data). You should carry out the normal functions (converting and initializing) in here:
          let formData = res
          const comments = this.getCommentField(formData)
          const addresses = this.getAddressField(formData)
          const emails = this.getEmailField(formData)
          const phoneNumbers = this.getPhoneNumberField(formData)
          const links = this.getLinksField(formData)
          const references = this.getReferencesField(formData)

          let { dateOfBirth } = res
          if (dateOfBirth) {
            dateOfBirth = moment(dateOfBirth, 'YYYY-MM-DD')
          }
          let { assetManagerId } = res
          let { amidOfParty } = this.state
          if (assetManagerId || assetManagerId == 0)
            amidOfParty = assetManagerId
          this.setState({ amidOfParty })

          if (this.props.initialize) {
            this.props.initialize({
              ...res,
              dateOfBirth,
              comments,
              links,
              references,
              addresses,
              emails,
              phoneNumbers
            })
          }
          this.setState({ loadingData: false, formData: res })
          if (this.state.formData.partyStatus == 'Inactive') {
            this.setState({ retired: true })
          } else {
            this.setState({ retired: false })
          }
        })
        .catch(err => {
          // handle the error
          errorToast(parseError(err) || 'error')
          console.log(err)
          this.setState({ loadingData: false })
        })
    }
  }

  componentWillReceiveProps(nextProps: any) {
    if (this.props.formData !== undefined) {
      if (
        Object.keys(this.props.formData).length == 0 &&
        Object.keys(nextProps.formData).length > 0
      ) {
        let formData = Object.assign({}, ...nextProps.formData)
        if (
          this.props.assumedAMID &&
          this.props.assumedAMID != nextProps.formData.assetManagerId
        ) {
          this.setState({ readOnlyMode: true })
        }
        const comments = this.getCommentField(formData)
        const addresses = this.getAddressField(formData)
        const emails = this.getEmailField(formData)
        const phoneNumbers = this.getPhoneNumberField(formData)
        const links = this.getLinksField(formData)
        const references = this.getReferencesField(formData)
        if (nextProps.initialize) {
          nextProps.initialize({
            ...formData,
            comments,
            links,
            references,
            addresses,
            emails,
            phoneNumbers
          })
        }
        this.setState({ loadingData: false, partyType: nextProps.partyType })
      }
    }
  }

  individualfilterConfig = (formConfig: any) => {
    var individualData: any = ''
    individualData = formConfig.filter(function(individualRow: any) {
      if (individualRow.name !== 'legalName') {
        return individualRow
      }
    })
    return individualData
  }

  filterConfig(
    formConfig: any,
    filterId: string,
    changeId: string,
    changeValue: boolean
  ) {
    let formDataArray, formData: any
    formDataArray = formConfig
    return formDataArray.map((formDataObject: IConfigInterface) => {
      if (formDataObject.name == filterId) {
        return { ...formDataObject, [changeId]: changeValue }
      }
      return formDataObject
    })
  }

  renderFields(partyType: string) {
    let formConfig: IConfigInterface[]
    switch (partyType.toLowerCase()) {
      case 'individual':
        formConfig = this.individualfilterConfig(individualConfig)
        break
      case 'company':
        formConfig = companyConfig
        break
      case 'broker':
        formConfig = brokerConfig
        break
      case 'fund':
        formConfig = fundConfig
        break
      case 'exchange':
        formConfig = exchangeConfig
        break
      case 'organisation':
        formConfig = organisationConfig
        break
      default:
        formConfig = []
    }
    if (this.props.uniqueColumnId === undefined) {
      const modifiedFormConfig = this.filterConfig(
        formConfig,
        'partyId',
        'readOnly',
        false
      )
      formConfig = modifiedFormConfig
    } else {
      const modifiedFormConfig = this.filterConfig(
        formConfig,
        'partyId',
        'readOnly',
        true
      )
      formConfig = modifiedFormConfig
    }
    return formConfig
  }

  handleSelectPartyType(e: any, partyType: string) {
    this.setState({ partyType })
  }

  render() {
    const {
      darkProfile,
      handleSubmit,
      pristine,
      reset,
      submitting,
      initialized,
      partyType
    } = this.props
    const { amidOfParty } = this.state
    const { partyType: formPartyType } = this.state
    const partyTypeArray = Array.isArray(partyType) ? partyType : [partyType]
    return (
      <div>
        <div className="sub-component-container edit-transaction-container">
          <Form
            className="semantic-form"
            onSubmit={handleSubmit}
            inverted={darkProfile}
            size="tiny"
          >
            <Segment basic loading={this.state.loadingData}>
              <Segment.Group size="tiny">
                {partyTypeArray.length > 1 &&
                this.props.uniqueColumnId === undefined ? (
                  <Segment inverted={darkProfile}>
                    <div style={{ display: 'inline-block' }}>
                      <Field
                        name="partyType"
                        component={Dropdown}
                        options={partyTypeArray.map(type => ({
                          text: startCase(type),
                          value: startCase(type)
                        }))}
                        compact={false}
                        onChange={this.handleSelectPartyType}
                        placeholder={this.props.intl.formatMessage(
                          messages.selectPartyType
                        )}
                      />
                    </div>
                  </Segment>
                ) : null}
                <Segment inverted={darkProfile}>
                  {formPartyType ? (
                    <FormBuilder
                      formConfig={this.renderFields(formPartyType)}
                      readOnly={
                        this.props.uniqueColumnId &&
                        this.props.assumedAMID != amidOfParty &&
                        this.state.readOnlyMode
                      }
                    />
                  ) : (
                    <FormattedMessage {...messages.noPartyMessage} />
                  )}
                </Segment>
                <Segment inverted={darkProfile}>
                  <Grid columns={2} divided>
                    <Grid.Row>
                      <div className="form-button-container">
                        {this.props.uniqueColumnId !== undefined &&
                        !this.state.readOnlyMode ? (
                          <Form.Button
                            primary
                            type="button"
                            onClick={reset}
                            disabled={this.props.pristine || submitting}
                          >
                            {this.props.intl.formatMessage(messages.reset)}
                          </Form.Button>
                        ) : null}
                        {this.props.hideCancelButton ? null : (
                          <Form.Button
                            negative
                            type="cancel"
                            onClick={this.props.callbackOnCancel}
                          >
                            {this.props.cancelButtonLabel}
                          </Form.Button>
                        )}
                        {!this.state.readOnlyMode ? (
                          <Form.Button
                            positive
                            type="submit"
                            disabled={this.props.pristine || this.state.retired}
                            loading={this.props.loader}
                          >
                            {this.props.submitButtonLabel}
                          </Form.Button>
                        ) : null}
                      </div>
                    </Grid.Row>
                  </Grid>
                </Segment>
              </Segment.Group>
            </Segment>
          </Form>
        </div>
      </div>
    )
  }
}

const IntlPartyForm = injectIntl(PartyForm)

export default reduxForm({
  form: 'party-form' // a unique identifier for this form
})(IntlPartyForm)

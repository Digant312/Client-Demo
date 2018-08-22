import React, { Component } from 'react'
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl'
import { Redirect, Route, RouteComponentProps, Link } from 'react-router-dom'
import { Label, Form, Grid, Segment, Button } from 'semantic-ui-react'
import { Field, reduxForm } from 'redux-form'
import PartyForm from './PartyForm'

import { api, parties } from '@amaas/amaas-core-sdk-js'
import {
  successToast,
  errorToast
} from 'components/Shared/ArgomiToastContainer'
import { parseError } from 'utils/error'

export interface IPartyPageProps {
  partyId: string
  parties: parties.Party[] // change equities to fx or futures
  fetching: boolean
  fetchError: string
  darkProfile: boolean
  assumedAMID: string
  assetManagerId: string
  fetchParties: (partyId: string) => void
}

interface IBookPageState {
  loadingData: boolean
  formData: any
}

class PartyPage extends React.Component<
  IPartyPageProps & InjectedIntlProps & RouteComponentProps<any>,
  IBookPageState
> {
  constructor(
    props: IPartyPageProps & InjectedIntlProps & RouteComponentProps<any>
  ) {
    super(props)
    this.state = {
      loadingData: true,
      formData: {}
    }
    this.handleAddBookSubmit = this.handleAddBookSubmit.bind(this)
  }

  componentDidMount() {
    this.props.fetchParties(this.props.match.params.partyId)
    this.setState({ formData: {} })
    if (this.props.parties.length > 0) {
      const partyData: any = this.props.parties
      this.setState({ formData: partyData, loadingData: false })
    }
  }

  componentWillReceiveProps(nextProps: any) {
    if (this.props.parties.length == 0 && nextProps.parties.length > 0) {
      const partyData: any = nextProps.parties
      this.setState({ formData: partyData, loadingData: false })
    }
  }

  handleAddBookSubmit(values: any) {
    console.log('values in submit method: ')
    console.log(values)
  }

  render() {
    const { assumedAMID, darkProfile } = this.props
    const partyId = this.props.match.params.partyId
    const { partyType } = Object.assign({}, ...this.state.formData)
    return (
      <div>
        <Button
          compact
          size="tiny"
          content="Back"
          icon="left arrow"
          labelPosition="left"
          as={Link}
          to={this.props.match.path.split(':')[0]}
        />
        <Segment inverted={darkProfile} basic>
          <h4>Party Id : {partyId}</h4>
          <PartyForm
            submitButtonLabel="Submit"
            hideCancelButton={true}
            onSubmit={this.handleAddBookSubmit}
            darkProfile={this.props.darkProfile}
            formData={this.state.formData}
            partyType={partyType}
          />
        </Segment>
      </div>
    )
  }
}

export default PartyPage

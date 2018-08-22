import React, { Component } from 'react'
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl'
import { Redirect, Route, RouteComponentProps, Link } from 'react-router-dom'
import { Label, Form, Segment, Button } from 'semantic-ui-react'
import { Field, reduxForm } from 'redux-form'
import AssetsForm from './AssetsForm'
import { api, assets } from '@amaas/amaas-core-sdk-js'
import { parseError } from 'utils/error'
import messages from './AssetsStrings'

export interface IAssetsPageProps {
  assetId: string
  assets: assets.Asset[] // change equities to fx or futures
  fetching: boolean
  fetchError: string
  darkProfile: boolean
  assumedAMID: string
  assetManagerId: string
  fetchAssets: (assetId: string) => void
}

interface IAssetPageState {
  loadingData: boolean
  formData: any
}

class AssetsPage extends React.Component<
  IAssetsPageProps & InjectedIntlProps & RouteComponentProps<any>,
  IAssetPageState
> {
  constructor(
    props: IAssetsPageProps & InjectedIntlProps & RouteComponentProps<any>
  ) {
    super(props)
    this.state = {
      loadingData: true,
      formData: {}
    }
    this.handleAddAssetSubmit = this.handleAddAssetSubmit.bind(this)
  }

  componentDidMount() {
    this.props.fetchAssets(this.props.match.params.assetId)
    if (this.props.assets.length > 0) {
      const assetData: any = this.props.assets
      this.setState({ formData: assetData, loadingData: false })
    }
  }

  componentWillReceiveProps(nextProps: any) {
    if (this.props.assets.length === 0 && nextProps.assets.length > 0) {
      const assetData: any = nextProps.assets
      this.setState({ formData: assetData, loadingData: false })
    }
  }
  handleAddAssetSubmit(values: any) {
    console.log('values in submit method: ')
    console.log(values)
  }

  render() {
    const { assumedAMID, darkProfile } = this.props
    const assetId = this.props.match.params.assetId
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
          <h4>Asset Id : {assetId}</h4>
          <AssetsForm
            submitButtonLabel={this.props.intl.formatMessage(
              messages.updateButtonLabel
            )}
            cancelButtonLabel={this.props.intl.formatMessage(
              messages.cancelButtonLabel
            )}
            hideCancelButton={true}
            onSubmit={this.handleAddAssetSubmit}
            assumedAMID={this.props.assumedAMID}
            darkProfile={this.props.darkProfile}
            formData={this.state.formData}
            type={this.state.formData.assetType}
            loader={this.state.loadingData}
          />
        </Segment>
      </div>
    )
  }
}

export default injectIntl(AssetsPage)

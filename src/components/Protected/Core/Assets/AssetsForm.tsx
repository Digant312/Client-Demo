import React, { Component } from 'react'
import { render } from 'react-dom'
import moment from 'moment'
import { Form, Grid, Segment, Button } from 'semantic-ui-react'
import { reduxForm } from 'redux-form'
import { api, assets } from '@amaas/amaas-core-sdk-js'
import { FormattedMessage, injectIntl } from 'react-intl'
import {
  successToast,
  errorToast
} from 'components/Shared/ArgomiToastContainer'
import { parseError } from 'utils/error'
import { parseAMaaSDate } from 'utils/form'
import messages from './AssetsStrings'

import {
  genericAssetConfig,
  equityConfig,
  fxConfig,
  futureConfig,
  etfConfig
} from 'utils/form/AssetConfig'
import FormBuilder from 'containers/Shared/FormBuilder'
import { IConfigInterface } from 'components/Shared/FormBuilder'

const filterConfig = (config: IConfigInterface) => {
  const { name } = config
  return (
    name !== 'references' &&
    name !== 'major' &&
    name !== 'comments' &&
    name !== 'links'
  )
}

interface IAssetsFormState {
  loadingData: boolean
  retired: boolean
  amidOfAsset: number
  readOnlyMode: boolean
}

// AssetsForm component creates Assets Form
class AssetsForm extends React.Component<any, IAssetsFormState> {
  constructor(props: any) {
    super(props)
    this.state = {
      loadingData: true,
      retired: false,
      amidOfAsset: -1,
      readOnlyMode: false
    }
    this.filterConfig = this.filterConfig.bind(this)
  }

  getCommentField(formData: any) {
    const comments =
      formData.comments &&
      Object.keys(formData.comments).map(key => ({
        ...formData.comments[key],
        commentValue: formData.comments[key].commentValue
          ? formData.comments[key].commentValue.toString()
          : '0',
        name: key
      }))
    return comments
  }
  getLinksField(formData: any) {
    const links =
      formData.links &&
      Object.keys(formData.links).map(key => ({
        name: key,
        links: formData.links[key].map((link: any) => ({ ...link }))
      }))
    return links
  }
  getReferencesField(formData: any) {
    const references =
      formData.references &&
      Object.keys(formData.references).map(key => ({
        ...formData.references[key],
        name: key
      }))
    return references
  }
  componentDidMount() {
    if (!this.props.formData) {
      this.setState({ loadingData: false }) // initialize with default values
      return
    }
    if (
      this.props.assumedAMID &&
      this.props.assumedAMID != this.props.formData.assetManagerId
    ) {
      this.setState({ readOnlyMode: true })
    }
    const { assetId, assetManagerId } = this.props.formData
    if (assetId && (assetManagerId || assetManagerId === 0)) {
      this.setState({ loadingData: true })

      let promise = api.Assets.retrieve({
        AMId: assetManagerId || parseInt(this.props.assumedAMID),
        resourceId: assetId
      }) as Promise<any[]>
      promise
        .then((res: any) => {
          // here you will have access to the whole asset object (data). You should carry out the normal functions (converting and initializing) in here:
          const comments = this.getCommentField(res)
          const links = this.getLinksField(res)
          const references = this.getReferencesField(res)
          const assetDates = [
            'issueDate',
            'expiryDate',
            'maturityDate',
            'creationDate'
          ]
          const resDates: any = {}
          assetDates.map(dateType => {
            if (res[dateType]) {
              resDates[dateType] = moment.utc(res[dateType])
            }
          })
          if (this.props.initialize) {
            this.props.initialize({
              ...res,
              ...resDates,
              comments,
              links,
              references
            })
          }
          let { assetManagerId } = res
          let { amidOfAsset } = this.state
          if (assetManagerId || assetManagerId === 0)
            amidOfAsset = assetManagerId
          this.setState({ amidOfAsset, loadingData: false })
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
    if (nextProps.formData !== undefined) {
      if (nextProps.formData.assetStatus == 'Inactive') {
        this.setState({ retired: true })
      } else {
        this.setState({ retired: false })
      }
    }
    if (this.props.formData !== undefined) {
      if (this.props.formData == null && nextProps.formData !== null) {
        this.setState({ loadingData: true })
        let formData = Object.assign({}, ...nextProps.formData)
        if (
          this.props.assumedAMID &&
          this.props.assumedAMID != nextProps.formData.assetManagerId
        ) {
          this.setState({ readOnlyMode: true })
        }
        const comments = this.getCommentField(formData)
        const links = this.getLinksField(formData)
        const references = this.getReferencesField(formData)
        const assetDates = [
          'issueDate',
          'expiryDate',
          'maturityDate',
          'creationDate'
        ]
        const resDates: any = {}
        assetDates.map(dateType => {
          if (nextProps[dateType]) {
            resDates[dateType] = moment.utc(nextProps[dateType])
          }
        })

        if (nextProps.initialize) {
          nextProps.initialize({
            ...formData,
            ...resDates,
            comments,
            links,
            references
          })
        }
        this.setState({ loadingData: false })
      }
    }
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

  renderFields(assetType: string) {
    let formConfig: IConfigInterface[]
    switch (assetType) {
      case 'equity':
        formConfig = equityConfig
        break
      case 'fx':
        formConfig = fxConfig
        break
      case 'future':
        formConfig = futureConfig
        break
      case 'etf':
        formConfig = etfConfig.filter(option => option.name !== 'fundType')
        break
      default:
        formConfig = genericAssetConfig
    }
    if (this.props.uniqueColumnId === undefined) {
      const modifiedFormConfig = this.filterConfig(
        formConfig,
        'assetId',
        'readOnly',
        false
      )
      formConfig = modifiedFormConfig
    } else {
      const modifiedFormConfig = this.filterConfig(
        formConfig,
        'assetId',
        'readOnly',
        true
      )
      formConfig = modifiedFormConfig
    }
    return formConfig
  }

  render() {
    const {
      darkProfile,
      handleSubmit,
      pristine,
      reset,
      submitting,
      initialized
    } = this.props
    const { amidOfAsset } = this.state
    return (
      <div>
        <div className="sub-component-container">
          <Form
            className="semantic-form"
            onSubmit={handleSubmit}
            inverted={darkProfile}
            size="tiny"
          >
            <Segment basic loading={this.state.loadingData}>
              <Segment.Group size="tiny">
                <Segment inverted={darkProfile}>
                  <FormBuilder
                    formConfig={this.renderFields(this.props.type)}
                    readOnly={this.state.readOnlyMode}
                  />
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
                        <Form.Button
                          negative
                          type="cancel"
                          onClick={this.props.callbackOnCancel}
                        >
                          {this.props.cancelButtonLabel}
                        </Form.Button>
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
const IntlAssetsForm = injectIntl(AssetsForm)

export default reduxForm({
  form: 'assets-form' // a unique identifier for this form
})(IntlAssetsForm)

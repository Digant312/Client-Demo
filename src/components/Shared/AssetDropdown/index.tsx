import React from 'react'
import { WrappedFieldProps } from 'redux-form'
import { DropdownProps, DropdownItemProps } from 'semantic-ui-react'
import { api, IFuzzySearchResult } from '@amaas/amaas-core-sdk-js'

import SearchableDropdown from 'components/Shared/SearchableDropdown'

interface IAssetDropdownProps {
  api: any
  assumedAMId: string
  queryFilter?: object
}

interface IAssetDropdownState {
  loadingInitial: boolean
  options: DropdownItemProps[]
}

export class AssetDropdown extends React.Component<
  IAssetDropdownProps & WrappedFieldProps<{}> & DropdownProps,
  IAssetDropdownState
> {
  mounted: boolean
  constructor(
    props: IAssetDropdownProps & WrappedFieldProps<{}> & DropdownProps
  ) {
    super(props)
    this.state = {
      loadingInitial: false,
      options: props.initialOptions || []
    }
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.fetchAsset = this.fetchAsset.bind(this)
  }

  componentDidMount() {
    this.mounted = true
    if (this.props.input && this.props.input.value) {
      this.fetchAsset(this.props.input.value)
    }
  }

  componentWillReceiveProps(
    nextProps: IAssetDropdownProps & WrappedFieldProps<{}> & DropdownProps
  ) {
    if (
      nextProps.input &&
      this.props.input &&
      nextProps.input.value !== this.props.input.value &&
      !this.props.meta.active
    ) {
      this.fetchAsset(nextProps.input.value)
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  fetchAsset(value: string) {
    if (this.mounted) this.setState({ loadingInitial: true })
    let promise = this.props.api.Assets.fuzzySearch({
      AMId: parseInt(this.props.assumedAMId),
      query: {
        query: value,
        filter: 'assetId',
        fuzzy: false
      }
    }) as Promise<IFuzzySearchResult>
    promise
      .then(res => {
        const options = res.hits.map(res => {
          const { assetManagerId, assetId, displayName, description } = res
          const ticker = res['references.referencePrimary']
          const contentConfig = { assetId, displayName, description, ticker }
          return {
            key: `${assetManagerId}.${assetId}`,
            text: ticker || assetId,
            value: assetId,
            content: <AssetDropdownContent {...contentConfig} />
          }
        })
        if (this.mounted)
          this.setState({
            options,
            loadingInitial: false
          })
      })
      .catch(err => {
        console.error(err)
        if (this.mounted)
          this.setState({
            loadingInitial: false
          })
      })
  }

  async handleSearchChange(value: string) {
    if (!value || !this.props.assumedAMId) return
    const query = {
      ...this.props.queryFilter,
      query: value
    }
    let fuzzyAssets = (await this.props.api.Assets.fuzzySearch({
      AMId: parseInt(this.props.assumedAMId),
      query
    })) as IFuzzySearchResult
    const options = fuzzyAssets.hits.map((fuzzyAsset: any) => {
      const { assetId, displayName, description } = fuzzyAsset
      const ticker = fuzzyAsset['references.referencePrimary']
      const contentConfig = { assetId, displayName, description, ticker }
      return {
        value: assetId,
        text: ticker || assetId,
        content: <AssetDropdownContent {...contentConfig} />
      }
    })
    if (this.mounted) this.setState({ options })
  }
  render() {
    const {
      loading,
      queryFilter,
      initialValues,
      assumedAMId,
      api,
      ...otherProps
    } = this.props
    const { options: initialOptions, loadingInitial } = this.state
    return (
      <SearchableDropdown
        {...otherProps}
        loading={loadingInitial}
        options={initialOptions}
        handleSearchChange={this.handleSearchChange}
        noResultsMessage="Type to search"
      />
    )
  }
}

export default (
  props: IAssetDropdownProps & WrappedFieldProps<{}> & DropdownProps
) => <AssetDropdown {...props} api={api} />

const AssetDropdownContent = (props: {
  assetId: string
  displayName?: string
  description?: string
  ticker?: string
}) => (
  <div>
    <h5 style={{ marginBottom: '5px' }}>Name: {props.displayName}</h5>
    <p style={{ marginBottom: '5px', fontSize: '0.8em' }}>
      ID: {props.assetId}
    </p>
    <p style={{ marginBottom: '5px', fontSize: '0.8em' }}>
      Desc: {props.description}
    </p>
    <p style={{ marginBottom: '0px', fontSize: '0.8em' }}>
      Ticker: {props.ticker}
    </p>
  </div>
)

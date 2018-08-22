import React from 'react'
import { WrappedFieldProps } from 'redux-form'
import { DropdownProps, DropdownItemProps } from 'semantic-ui-react'
import { api, IFuzzySearchResult, IFuzzyHit } from '@amaas/amaas-core-sdk-js'

import SearchableDropdown from 'components/Shared/SearchableDropdown'

interface ICurrencyDropdownProps {
  assumedAMID: string
}

interface ICurrencyDropdownState {
  loadingInitial: boolean
  options: DropdownItemProps[]
  rawOptions: IFuzzyHit[]
}

export default class CurrencyDropdown extends React.Component<
  WrappedFieldProps<{}> & DropdownProps & ICurrencyDropdownProps,
  ICurrencyDropdownState
> {
  mounted: boolean
  constructor(
    props: WrappedFieldProps<{}> & DropdownProps & ICurrencyDropdownProps
  ) {
    super(props)
    this.state = {
      loadingInitial: false,
      options: props.initialValues || [],
      rawOptions: []
    }
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.loadCurrencies = this.loadCurrencies.bind(this)
  }
  componentDidMount() {
    this.mounted = true
    if (
      this.state.options.length > 0 ||
      !this.props.assumedAMID ||
      !this.mounted
    )
      return
    this.loadCurrencies(this.props.assumedAMID)
  }

  loadCurrencies(AMId: string) {
    this.setState({ loadingInitial: true })
    const query = {
      assetClass: 'Currency',
      assetManagerId: [0, 10],
      pageSize: '1000'
    }
    let promise = api.Assets.fuzzySearch({
      AMId: parseInt(AMId),
      query
    }) as Promise<IFuzzySearchResult>
    promise
      .then((res: any) => {
        if (!this.mounted) return
        this.setState({ rawOptions: res.hits })
        const options = res.hits.map((ccy: IFuzzyHit) => ({
          text: ccy.assetId,
          value: ccy.assetId,
          content: (
            <div>
              {ccy.assetId}
              <br />
              {ccy.displayName}
            </div>
          )
        }))
        if (this.mounted) this.setState({ options, loadingInitial: false })
      })
      .catch((e: any) => {
        if (this.mounted) this.setState({ loadingInitial: false })
      })
  }

  componentWillUnmount() {
    this.mounted = false
  }

  handleSearchChange(value: string) {
    const { rawOptions } = this.state
    const regexp = new RegExp(value, 'ig')
    const filterFunction = (ccy: IFuzzyHit) =>
      regexp.test(ccy.assetId) || regexp.test(ccy.displayName)
    const options = rawOptions.filter(filterFunction).map(ccy => ({
      text: ccy.assetId,
      value: ccy.assetId,
      content: (
        <div>
          {ccy.assetId}
          <br />
          {ccy.displayName}
        </div>
      )
    }))
    return options
  }
  render() {
    const { loading, initialValues, assumedAMID, ...otherProps } = this.props
    const { options, loadingInitial } = this.state
    return (
      <SearchableDropdown
        {...otherProps}
        options={options}
        loading={loadingInitial}
        initialOptions={options}
        search={(e, f) => this.handleSearchChange(f)}
      />
    )
  }
}

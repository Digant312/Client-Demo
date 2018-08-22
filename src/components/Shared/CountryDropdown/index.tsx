import React from 'react'
import { WrappedFieldProps } from 'redux-form'
import { DropdownProps, DropdownItemProps } from 'semantic-ui-react'
import { api } from '@amaas/amaas-core-sdk-js'

import SearchableDropdown from 'components/Shared/SearchableDropdown'

interface ICountryDropdownState {
  loadingInitial: boolean
  rawOptions: any[]
  options: DropdownItemProps[]
}

export default class CountryDropdown extends React.Component<
  WrappedFieldProps<{}> & DropdownProps,
  ICountryDropdownState
> {
  mounted: boolean
  constructor(props: WrappedFieldProps<{}> & DropdownProps) {
    super(props)
    this.state = {
      loadingInitial: false,
      rawOptions: [],
      options: props.initialValues || []
    }
    this.handleSearchChange = this.handleSearchChange.bind(this)
  }

  componentDidMount() {
    this.mounted = true
    // if (this.state.options.length > 0 || !this.mounted) return
    if (!this.mounted) return
    this.setState({ loadingInitial: true })
    let promise = api.Fundamentals.countries({ code: '' }) as any
    promise
      .then((res: any[]) => {
        res.sort((a, b) => {
          if (a.name < b.name) return -1
          return 1
        })
        if (this.mounted) this.setState({ rawOptions: res })
        const options = res.map((country: any) => ({
          text: country.name,
          value: country.alpha3
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
    const regexp = new RegExp(value, 'ig')
    const filterFunction = (country: any) =>
      regexp.test(country.alpha3) ||
      regexp.test(country.name) ||
      regexp.test(country.officialName) ||
      regexp.test(country.commonName)
    const options = this.state.rawOptions
      .filter(filterFunction)
      .map((country: any) => ({ text: country.name, value: country.alpha3 }))
    return options
  }
  render() {
    const { loading, initialValues, ...otherProps } = this.props
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

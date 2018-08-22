import React from 'react'
import { defineMessages, injectIntl, InjectedIntlProps } from 'react-intl'
import debounce from 'lodash/debounce'
import { WrappedFieldProps } from 'redux-form'
import {
  Dropdown,
  DropdownProps,
  DropdownItemProps,
  Form,
  Icon
} from 'semantic-ui-react'

import DropdownBase from 'containers/Shared/Dropdown'

interface ISearchableDropdownProps {
  handleSearchChange?: Function
  options?: DropdownItemProps[]
}

interface ISearchableDropdownState {
  loading: boolean
  options: DropdownItemProps[]
}

const messages = defineMessages({
  noResultsMessage: {
    id: 'searchableDropdown.noResultsMessage',
    defaultMessage: 'Type to search'
  }
})

class SearchableDropdown extends React.Component<
  WrappedFieldProps<{}> &
    DropdownProps &
    ISearchableDropdownProps &
    InjectedIntlProps,
  ISearchableDropdownState
> {
  mounted: boolean
  constructor(
    props: WrappedFieldProps<{}> &
      DropdownProps &
      ISearchableDropdownProps &
      InjectedIntlProps
  ) {
    super(props)
    this.state = {
      loading: false,
      options: props.options || []
    }
    this.handleSearchChange = debounce(this.handleSearchChange.bind(this), 200)
  }
  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
  }

  async handleSearchChange(value: string) {
    if (!this.props.handleSearchChange) return
    const { initialOptions, handleSearchChange } = this.props
    if (this.mounted) {
      this.setState({ loading: true })
    }
    try {
      await this.props.handleSearchChange(value)
    } catch (e) {
      console.error(e)
    } finally {
      if (this.mounted) this.setState({ loading: false })
    }
  }

  render() {
    const {
      initialOptions,
      normal,
      handleSearchChange,
      intl,
      search,
      ...passedProps
    } = this.props
    return (
      <DropdownBase
        {...this.state}
        {...passedProps}
        search={search ? search : (e, f) => e}
        noResultsMessage={this.props.intl.formatMessage(
          messages.noResultsMessage
        )}
        onSearchChange={(
          e: React.SyntheticEvent<{}>,
          { searchQuery }: { searchQuery: string }
        ) => this.handleSearchChange(searchQuery)}
      />
    )
  }
}

export default injectIntl(SearchableDropdown)

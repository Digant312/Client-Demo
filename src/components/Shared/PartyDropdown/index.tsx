import React from 'react'
import { WrappedFieldProps } from 'redux-form'
import { DropdownProps, DropdownItemProps } from 'semantic-ui-react'
import { api, IFuzzySearchResult } from '@amaas/amaas-core-sdk-js'

import SearchableDropdown from 'components/Shared/SearchableDropdown'

interface IPartyDropdownProps {
  assumedAMId: string
  queryFilter?: object
}

interface IPartyDropdownState {
  loadingInitial: boolean
  options: DropdownItemProps[]
}

export class PartyDropdown extends React.Component<
  IPartyDropdownProps & WrappedFieldProps<{}> & DropdownProps,
  IPartyDropdownState
> {
  mounted: boolean
  constructor(
    props: IPartyDropdownProps & WrappedFieldProps<{}> & DropdownProps
  ) {
    super(props)
    this.state = {
      loadingInitial: false,
      options: props.initialOptions || []
    }
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.fetchParty = this.fetchParty.bind(this)
  }

  componentDidMount() {
    this.mounted = true
    if (this.props.input && this.props.input.value) {
      this.fetchParty(this.props.input.value)
    }
  }

  componentWillReceiveProps(
    nextProps: IPartyDropdownProps & WrappedFieldProps<{}> & DropdownProps
  ) {
    if (
      nextProps.input &&
      nextProps.input.value &&
      this.props.input &&
      nextProps.input.value !== this.props.input.value &&
      !nextProps.meta.active
    ) {
      this.fetchParty(nextProps.input.value)
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  fetchParty(value: string) {
    if (this.mounted) this.setState({ loadingInitial: true })
    let promise = this.props.api.Parties.fuzzySearch({
      AMId: parseInt(this.props.assumedAMId),
      query: {
        query: value,
        filter: 'partyId',
        fuzzy: false
      }
    }) as Promise<IFuzzySearchResult>
    promise
      .then(res => {
        const options = res.hits.map(res => {
          const {
            assetManagerId,
            partyId,
            displayName,
            description,
            legalName
          } = res
          const contentConfig = { partyId, displayName, description, legalName }
          return {
            key: `${assetManagerId}.${partyId}`,
            text: displayName || description || partyId,
            value: partyId,
            content: <PartyDropdownContent {...contentConfig} />
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
      query: value,
      ...this.props.queryFilter
    }
    let fuzzyParties = (await this.props.api.Parties.fuzzySearch({
      AMId: parseInt(this.props.assumedAMId),
      query
    })) as IFuzzySearchResult
    const options = fuzzyParties.hits.map((fuzzyParty: any) => {
      const {
        displayName,
        description,
        legalName,
        partyId,
        assetManagerId
      } = fuzzyParty
      const contentConfig = { partyId, displayName, description, legalName }
      return {
        key: `${assetManagerId}.${partyId}`,
        value: partyId,
        text: displayName || description || partyId,
        content: <PartyDropdownContent {...contentConfig} />
      }
    })
    if (this.mounted) this.setState({ options })
  }
  render() {
    const { loading, queryFilter, assumedAMId, api, ...otherProps } = this.props
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
  props: IPartyDropdownProps & WrappedFieldProps<{}> & DropdownProps
) => <PartyDropdown {...props} api={api} />

const PartyDropdownContent = (props: {
  partyId: string
  displayName?: string
  description?: string
  legalName?: string
}) => (
  <div>
    ID: {props.partyId}
    <hr />
    Name:{props.displayName}
    <hr />
    Desc: {props.description}
    <hr />
    Legal: {props.legalName}
  </div>
)

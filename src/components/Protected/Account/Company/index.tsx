import React from 'react'
import forEach from 'lodash/forEach'
import { Link, Route, RouteComponentProps } from 'react-router-dom'
import { Header, Icon, Menu, Segment, Dropdown } from 'semantic-ui-react'
import {
  defineMessages,
  FormattedMessage,
  injectIntl,
  InjectedIntlProps
} from 'react-intl'
import { relationships } from '@amaas/amaas-core-sdk-js'

import CompanyInformation from 'containers/Protected/Account/Company/CompanyInformation'
import CompanyRels from 'containers/Protected/Account/Company/CompanyRelationships'
import DataMigration from 'containers/Protected/Account/Company/DataMigration'

const messages = defineMessages({
  company: {
    id: 'editCompany.company',
    defaultMessage: 'Company'
  },
  information: {
    id: 'editCompany.information',
    defaultMessage: 'Information'
  },
  relationships: {
    id: 'editCompany.relationships',
    defaultMessage: 'Relationships'
  },
  dataMigration: {
    id: 'editCompany.dataMigration',
    defaultMessage: 'Data Migration'
  },
  book: {
    id: 'editCompany.book',
    defaultMessage: 'Book'
  },
  asset: {
    id: 'editCompany.asset',
    defaultMessage: 'Asset'
  },
  party: {
    id: 'editCompany.party',
    defaultMessage: 'Party'
  },
  transaction: {
    id: 'editCompany.transaction',
    defaultMessage: 'Transaction'
  }
})

type CompanyPages =
  | 'information'
  | 'relationships'
  | 'book'
  | 'asset'
  | 'party'
  | 'transaction'

export interface ICompanyContainerOwnProps extends RouteComponentProps<{}> {}

export interface ICompanyContainerConnectInjectedProps {
  darkProfile: boolean
  fetchRelationships: Function
  companyName: string
}

interface ICompanyContainerState {
  page: CompanyPages
}

class CompanyContainer extends React.Component<
  ICompanyContainerOwnProps &
    ICompanyContainerConnectInjectedProps &
    InjectedIntlProps,
  ICompanyContainerState
> {
  mounted: boolean
  constructor() {
    super()
    this.state = {
      page: 'information'
    }
  }

  componentDidMount() {
    this.mounted = true
    this.props.fetchRelationships()
  }

  handlePageChange(page: CompanyPages) {
    if (!this.mounted) return
    this.setState({ page })
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    const { companyName, darkProfile, intl } = this.props
    const { formatMessage } = intl
    const { page } = this.state
    return (
      <div>
        <div
          style={{
            display: 'inline-block',
            width: '15rem',
            float: 'left'
          }}
        >
          <div style={{ display: 'block', width: '100%' }}>
            <Header as="h2" inverted={darkProfile}>
              <Icon name="settings" />
              <Header.Content>
                <FormattedMessage {...messages.company} />
                <Header.Subheader>{companyName}</Header.Subheader>
              </Header.Content>
            </Header>
          </div>
          <Menu secondary vertical inverted={darkProfile}>
            <Menu.Item
              name={formatMessage(messages.information)}
              active={page === 'information'}
              onClick={() => this.handlePageChange('information')}
            />
            <Menu.Item
              name={formatMessage(messages.relationships)}
              active={page === 'relationships'}
              onClick={() => this.handlePageChange('relationships')}
            />
            <Dropdown item text={formatMessage(messages.dataMigration)}>
              <Dropdown.Menu>
                <Dropdown.Item
                  active={page === 'transaction'}
                  onClick={() => this.handlePageChange('transaction')}
                >
                  {formatMessage(messages.transaction)}
                </Dropdown.Item>
                <Dropdown.Item
                  active={page === 'book'}
                  onClick={() => this.handlePageChange('book')}
                >
                  {formatMessage(messages.book)}
                </Dropdown.Item>
                <Dropdown.Item
                  active={page === 'asset'}
                  onClick={() => this.handlePageChange('asset')}
                >
                  {formatMessage(messages.asset)}
                </Dropdown.Item>
                <Dropdown.Item
                  active={page === 'party'}
                  onClick={() => this.handlePageChange('party')}
                >
                  {formatMessage(messages.party)}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu>
        </div>
        <div
          style={{
            display: 'inline-block',
            width: 'calc(100% - 15rem)',
            float: 'right'
          }}
        >
          <Segment basic inverted={darkProfile}>
            {page === 'information' ? (
              <CompanyInformation darkProfile={darkProfile} />
            ) : page === 'relationships' ? (
              <CompanyRels fetchRelationships={this.props.fetchRelationships} />
            ) : page === 'transaction' ? (
              <DataMigration type="transaction" />
            ) : page === 'book' ? (
              <DataMigration type="book" />
            ) : page === 'asset' ? (
              <DataMigration type="asset" />
            ) : page === 'party' ? (
              <DataMigration type="party" />
            ) : null}
          </Segment>
        </div>
      </div>
    )
  }
}

export default injectIntl(CompanyContainer)

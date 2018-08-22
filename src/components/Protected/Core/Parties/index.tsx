import React from 'react'
import { render } from 'react-dom'
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl'
import { Menu, Dropdown, Header, Icon, Segment } from 'semantic-ui-react'
import BrokersContainer from 'containers/Protected/Core/Parties/Brokers/BrokersContainer'
import FundsContainer from 'containers/Protected/Core/Parties/Funds/FundsContainer' // import from containers
import IndividualContainer from 'containers/Protected/Core/Parties/Individual/IndividualContainer'
import OrganisationsContainer from 'containers/Protected/Core/Parties/Organisations/OrganisationsContainer'
import { ToastContainer, toast } from 'react-toastify'
import './../styles.scss'
import messages from './PartyStrings'

type PartyPages = 'brokers' | 'funds' | 'individual' | 'organisation' | 'all'

export interface IPartiesContainerProps {
  darkProfile: boolean
}

interface IPartiesContainerState {
  page: PartyPages
}

class PartyContainer extends React.Component<
  IPartiesContainerProps & InjectedIntlProps,
  IPartiesContainerState
> {
  constructor() {
    super()
    this.state = {
      page: 'individual'
    }
  }

  handleItemClick(page: PartyPages) {
    this.setState({ page })
  }
  render() {
    const { page } = this.state
    const { intl } = this.props
    const { formatMessage } = intl
    const { darkProfile } = this.props
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
              <Icon name="users" />
              <Header.Content>
                <FormattedMessage {...messages.parties} />
                <Header.Subheader />
              </Header.Content>
            </Header>
          </div>
          <Menu secondary vertical inverted={darkProfile}>
            <Menu.Item
              name={formatMessage(messages.individual)}
              active={page === 'individual'}
              onClick={() => this.handleItemClick('individual')}
            />
            <Dropdown item text={formatMessage(messages.organisations)}>
              <Dropdown.Menu>
                <Dropdown.Item
                  active={page === 'brokers'}
                  onClick={() => this.handleItemClick('brokers')}
                >
                  {formatMessage(messages.brokersLbl)}
                </Dropdown.Item>
                <Dropdown.Item
                  active={page === 'funds'}
                  onClick={() => this.handleItemClick('funds')}
                >
                  {formatMessage(messages.fundsLbl)}
                </Dropdown.Item>
                <Dropdown.Item
                  active={page === 'all'}
                  onClick={() => this.handleItemClick('all')}
                >
                  {formatMessage(messages.organisationAllLbl)}
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
            {page == 'brokers' ? (
              <BrokersContainer />
            ) : page == 'funds' ? (
              <FundsContainer />
            ) : page == 'all' ? (
              <OrganisationsContainer />
            ) : (
              <IndividualContainer />
            )}
          </Segment>
        </div>
      </div>
    )
  }
}

export default injectIntl(PartyContainer)

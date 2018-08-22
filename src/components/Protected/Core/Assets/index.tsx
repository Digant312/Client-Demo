import React from 'react'
import { render } from 'react-dom'
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl'
import messages from './AssetsStrings'
import { Menu, Dropdown, Header, Icon, Segment } from 'semantic-ui-react'
import EquityContainer from 'containers/Protected/Core/Assets/Equity/EquityContainer' // import from containers
import FxContainer from 'containers/Protected/Core/Assets/Fx/FxContainer'
import FutureContainer from 'containers/Protected/Core/Assets/Future/FutureContainer'
import ETFContainer from 'containers/Protected/Core/Assets/ETF/ETFContainer'
import OtherAssetsContainer from 'containers/Protected/Core/Assets/OtherAssets/OtherAssetsContainer'
import './../styles.scss'

type AssetsPage = 'equity' | 'fx' | 'future' | 'etf' | 'otherAssets'

interface IAssetsContainerProps {
  darkProfile: boolean
}

interface IAssetsContainerState {
  page: AssetsPage
}

class AssetsContainer extends React.Component<
  IAssetsContainerProps & InjectedIntlProps,
  IAssetsContainerState
> {
  constructor() {
    super()
    this.state = {
      page: 'equity'
    }
  }

  handleItemClick = (page: AssetsPage) => this.setState({ page })

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
              <Icon name="money" inverted={darkProfile} />
              <Header.Content>
                <FormattedMessage {...messages.assets} />
                <Header.Subheader>Assets Name</Header.Subheader>
              </Header.Content>
            </Header>
          </div>
          <Menu secondary vertical inverted={darkProfile}>
            <Menu.Item
              name={formatMessage(messages.equity)}
              active={page === 'equity'}
              onClick={() => this.handleItemClick('equity')}
            />
            <Menu.Item
              name={formatMessage(messages.fx)}
              active={page === 'fx'}
              onClick={() => this.handleItemClick('fx')}
            />
            <Menu.Item
              name={formatMessage(messages.future)}
              active={page === 'future'}
              onClick={() => this.handleItemClick('future')}
            />
            <Menu.Item
              name={formatMessage(messages.etf)}
              active={page === 'etf'}
              onClick={() => this.handleItemClick('etf')}
            />
            <Menu.Item
              name={formatMessage(messages.otherAssets)}
              active={page === 'otherAssets'}
              onClick={() => this.handleItemClick('otherAssets')}
            />
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
            {page === 'equity' ? (
              <EquityContainer />
            ) : page === 'fx' ? (
              <FxContainer />
            ) : page === 'future' ? (
              <FutureContainer />
            ) : page === 'etf' ? (
              <ETFContainer />
            ) : (
              <OtherAssetsContainer />
            )}
          </Segment>
        </div>
      </div>
    )
  }
}

export default injectIntl(AssetsContainer)

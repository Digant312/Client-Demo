import React from 'react'
import uniqBy from 'lodash/uniqBy'
import { Link, Route, RouteComponentProps } from 'react-router-dom'
import {
  Button,
  Dropdown,
  DropdownItemProps,
  Image,
  Menu,
  Segment
} from 'semantic-ui-react'
import { FormattedMessage, defineMessages } from 'react-intl'

import { staticAssets } from 'config'
import { IAssumableAMIDs } from 'actions/session'

const userCanAssumeOwnAMID = false // flag to determine whether user can assume her own AMID

const messages = defineMessages({
  portfolio: {
    id: 'argomiNavBar.portfolio',
    defaultMessage: 'Portfolio'
  },
  monitor: {
    id: 'argomiNavBar.monitor',
    defaultMessage: 'Monitor'
  },
  core: {
    id: 'argomiNavBar.core',
    defaultMessage: 'Core'
  },
  account: {
    id: 'argomiNavBar.account',
    defaultMessage: 'Account'
  },
  logout: {
    id: 'argomiNavBar.logout',
    defaultMessage: 'Logout'
  },
  noRels: {
    id: 'argomiNavBar.noRels',
    defaultMessage: 'No active relationships - awaiting approval'
  }
})

export interface IArgomiNavBarProps {
  path: string
}

export interface IConnectInjectedProps {
  fetchingProfile: boolean
  assumableAMIDs: IAssumableAMIDs[]
  assumedAMID: string
  assetManagerId: string
  darkProfile: boolean
  toggleDarkProfile: Function
  handleLogout: Function
  selectAMID: Function
}

const logo = staticAssets(process.env.DEPLOY_ENV as string).appIconOnDarkBig
const invertedLogo = staticAssets(process.env.DEPLOY_ENV as string)
  .appIconOnWhiteBig

export default class ArgomiNavBar extends React.Component<
  IArgomiNavBarProps & IConnectInjectedProps & RouteComponentProps<{}>
> {
  mounted: boolean
  constructor() {
    super()
    this.convertAssumableAMIDsToOptions = this.convertAssumableAMIDsToOptions.bind(
      this
    )
  }

  componentWillUnmount() {
    this.mounted = false
  }

  convertAssumableAMIDsToOptions(assumableAMIDs: IAssumableAMIDs[]) {
    return uniqBy(
      assumableAMIDs
        .filter(amid => {
          return userCanAssumeOwnAMID
            ? true
            : amid.assetManagerId !== parseInt(this.props.assetManagerId)
        })
        .map((amid: IAssumableAMIDs) => ({
          text: amid.name,
          value: amid.assetManagerId.toString()
        })),
      'value'
    )
  }

  render() {
    const {
      path,
      assumableAMIDs,
      assumedAMID,
      assetManagerId,
      selectAMID,
      darkProfile,
      fetchingProfile,
      ...rest
    } = this.props
    const dropdownOptions = this.convertAssumableAMIDsToOptions(assumableAMIDs)
    return (
      <Route
        path={path}
        render={props => (
          <div className={`protected-menu ${darkProfile ? 'dark' : ''}`}>
            <Menu secondary pointing inverted color="green">
              <Menu.Item>
                <Image
                  as={Link}
                  size="mini"
                  to="/"
                  src={darkProfile ? invertedLogo : logo}
                />
              </Menu.Item>
              <Menu.Item
                as={Link}
                to="/a-a/portfolio"
                active={props.match.path === '/a-a/portfolio'}
              >
                <FormattedMessage {...messages.portfolio} />
              </Menu.Item>
              <Menu.Item
                as={Link}
                to="/a-a/monitor"
                active={props.match.path === '/a-a/monitor'}
              >
                <FormattedMessage {...messages.monitor} />
              </Menu.Item>
              <Menu.Item
                as={Link}
                to="/a-a/core"
                active={props.match.path === '/a-a/core'}
              >
                <FormattedMessage {...messages.core} />
              </Menu.Item>
              <Menu.Item
                as={Link}
                to="/a-a/account"
                active={props.match.path === '/a-a/account'}
              >
                <FormattedMessage {...messages.account} />
              </Menu.Item>
              <Menu.Menu position="right">
                <Menu.Item>
                  {fetchingProfile ? (
                    <Dropdown loading />
                  ) : dropdownOptions.length === 0 ? (
                    <Segment basic size="mini" inverted={darkProfile}>
                      <FormattedMessage {...messages.noRels} />
                    </Segment>
                  ) : dropdownOptions.length === 1 ? (
                    dropdownOptions[0].text
                  ) : (
                    <Dropdown
                      compact
                      loading={!assetManagerId}
                      options={dropdownOptions}
                      value={assumedAMID.toString()}
                      onChange={(e, { value }) => {
                        if (value == assumedAMID) return
                        selectAMID(value)
                      }}
                      selectOnNavigation={false}
                    />
                  )}
                </Menu.Item>
                <Menu.Item>
                  <Button inverted basic onClick={() => rest.handleLogout()}>
                    <FormattedMessage {...messages.logout} />
                  </Button>
                </Menu.Item>
                <Menu.Item>
                  <Button
                    basic
                    inverted
                    icon={darkProfile ? 'sun' : 'moon'}
                    onClick={() => rest.toggleDarkProfile()}
                  />
                </Menu.Item>
              </Menu.Menu>
            </Menu>
          </div>
        )}
      />
    )
  }
}

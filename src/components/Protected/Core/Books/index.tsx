import React from 'react'
import { render } from 'react-dom'
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl'
import messages from './BooksStrings'
import { Menu, Dropdown, Header, Icon, Segment } from 'semantic-ui-react'
import BooksContainer from 'containers/Protected/Core/Books/Book/BooksContainer'
import PermissionContainer from 'containers/Protected/Core/Books/Permission/PermissionContainer'
import './../styles.scss'

type BooksPage = 'Books' | 'Permissions'

interface IBooksContainerProps {
  darkProfile: boolean
}

interface IBooksContainerState {
  page: BooksPage
}

class BookMainContainer extends React.Component<
  IBooksContainerProps & InjectedIntlProps,
  IBooksContainerState
> {
  constructor() {
    super()
    this.state = {
      page: 'Books'
    }
  }

  handleItemClick(page: BooksPage) {
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
              <Icon name="book" />
              <Header.Content>
                <FormattedMessage {...messages.books} />
                <Header.Subheader>Books Name</Header.Subheader>
              </Header.Content>
            </Header>
          </div>
          <Menu secondary vertical inverted={darkProfile}>
            <Menu.Item
              name={formatMessage(messages.books)}
              active={page === 'Books'}
              onClick={() => this.handleItemClick('Books')}
            />
            <Menu.Item
              name={formatMessage(messages.permission)}
              active={page === 'Permissions'}
              onClick={() => this.handleItemClick('Permissions')}
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
            {page == 'Books' ? <BooksContainer /> : <PermissionContainer />}
          </Segment>
        </div>
      </div>
    )
  }
}

export default injectIntl(BookMainContainer)

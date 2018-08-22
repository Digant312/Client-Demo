import React from 'react'
import { Redirect, Route, RouteComponentProps } from 'react-router-dom'
import { defineMessages, FormattedMessage } from 'react-intl'

import MainLayout from 'containers/Shared/Layouts/Protected/Main'
import BookMainContainer from 'containers/Protected/Core/Books/BookMainContainer'
import AssetsContainer from 'containers/Protected/Core/Assets/AssetsContainer'
import PartyContainer from 'containers/Protected/Core/Parties/PartyContainer'
import BookPage from 'containers/Protected/Core/Books/BookPage'
import PartyPage from 'containers/Protected/Core/Parties/PartyPage'
import AssetsPage from 'containers/Protected/Core/Assets/AssetsPage'

interface ICoreContainerProps extends RouteComponentProps<{}> {
  darkProfile: boolean
}

const messages = defineMessages({
  books: {
    id: 'core.books',
    defaultMessage: 'Books'
  },
  parties: {
    id: 'core.parties',
    defaultMessage: 'Parties'
  },
  assets: {
    id: 'core.assets',
    defaultMessage: 'Assets'
  }
})

const Core = (props: ICoreContainerProps) => {
  const menuConfig = [
    {
      name: <FormattedMessage {...messages.books} />,
      path: `${props.match.url}/books`,
      exact: true,
      component: () => (
        <div>
          <BookMainContainer />
        </div>
      )
    },
    {
      name: <FormattedMessage {...messages.assets} />,
      path: `${props.match.url}/assets`,
      exact: true,
      component: () => (
        <div>
          <AssetsContainer />
        </div>
      )
    },
    {
      name: <FormattedMessage {...messages.parties} />,
      path: `${props.match.url}/parties`,
      exact: true,
      component: () => (
        <div>
          <PartyContainer />
        </div>
      )
    },
    {
      name: <FormattedMessage {...messages.assets} />,
      path: `${props.match.url}/books/:bookId`,
      exact: true,
      visible: false,
      component: BookPage
    },
    {
      name: <FormattedMessage {...messages.assets} />,
      path: `${props.match.url}/assets/:assetId`,
      exact: true,
      visible: false,
      component: AssetsPage
    },
    {
      name: <FormattedMessage {...messages.assets} />,
      path: `${props.match.url}/parties/:partyId`,
      exact: true,
      visible: false,
      component: PartyPage
    }
  ]

  if (props.location.pathname === props.match.path)
    return <Redirect to={`${props.match.url}/books`} />
  return <MainLayout subMenu={menuConfig} />
}
export default Core

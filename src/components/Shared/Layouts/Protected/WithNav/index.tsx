import React from 'react'
import uniq from 'lodash/uniq'
import { Link, Route, RouteComponentProps } from 'react-router-dom'
import { Button, Dropdown, Image, Menu } from 'semantic-ui-react'

import ArgomiNavBar from 'containers/Shared/Layouts/Protected/ArgomiNavBar'
import { staticAssets } from 'config'

const logo = staticAssets(process.env.DEPLOY_ENV as string).appIconOnDarkBig
const invertedLogo = staticAssets(process.env.DEPLOY_ENV as string)
  .appIconOnWhiteBig

import './styles.scss'

export interface IWithNavProps {
  path: string
  component: React.ComponentType<any>
}

const WithNav = (props: IWithNavProps) => {
  const { component: Component, path } = props
  return (
    <Route
      path={path}
      render={routeProps => (
        <div className="div-height-fill">
          <ArgomiNavBar path={path} />
          <div className="div-height-fill">
            <Component path={path} {...routeProps} />
          </div>
        </div>
      )}
    />
  )
}

export default WithNav

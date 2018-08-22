import React from 'react'
import { Menu } from 'semantic-ui-react'
import { Link, RouteComponentProps } from 'react-router-dom'

import { ISubMenuConfig } from './'

interface ISubMenuProps {
  subMenu: ISubMenuConfig[]
}

const SubMenu = (props: ISubMenuProps & RouteComponentProps<{}>) => {
  return (
    <Menu pointing secondary color="green">
      {props.subMenu
        .filter((config: ISubMenuConfig) => config.visible !== false)
        .map((config: ISubMenuConfig, i: number) => {
          const matchPathOrSubpath = new RegExp(config.path, 'ig').test(
            props.location.pathname
          )
          return (
            <Menu.Item
              key={i}
              as={Link}
              to={config.path}
              active={matchPathOrSubpath}
            >
              {config.name}
            </Menu.Item>
          )
        })}
    </Menu>
  )
}

export default SubMenu

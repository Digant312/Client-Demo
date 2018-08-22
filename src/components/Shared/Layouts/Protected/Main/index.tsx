import React from 'react'
import { Button, Icon, Segment, Sidebar } from 'semantic-ui-react'
import { Route, RouteComponentProps } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import buildTree from 'utils/books'
import SubMenu from './SubMenu'
import { IBook } from 'reducers/bookSelector'
import Accordion from 'containers/Shared/Layouts/Protected/Main/Accordion'

/*
 * This component is to be used in the following way:
 * if showBookSelector, the book selector slideout will be included
 * if showSubMenu, a sub menu will be rendered according to the config passed in
 * if no show menu, pass props as children to MainLayout and they will be rendered
 * Note that if showSubMenu is passed, children are ignored
 * 
 * Examples
 * 
 * const config = [ { name: 'Positions', path: `${props.match.url}`, exact: true, component: () => <div>Positions</div> }, ... ]
 * <ProtectedContainer>
 *  showBookSelector
 *  showSubMenu={config}
 * />
 * 
 * OR
 * 
 * <ProtectedContainer>
 *  <div>Child Component 1</div>
 *  <div>Child Component 2</div>
 * </ProtectedContainer>
 */

interface IProtectedContainerProps extends RouteComponentProps<{}> {
  bookSelector: IBook[]
  darkProfile: boolean
  showBookSelector?: boolean
  subMenu?: ISubMenuConfig[]
}

export interface ISubMenuConfig {
  name: JSX.Element
  path: string
  exact?: boolean
  component?: React.ComponentType
  render?: any
  visible?: boolean
}

interface IProtectedContainerState {
  bookSelectorVisible: boolean
}

class ProtectedContainer extends React.Component<
  IProtectedContainerProps,
  IProtectedContainerState
> {
  constructor() {
    super()
    this.state = {
      bookSelectorVisible: false
    }
  }

  handleToggleBookSelector() {
    this.setState({
      bookSelectorVisible: !this.state.bookSelectorVisible
    })
  }

  render() {
    const { bookSelectorVisible: visible } = this.state
    const {
      bookSelector,
      darkProfile,
      showBookSelector,
      subMenu,
      children,
      ...rest
    } = this.props
    return (
      <div className="div-height-fill">
        {showBookSelector ? (
          <Sidebar.Pushable as={Segment} basic inverted={darkProfile}>
            <Accordion options={buildTree(bookSelector)} visible={visible} />
            <Sidebar.Pusher>
              <div>
                <div className="book-selector-btn-container">
                  <Button
                    className="book-selector-btn"
                    size="mini"
                    color="green"
                    icon={visible ? 'angle left' : 'angle right'}
                    onClick={() => this.handleToggleBookSelector()}
                  />
                </div>
                <div
                  className={`sub-menu-container with-book-selector div-height-fill ${darkProfile
                    ? 'dark'
                    : ''}`}
                >
                  {subMenu ? (
                    <div>
                      {children}
                      <SubMenu {...rest} subMenu={subMenu} />
                      {subMenu.map((config: ISubMenuConfig, i: number) => {
                        const { name, ...rest } = config
                        return <Route key={i} {...rest} />
                      })}
                    </div>
                  ) : (
                    children
                  )}
                </div>
              </div>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        ) : (
          <div
            className={`sub-menu-container div-height-fill ${darkProfile
              ? 'dark'
              : ''}`}
          >
            {subMenu ? (
              <Segment
                className="sub-menu-segment"
                basic
                inverted={darkProfile}
              >
                {children}
                <SubMenu {...rest} subMenu={subMenu} />
                {subMenu.map((config: ISubMenuConfig, i: number) => {
                  const { name, ...rest } = config
                  return <Route key={i} {...rest} />
                })}
              </Segment>
            ) : (
              children
            )}
          </div>
        )}
      </div>
    )
  }
}

export default ProtectedContainer

import React from 'react'
import { Icon } from 'semantic-ui-react'

export default ({ isExpanded, darkProfile }: { isExpanded: boolean, darkProfile: boolean }) => {
  return <Icon name={isExpanded ? 'angle down' : 'angle right'} />
}
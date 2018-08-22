import React from 'react'
import { Input } from 'semantic-ui-react'

import './FilterComponent.scss'

export default (props: { onChange: Function; darkProfile: boolean }) => {
  return (
    <div className={props.darkProfile ? 'agmi-grid-filter-input-dark' : ''}>
      <Input
        fluid
        transparent={props.darkProfile}
        size="mini"
        onChange={(e: any, { value }: any) => {
          props.onChange(value)
        }}
      />
    </div>
  )
}

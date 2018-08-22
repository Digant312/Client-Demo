import React from 'react'

export default (props: any) => (
  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', ...props.style }}>
    {props.value}
  </div>
)

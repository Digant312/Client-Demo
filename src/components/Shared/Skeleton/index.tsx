import React from 'react'

import './styles.scss'

const ParaLoader = ({ size = '', fluid = false }: { size?: 'mini' | 'small' | 'large' | 'big' | 'huge' | 'massive', fluid?: boolean }) => (
  <div className={`para-loader agmi ${size} ${fluid ? 'fluid' : ''}`} />
)

export default ParaLoader
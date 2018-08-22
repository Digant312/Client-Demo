import React from 'react'
import { transactions } from '@amaas/amaas-core-sdk-js'

interface IPositionProps {
  position: transactions.Position
}

const Position = (props: IPositionProps) => {
  const renderPosition = (position: any): any => {
    return Object.keys(position).map((key, i) => {
      if (position[key].toFixed) return <li key={i}>{`${key}: ${position[key].toFixed()}`}</li>
      return <li key={i}>{`${key}: ${position[key]}`}</li>
    })
  }
  return <div>
    {renderPosition(props.position)}
  </div>
}

export default Position
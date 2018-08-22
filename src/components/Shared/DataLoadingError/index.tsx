import React from 'react'
import { Button, Message } from 'semantic-ui-react'

import './styles.scss'

interface IDataLoadingErrorProps {
  message: string
  refetchFunction?: (e?: any, data?: any) => void
}

export default (props: IDataLoadingErrorProps) => {
  const { message, refetchFunction } = props
  return (
    <div className="data-load-error-container">
      <Message compact error size="tiny">
        {message}
        <div style={{ height: '10px' }} />
        {refetchFunction ? (
          <div className="data-load-error-retry">
            <Button basic compact size="tiny" onClick={refetchFunction}>
              Retry
            </Button>
          </div>
        ) : null}
      </Message>
    </div>
  )
}

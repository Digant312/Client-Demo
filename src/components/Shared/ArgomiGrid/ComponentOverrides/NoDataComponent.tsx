import React from 'react'
import { Message, Segment } from 'semantic-ui-react'
import { defineMessages, FormattedMessage } from 'react-intl'

const messages = defineMessages({
  noDataMessage: {
    id: 'argomiGridCustom.noDataMessage',
    defaultMessage: 'No data found'
  }
})

export default () => (
  <div className="rt-noData">
    <Segment>
      <FormattedMessage {...messages.noDataMessage} />
    </Segment>
  </div>
)

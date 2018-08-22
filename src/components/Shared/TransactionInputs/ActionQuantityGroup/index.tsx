import React from 'react'
import { Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { Form } from 'semantic-ui-react'

import Dropdown from 'containers/Shared/Dropdown'
import Input from 'containers/Shared/CompactInput'
import { normaliseCurrency } from 'utils/form'

interface ITransactionActionQuantityGroupProps {
  fieldLabel?: string
  readOnly?: boolean
  actionOptions?: { key?: string; value: string; text: string }[]
}
interface ITransactionActionQuantityGroupState {
  transactionActionActive: boolean
}

const transActionOptions = [
  { key: 'buy', value: 'Buy', text: 'Buy' },
  { key: 'sell', value: 'Sell', text: 'Sell' },
  { key: 'shortsell', value: 'Short Sell', text: 'Short Sell' },
  { key: 'shortcover', value: 'Short Cover', text: 'Short Cover' }
  // { key: 'deliver', value: 'Deliver', text: 'Deliver' },
  // { key: 'receive', value: 'Receive', text: 'Receive' },
  // { key: 'subscription', value: 'Subscription', text: 'Subscription' },
  // { key: 'redemption', value: 'Redemption', text: 'Redemption' },
  // { key: 'acquire', value: 'Acquire', text: 'Acquire' },
  // { key: 'remove', value: 'Remove', text: 'Remove' }
]

export default class TransactionActionQuantityGroup extends React.Component<
  ITransactionActionQuantityGroupProps,
  ITransactionActionQuantityGroupState
> {
  constructor() {
    super()
    this.state = {
      transactionActionActive: false
    }
  }

  handleToggleAction(transactionActionActive: boolean) {
    this.setState({ transactionActionActive })
  }

  render() {
    const { actionOptions, fieldLabel, readOnly } = this.props
    const { transactionActionActive } = this.state

    return (
      <div className="column-inner-row">
        <div className="column-inner-column">
          <p>
            {fieldLabel || (
              <FormattedMessage
                id="actionQuantityGroupDefaultLabel"
                defaultMessage="Quantity"
              />
            )}
          </p>
        </div>
        <div className="column-inner-column">
          <Form.Group style={{ margin: '0' }}>
            <div style={readOnly ? {} : { minWidth: '70px' }}>
              <Field
                name="transactionAction"
                compact={!transactionActionActive}
                component={Dropdown}
                options={actionOptions || transActionOptions}
                normal
                readOnly={readOnly}
                onOpen={() => this.handleToggleAction(true)}
                onClose={() => this.handleToggleAction(false)}
              />
            </div>
            <div
              style={{
                flex: '1',
                marginLeft: readOnly ? '' : '5px'
              }}
            >
              <Field
                name="quantity"
                component={Input}
                format={normaliseCurrency}
                normal
                readOnly={readOnly}
              />
            </div>
          </Form.Group>
        </div>
      </div>
    )
  }
}

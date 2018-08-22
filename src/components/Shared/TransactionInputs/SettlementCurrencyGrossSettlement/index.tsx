import React from 'react'
import { Field } from 'redux-form'
import { Form } from 'semantic-ui-react'

import CurrencyDropdown from 'containers/Shared/CurrencyDropdown'
import Input from 'containers/Shared/CompactInput'
import { normaliseCurrency } from 'utils/form'

interface ISettlementCurrencyGrossSettlementGroupProps {
  fieldLabel?: string
  readOnly?: boolean
}

interface ISettlementCurrencyGrossSettlementGroupState {
  currencyDropdownOpen: boolean
}

export default class SettlementCurrencyGrossSettlement extends React.Component<
  ISettlementCurrencyGrossSettlementGroupProps,
  ISettlementCurrencyGrossSettlementGroupState
> {
  constructor() {
    super()
    this.state = {
      currencyDropdownOpen: false
    }

    this.handleToggleCurrencyDropdown = this.handleToggleCurrencyDropdown.bind(
      this
    )
  }

  handleToggleCurrencyDropdown(currencyDropdownOpen: boolean) {
    this.setState({ currencyDropdownOpen })
  }

  render() {
    const { fieldLabel, readOnly } = this.props
    const { currencyDropdownOpen } = this.state

    return (
      <div className="column-inner-row">
        <div className="column-inner-column">
          <p>{fieldLabel || 'Gross Settlement'}</p>
        </div>
        <div className="column-inner-column">
          <Form.Group style={{ margin: '0' }}>
            <Field
              name="settlementCurrency"
              component={CurrencyDropdown}
              compact={!currencyDropdownOpen}
              placeholder="Ccy"
              onOpen={() => this.handleToggleCurrencyDropdown(true)}
              onClose={() => this.handleToggleCurrencyDropdown(false)}
              readOnly={readOnly}
            />
            <div style={{ flex: '1', marginLeft: readOnly ? '' : '5px' }}>
              <Field
                name="grossSettlement"
                component={Input}
                normal
                format={normaliseCurrency}
                readOnly={readOnly}
              />
            </div>
          </Form.Group>
        </div>
      </div>
    )
  }
}

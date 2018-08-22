import React from 'react'
import { Field } from 'redux-form'

import Dropdown from 'containers/Shared/Dropdown'

interface ICashTransactionTypeInputProps {
  fieldLabel?: string
  readOnly?: boolean
}

const cashTransTypeOption = [
  { key: 'cashflow', value: 'Cashflow', text: 'Cashflow' },
  { key: 'coupon', value: 'Coupon', text: 'Coupon' },
  { key: 'dividend', value: 'Dividend', text: 'Dividend' },
  { key: 'payment', value: 'Payment', text: 'Payment' }
]

export default (props: ICashTransactionTypeInputProps) => {
  const { fieldLabel, readOnly } = props

  return (
    <div className="column-inner-row">
      <div className="column-inner-column">
        <p>{fieldLabel || 'Transaction Type'}</p>
      </div>
      <div className="column-inner-column">
        <Field
          name="transactionType"
          component={Dropdown}
          normal
          options={cashTransTypeOption}
          readOnly={readOnly}
        />
      </div>
    </div>
  )
}

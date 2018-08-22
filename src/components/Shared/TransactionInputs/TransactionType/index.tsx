import React from 'react'
import { Field } from 'redux-form'

import Dropdown from 'containers/Shared/Dropdown'

interface ITransactionTypeInputProps {
  fieldLabel?: string
  readOnly?: boolean
}

const transTypeOptions = [
  { key: 'allocation', value: 'Allocation', text: 'Allocation' },
  { key: 'block', value: 'Block', text: 'Block' },
  { key: 'cashflow', value: 'Cashflow', text: 'Cashflow' },
  { key: 'coupon', value: 'Coupon', text: 'Coupon' },
  { key: 'dividend', value: 'Dividend', text: 'Dividend' },
  { key: 'exercise', value: 'Exercise', text: 'Exercise' },
  { key: 'expiry', value: 'Expiry', text: 'Expiry' },
  { key: 'payment', value: 'Payment', text: 'Payment' },
  { key: 'journal', value: 'Journal', text: 'Journal' },
  { key: 'maturity', value: 'Maturity', text: 'Maturity' },
  { key: 'net', value: 'Net', text: 'Net' },
  { key: 'novation', value: 'Novation', text: 'Novation' },
  { key: 'split', value: 'Split', text: 'Split' },
  { key: 'trade', value: 'Trade', text: 'Trade' },
  { key: 'transfer', value: 'Transfer', text: 'Transfer' }
]

export default (props: ITransactionTypeInputProps) => {
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
          options={transTypeOptions}
          readOnly={readOnly}
        />
      </div>
    </div>
  )
}

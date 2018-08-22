import React from 'react'
import { Field } from 'redux-form'

import Input from 'containers/Shared/CompactInput'
import { normaliseCurrency } from 'utils/form'

interface INetSettlementProps {
  fieldLabel?: string
  readOnly?: boolean
  currencyLabel?: string
}

export default (props: INetSettlementProps) => {
  const { currencyLabel, fieldLabel, readOnly } = props

  return (
    <div className="column-inner-row">
      <div className="column-inner-column">
        <p>{fieldLabel || 'Net Settlement'}</p>
      </div>
      <div className="column-inner-column">
        <Field
          name="netSettlement"
          component={Input}
          normal
          format={normaliseCurrency}
          label={currencyLabel}
          readOnly={readOnly}
        />
      </div>
    </div>
  )
}

import React from 'react'
import { Field } from 'redux-form'

import Input from 'containers/Shared/CompactInput'
import { normaliseCurrency } from 'utils/form'

interface IPriceInputProps {
  fieldLabel?: string
  readOnly?: boolean
  currencyLabel?: string
}

export default (props: IPriceInputProps) => {
  const { currencyLabel, fieldLabel, readOnly } = props
  return (
    <div className="column-inner-row">
      <div className="column-inner-column">
        <p>{fieldLabel || 'Price'}</p>
      </div>
      <div className="column-inner-column">
        <Field
          name="price"
          component={Input}
          format={normaliseCurrency}
          normal
          label={currencyLabel || undefined}
          readOnly={readOnly}
        />
      </div>
    </div>
  )
}

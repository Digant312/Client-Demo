import React from 'react'
import { FieldArray } from 'redux-form'

import ChildFields from 'containers/Shared/FormChildFields'

interface ITransactionRatesProps {
  fieldLabel?: string
  readOnly?: boolean
}

export default (props: ITransactionRatesProps) => {
  const { fieldLabel, readOnly } = props

  return (
    <span>
      <div className="column-inner-row">
        <div className="column-inner-column">
          <h4>{fieldLabel || 'Rates'}</h4>
        </div>
      </div>
      <FieldArray
        name="rates"
        component={ChildFields}
        type="Rate"
        valueKey="rateValue"
        readOnly={readOnly}
      />
    </span>
  )
}

import React from 'react'
import { Field } from 'redux-form'

import DateInput from 'containers/Shared/DateInput'
import { formatDate } from 'utils/form'

interface ISettlementDateInputProps {
  fieldLabel?: string
  dateFormat: string
  readOnly?: boolean
}

export default (props: ISettlementDateInputProps) => {
  const { dateFormat, fieldLabel, readOnly } = props

  return (
    <div className="column-inner-row">
      <div className="column-inner-column">
        <p>{fieldLabel || 'Fixing Date'}</p>
      </div>
      <div className="column-inner-column">
        <Field name="fixingDate" component={DateInput} readOnly={readOnly} />
      </div>
    </div>
  )
}

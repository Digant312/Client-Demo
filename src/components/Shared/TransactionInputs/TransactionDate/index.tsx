import React from 'react'
import { Field } from 'redux-form'

// import Input from 'containers/Shared/CompactInput'
import DateInput from 'containers/Shared/DateInput'
import { formatDate } from 'utils/form'

interface ITransactionDateProps {
  fieldLabel?: string
  dateFormat: string
  readOnly?: boolean
}

export default (props: ITransactionDateProps) => {
  const { dateFormat, fieldLabel, readOnly } = props
  return (
    <div className="column-inner-row">
      <div className="column-inner-column">
        <p>{fieldLabel || 'Transaction Date'}</p>
      </div>
      <div className="column-inner-column">
        <Field
          name="transactionDate"
          component={DateInput}
          readOnly={readOnly}
        />
      </div>
    </div>
  )
}

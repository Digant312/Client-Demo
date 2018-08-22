import React from 'react'
import { FieldArray } from 'redux-form'

import ChildFields from 'containers/Shared/FormChildFields'

interface ITransactionPartiesProps {
  fieldLabel?: string
  readOnly?: boolean
}

export default (props: ITransactionPartiesProps) => {
  const { fieldLabel, readOnly } = props

  return (
    <span>
      <div className="column-inner-row">
        <div className="column-inner-column">
          <h4>{fieldLabel || 'Parties'}</h4>
        </div>
      </div>
      <FieldArray
        name="parties"
        component={ChildFields}
        type="Party"
        valueKey="partyId"
        readOnly={readOnly}
      />
    </span>
  )
}

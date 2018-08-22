import React from 'react'
import { FieldArray } from 'redux-form'

import ChildFields from 'containers/Shared/FormChildFields'

interface ITransactionReferencesProps {
  fieldLabel?: string
  readOnly?: boolean
}

export default (props: ITransactionReferencesProps) => {
  const { fieldLabel, readOnly } = props

  return (
    <span>
      <div className="column-inner-row">
        <div className="column-inner-column">
          <h4>{fieldLabel || 'References'}</h4>
        </div>
      </div>
      <FieldArray
        name="references"
        component={ChildFields}
        type="Reference"
        valueKey="referenceValue"
        readOnly={readOnly}
      />
    </span>
  )
}

import React from 'react'
import { FieldArray } from 'redux-form'

import ChildFields from 'containers/Shared/FormChildFields'

interface ITransactionCodesProps {
  fieldLabel?: string
  readOnly?: boolean
}

export default (props: ITransactionCodesProps) => {
  const { fieldLabel, readOnly } = props

  return (
    <span>
      <div className="column-inner-row">
        <div className="column-inner-column">
          <h4>{fieldLabel || 'Codes'}</h4>
        </div>
      </div>
      <FieldArray
        name="codes"
        component={ChildFields}
        type="Code"
        valueKey="codeValue"
        readOnly={readOnly}
      />
    </span>
  )
}

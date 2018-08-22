import React from 'react'
import { FieldArray } from 'redux-form'

import ChildFields from 'containers/Shared/FormChildFields'

interface ITransactionCommentsProps {
  fieldLabel?: string
  readOnly?: boolean
}

export default (props: ITransactionCommentsProps) => {
  const { fieldLabel, readOnly } = props

  return (
    <span>
      <div className="column-inner-row">
        <div className="column-inner-column">
          <h4>{fieldLabel || 'Comments'}</h4>
        </div>
      </div>
      <FieldArray
        name="comments"
        component={ChildFields}
        type="Comment"
        valueKey="commentValue"
        readOnly={readOnly}
      />
    </span>
  )
}

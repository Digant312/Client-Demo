import React from 'react'
import { FieldArray } from 'redux-form'

import LinkFields from 'components/Shared/FormLinkFields'

interface ITransactionLinksProps {
  fieldLabel?: string
  readOnly?: boolean
}

export default (props: ITransactionLinksProps) => {
  const { fieldLabel, readOnly } = props

  return (
    <span>
      <div className="column-inner-row">
        <div className="column-inner-column">
          <h4>{fieldLabel || 'Links'}</h4>
        </div>
      </div>
      <FieldArray
        name="links"
        component={LinkFields}
        type="transactions"
        readOnly={readOnly}
      />
    </span>
  )
}

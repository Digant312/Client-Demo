import React from 'react'
import { Field } from 'redux-form'
import { DropdownItemProps } from 'semantic-ui-react'

import Dropdown from 'containers/Shared/Dropdown'
import { required } from 'utils/form'

interface ICounterpartyBookInputProps {
  fieldLabel?: string
  options: DropdownItemProps[]
  readOnly?: boolean
}

export default (props: ICounterpartyBookInputProps) => {
  const { fieldLabel, options, readOnly } = props

  return (
    <div className="column-inner-row">
      <div className="column-inner-column">
        <p>{fieldLabel || 'Counterparty Book ID'}</p>
      </div>
      <div className="column-inner-column">
        <Field
          name="counterpartyBookId"
          component={Dropdown}
          normal
          options={options}
          readOnly={readOnly}
          validate={required}
        />
      </div>
    </div>
  )
}

import React from 'react'
import { FieldArray } from 'redux-form'
import { Label } from 'semantic-ui-react'

import ChildFields from 'containers/Shared/FormChildFields'

interface ITransactionChargesInputProps {
  fieldLabel?: string
  netAffectingLabel?: string
  readOnly?: boolean
  currencyLabel?: string
  darkProfile: boolean
}

export default (props: ITransactionChargesInputProps) => {
  const {
    currencyLabel,
    darkProfile,
    fieldLabel,
    netAffectingLabel,
    readOnly
  } = props

  return (
    <span>
      <div className="column-inner-row">
        <div className="column-inner-column">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <h4 style={{ margin: '0' }}>{fieldLabel || 'Charges'}</h4>
            <Label
              basic={!darkProfile}
              color={darkProfile ? 'black' : 'grey'}
              size="mini"
            >
              {netAffectingLabel || 'Net Affecting'}
            </Label>
          </div>
        </div>
      </div>
      <FieldArray
        name="charges"
        component={ChildFields}
        type="Charge"
        valueKey="chargeValue"
        label={currencyLabel}
        readOnly={readOnly}
      />
    </span>
  )
}

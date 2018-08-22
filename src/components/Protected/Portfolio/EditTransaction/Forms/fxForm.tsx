import React from 'react'

import FXForm from 'components/Protected/Portfolio/EditTransaction/Fields/fx'
import FXFormController from 'containers/Protected/Portfolio/EditTransaction/Controllers/fxFormController'

interface IFXFormProps {
  initialValues: any
  assetType: string
  type: 'New' | 'Edit' | 'ReadOnly'
}

export default (props: IFXFormProps) => {
  const { assetType, initialValues, type } = props
  return (
    <FXFormController
      formName="fxTransactionForm"
      transaction={initialValues}
      type={type}
      assetType={assetType}
      children={FXForm}
    />
  )
}

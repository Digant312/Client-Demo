import React from 'react'

import GenericForm from 'components/Protected/Portfolio/EditTransaction/Fields/generic'
import GenericFormController from 'containers/Protected/Portfolio/EditTransaction/Controllers/genericFormController'

interface IGenericFormProps {
  initialValues: any
  assetType: string
  type: 'New' | 'Edit' | 'ReadOnly'
}

export default (props: IGenericFormProps) => {
  const { assetType, initialValues, type } = props
  return (
    <GenericFormController
      formName="genericTransactionForm"
      transaction={initialValues}
      type={type}
      assetType={assetType}
      children={GenericForm}
    />
  )
}

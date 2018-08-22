import React from 'react'

import EquityForm from 'components/Protected/Portfolio/EditTransaction/Fields/equity'
import EquityFormController from 'containers/Protected/Portfolio/EditTransaction/Controllers/equityFormController'

interface IEquityFormProps {
  initialValues: any
  assetType: string
  type: 'New' | 'Edit' | 'ReadOnly'
}

export default (props: IEquityFormProps) => {
  const { assetType, initialValues, type } = props
  return (
    <EquityFormController
      formName="equityTransactionForm"
      transaction={initialValues}
      type={type}
      assetType={assetType}
      children={EquityForm}
    />
  )
}

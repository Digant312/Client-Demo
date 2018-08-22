import React from 'react'

import CashForm from 'components/Protected/Portfolio/EditTransaction/Fields/cash'
import CashFormController from 'containers/Protected/Portfolio/EditTransaction/Controllers/cashFormController'


interface ICashFormProps {
  initialValues: any
  assetType: string
  type: 'New' | 'Edit' | 'ReadOnly'
}

export default (props: ICashFormProps) => {

  const { assetType, initialValues, type }  = props
  return (
    <CashFormController
      formName="cashTransactionForm"
      transaction={initialValues}
      type={type}
      assetType={assetType}
      children={CashForm}
    />
  )
}

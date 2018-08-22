import React from 'react'

import FutureForm from 'components/Protected/Portfolio/EditTransaction/Fields/future'
import FutureFormController from 'containers/Protected/Portfolio/EditTransaction/Controllers/futureFormController'

interface IEquityFormProps {
  initialValues: any
  assetType: string
  type: 'New' | 'Edit' | 'ReadOnly'
}

export default (props: IEquityFormProps) => {
  const { assetType, initialValues, type } = props
  return (
    <FutureFormController
      formName="futureTransactionForm"
      transaction={initialValues}
      type={type}
      assetType={assetType}
      children={FutureForm}
    />
  )
}

import { connect } from 'react-redux'
import { assets } from '@amaas/amaas-core-sdk-js'

import FutureFormController, {
  IFutureFormControllerProps
} from 'components/Protected/Portfolio/EditTransaction/Controllers/futureFormController'
import {
  fetchAssetForForm,
  fetchTransactionForForm
} from 'actions/data/transactionForm'
import { IState } from 'reducers'
import {
  transactionFormTransactionSelector,
  transactionFormAssetSelector
} from 'selectors'

export interface IMapStateProps {
  pointValue: string
  transactionForForm: any
}

const mapStateToProps = (
  state: IState,
  ownProps: IFutureFormControllerProps
) => {
  const asset = transactionFormAssetSelector(state).asset as assets.Future
  let { pointValue } = asset || { pointValue: 0 }
  if (pointValue.toFixed) {
    pointValue = pointValue.toFixed()
  } else if (pointValue.toString) {
    pointValue = pointValue.toString()
  } else {
    pointValue = '0'
  }
  return {
    pointValue,
    transactionForForm: transactionFormTransactionSelector(state).transaction
  }
}

export default connect(mapStateToProps)(FutureFormController)

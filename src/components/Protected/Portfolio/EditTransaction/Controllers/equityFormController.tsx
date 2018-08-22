import React from 'react'
import { reduxForm, FormProps } from 'redux-form'
import { api, transactions } from '@amaas/amaas-core-sdk-js'

import TransactionFormController from 'containers/Protected/Portfolio/EditTransaction/Controllers'
import { ITransactionFormControllerProps } from 'components/Protected/Portfolio/EditTransaction/Controllers'
import { IMapStateProps } from 'containers/Protected/Portfolio/EditTransaction/Controllers/equityFormController'
import { addOrRemoveChildField } from 'utils/form'

export interface IEquityFormControllerProps {
  formName: string
  transaction: transactions.Transaction
  type: 'Edit' | 'New' | 'ReadOnly'
  assetType: string
  children: any
}

class EquityFormController extends React.Component<
  IEquityFormControllerProps & IMapStateProps & FormProps<{}, {}, {}>
> {
  componentWillReceiveProps(
    nextProps: IEquityFormControllerProps &
      IMapStateProps &
      FormProps<{}, {}, {}>
  ) {
    const assetBookIdChanged = this.props.assetBookId !== nextProps.assetBookId
    const transactionActionChanged =
      this.props.transactionAction !== nextProps.transactionAction
    if (this.props.type === 'New') {
      if (assetBookIdChanged && nextProps.transactionAction === 'Buy') {
        this.updateFundedBy(nextProps.assetBookId, this.props, nextProps)
      } else if (
        transactionActionChanged &&
        nextProps.transactionAction !== 'Buy'
      ) {
        addOrRemoveChildField(this.props, nextProps)('parties')('Funded By')(
          'remove'
        )
      } else if (
        transactionActionChanged &&
        nextProps.transactionAction === 'Buy' &&
        this.props.transactionAction !== 'Buy' &&
        nextProps.assetBookId
      ) {
        this.updateFundedBy(nextProps.assetBookId, this.props, nextProps)
      }
    }
  }

  async updateFundedBy(
    bookId: string,
    thisProps: IEquityFormControllerProps &
      IMapStateProps &
      FormProps<{}, {}, {}>,
    nextProps: IEquityFormControllerProps &
      IMapStateProps &
      FormProps<{}, {}, {}>
  ) {
    const bookData = (await api.Books.retrieve({
      AMId: parseInt(this.props.assumedAMID),
      resourceId: bookId
    })) as any
    const { partyId } = bookData || { partyId: null }
    if (!partyId) return
    addOrRemoveChildField(thisProps, nextProps)('parties')('Funded By')('add', {
      partyId
    })
  }

  render() {
    return <TransactionFormController {...this.props} />
  }
}

export default reduxForm({ form: 'equityTransactionForm' })(
  EquityFormController
)

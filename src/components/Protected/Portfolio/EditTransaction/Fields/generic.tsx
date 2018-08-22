import React from 'react'
import { FormProps } from 'redux-form'
import { Button, Form, Grid, Message, Segment } from 'semantic-ui-react'
import { books, transactions, ITransaction } from '@amaas/amaas-core-sdk-js'
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl'

import ToastContainer from 'components/Shared/ArgomiToastContainer'

/* Inputs */
import TransactionAssetDropdown from 'components/Shared/TransactionInputs/Asset'
import TransactionDateInput from 'containers/Shared/TransactionInputs/TransactionDate'
import ActionQuantityGroup from 'components/Shared/TransactionInputs/ActionQuantityGroup'
import PriceInput from 'components/Shared/TransactionInputs/Price'
import SettlementDateInput from 'containers/Shared/TransactionInputs/SettlementDate'
import AssetBookInput from 'components/Shared/TransactionInputs/AssetBookId'
import CounterpartyBookInput from 'components/Shared/TransactionInputs/CounterpartyBookId'
import TransactionTypeInput from 'components/Shared/TransactionInputs/TransactionType'
import GrossSettlementGroup from 'components/Shared/TransactionInputs/SettlementCurrencyGrossSettlement'
import NetSettlement from 'components/Shared/TransactionInputs/NetSettlement'
import Charges from 'containers/Shared/TransactionInputs/Charges'
import Rates from 'components/Shared/TransactionInputs/Rates'
import Parties from 'components/Shared/TransactionInputs/Parties'
import References from 'components/Shared/TransactionInputs/References'
import Comments from 'components/Shared/TransactionInputs/Comments'
import Codes from 'components/Shared/TransactionInputs/Codes'
import Links from 'components/Shared/TransactionInputs/Links'

import TransactionHeader from 'containers/Protected/Portfolio/EditTransaction/Fields/equityHeader'
import TransactionActions from 'containers/Protected/Portfolio/EditTransaction/Fields/transactionActionSegment'
import formMessages from './strings'

interface ITransactionProps {
  formName: string
  dateFormat: string
  assumedAMID: string
  fetchTransactions: Function
  darkProfile: boolean
  books: books.Book[]
  transaction: transactions.Transaction
  type: 'Edit' | 'New' | 'ReadOnly'
  assetId: string
  grossSettlement: number
  netSettlement: number
  quantity: number
  price: number
  counterpartyBookId: string
  charges: any[]
  parties: any[]
  settlementCurrency: string
  onFormAction: Function
  transactionCurrency?: string
  formActionWorking?: boolean
  formActionError: string
  fetchingTransactionForForm: boolean
  fetchTransactionError: string
}

class Transaction extends React.Component<
  ITransactionProps &
    FormProps<
      ITransaction & {
        grossSettlement: string | number
        netSettlement: string | number
      },
      {},
      {}
    > &
    InjectedIntlProps
> {
  constructor(
    props: ITransactionProps &
      FormProps<
        ITransaction & {
          grossSettlement: string | number
          netSettlement: string | number
        },
        {},
        {}
      > &
      InjectedIntlProps
  ) {
    super(props)
  }

  childArrayToObject(coll: any[]) {
    return coll.reduce((arr: any, curr: any) => {
      const { name, ...rest } = curr
      arr[name] = rest
      return arr
    }, {})
  }

  childLinksToObject(coll: any[]) {
    return coll.reduce((arr: any, curr: any) => {
      const { name, ...rest } = curr
      arr[name] = rest.links
      return arr
    }, {})
  }

  handleFormAction(transaction: any) {
    switch (this.props.type) {
      case 'New':
        this.props.onFormAction({
          formName: this.props.formName,
          actionType: 'insert',
          transaction
        })
        break
      case 'Edit':
        this.props.onFormAction({
          actionType: 'amend',
          transactionId: transaction.transactionId,
          transaction
        })
        break
      default:
        return
    }
  }

  handleCancelTrans(id: string) {
    this.props.onFormAction({ actionType: 'cancel', transactionId: id })
  }

  bookToOptions(book: books.Book) {
    return { key: book.bookId, value: book.bookId, text: book.bookId }
  }

  getFormattedMessage(type: string) {
    switch (type) {
      case 'New':
        return formMessages.newGenericTransaction
      case 'Edit':
        return formMessages.editGenericTransaction
      case 'ReadOnly':
      default:
        return formMessages.readOnlyGenericTransaction
    }
  }

  render() {
    const {
      darkProfile,
      books,
      formActionWorking,
      formActionError,
      handleSubmit,
      transactionCurrency,
      settlementCurrency,
      fetchingTransactionForForm,
      transaction,
      fetchTransactionError,
      type
    } = this.props
    const counterPartyBookIdOptions = books
      .filter(
        book =>
          (book.bookType === 'Counterparty' || book.bookType === 'Wash') &&
          book.bookStatus === 'Active'
      )
      .map(this.bookToOptions)
    const assetBookIdOptions = books
      .filter(
        book =>
          book.bookType !== 'Counterparty' &&
          book.bookType !== 'Wash' &&
          book.bookStatus === 'Active'
      )
      .map(this.bookToOptions)
    const isReadOnly = type === 'ReadOnly'
    return (
      <div className="edit-transaction-container" style={{ padding: '20px' }}>
        <ToastContainer />
        <Segment.Group size="tiny">
          <Segment inverted={darkProfile}>
            <h3>
              <FormattedMessage {...this.getFormattedMessage(type)} />
            </h3>
          </Segment>

          <TransactionHeader />

          {fetchTransactionError ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px'
              }}
            >
              <Message compact error size="tiny">
                {fetchTransactionError}
              </Message>
            </div>
          ) : (
            <Segment
              inverted={darkProfile}
              loading={fetchingTransactionForForm}
            >
              <div className="edit-transaction-detail">
                <Form size="tiny" inverted={darkProfile}>
                  <Grid columns={4} divided>
                    <Grid.Row>
                      {/* Column 1 */}
                      <Grid.Column>
                        <TransactionDateInput readOnly={isReadOnly} />

                        <TransactionAssetDropdown
                          queryFilter={{}}
                          readOnly={isReadOnly}
                        />

                        <ActionQuantityGroup readOnly={isReadOnly} />

                        <PriceInput
                          readOnly={isReadOnly}
                          currencyLabel={transactionCurrency}
                        />

                        <AssetBookInput
                          readOnly={isReadOnly}
                          options={assetBookIdOptions}
                        />

                        <CounterpartyBookInput
                          readOnly={isReadOnly}
                          options={counterPartyBookIdOptions}
                        />
                        {type === 'Edit' ? (
                          <TransactionTypeInput readOnly={isReadOnly} />
                        ) : null}

                        <GrossSettlementGroup readOnly={isReadOnly} />

                        <NetSettlement
                          readOnly={isReadOnly}
                          currencyLabel={settlementCurrency}
                        />
                      </Grid.Column>
                      {/* Column 2 */}
                      <Grid.Column>
                        <SettlementDateInput readOnly={isReadOnly} />

                        <Charges
                          readOnly={isReadOnly}
                          currencyLabel={settlementCurrency}
                        />

                        <Rates readOnly={isReadOnly} />
                      </Grid.Column>
                      {/* Column 3 */}
                      <Grid.Column>
                        <Parties readOnly={isReadOnly} />

                        <References readOnly={isReadOnly} />

                        <Comments readOnly={isReadOnly} />
                      </Grid.Column>
                      {/* Column 4 */}
                      <Grid.Column>
                        <Codes readOnly={isReadOnly} />

                        <Links readOnly={isReadOnly} />
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row />
                  </Grid>
                </Form>
              </div>
            </Segment>
          )}
          {type === 'ReadOnly' ? null : (
            <TransactionActions
              formActionInProgress={formActionWorking}
              pristine={this.props.pristine}
              submitLabel={this.props.intl.formatMessage(
                formMessages.saveLabel
              )}
              type={type}
              handleCancel={e => {
                e.preventDefault()
                this.handleCancelTrans(transaction.transactionId as string)
              }}
              handleSubmit={
                handleSubmit
                  ? handleSubmit(data => {
                      this.handleFormAction(data)
                    })
                  : () => null
              }
            />
          )}
        </Segment.Group>
      </div>
    )
  }
}

export default injectIntl(Transaction)

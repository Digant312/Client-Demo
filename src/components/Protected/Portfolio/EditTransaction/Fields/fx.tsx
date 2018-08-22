import React from 'react'
import { Field, FormProps } from 'redux-form'
import { Button, Form, Grid, Label, Segment } from 'semantic-ui-react'
import { books, transactions, ITransaction } from '@amaas/amaas-core-sdk-js'
import {
  defineMessages,
  FormattedMessage,
  injectIntl,
  InjectedIntlProps
} from 'react-intl'

import ToastContainer from 'components/Shared/ArgomiToastContainer'
import Dropdown from 'containers/Shared/Dropdown'

/* Inputs */
import TransactionAssetDropdown from 'components/Shared/TransactionInputs/Asset'
import TransactionDateInput from 'containers/Shared/TransactionInputs/TransactionDate'
import ActionQuantityGroup from 'components/Shared/TransactionInputs/ActionQuantityGroup'
import PriceInput from 'components/Shared/TransactionInputs/Price'
import SettlementDateInput from 'containers/Shared/TransactionInputs/SettlementDate'
import FixingDateInput from 'containers/Shared/TransactionInputs/FixingDate'
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
  spotOrForward: 'ForeignExchangeSpot' | 'ForeignExchangeForward'
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
  deliverable: boolean
  onFormAction: Function
  transactionCurrency?: string
  formActionWorking?: boolean
  formActionError: string
  fetchingTransactionForForm: boolean
  fetchTransactionError: string
  handleFormAction: Function
}

const fxTypeOptions = [
  { value: 'ForeignExchangeSpot', text: 'Spot' },
  { value: 'ForeignExchangeForward', text: 'Forward' }
]

const fxActionOptions = [
  { key: 'buy', value: 'Buy', text: 'Buy' },
  { key: 'sell', value: 'Sell', text: 'Sell' }
]

const messages = defineMessages({
  currencyPair: {
    id: 'fxForm.currencyPairLabel',
    defaultMessage: 'Currency Pair'
  },
  amount: {
    id: 'fxForm.amountLabel',
    defaultMessage: 'Amount'
  },
  forwardRate: {
    id: 'fxForm.forwardRate',
    defaultMessage: 'Forward Rate'
  },
  valueDate: {
    id: 'fxForm.valueDateLabel',
    defaultMessage: 'Value Date'
  },
  fixingDate: {
    id: 'fxForm.fixingDateLabel',
    defaultMessage: 'Fixing Date'
  }
})

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
    this.handleFormAction = this.handleFormAction.bind(this)
    this.getPriceLabel = this.getPriceLabel.bind(this)
  }

  handleFormAction(transaction: any) {
    switch (this.props.type) {
      case 'New':
        this.props.handleFormAction({
          formName: this.props.formName,
          actionType: 'insert',
          transaction
        })
        break
      case 'Edit':
        this.props.handleFormAction({
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
    this.props.handleFormAction({
      actionType: 'cancel',
      transactionId: id
    })
  }

  bookToOptions(book: books.Book) {
    return { key: book.bookId, value: book.bookId, text: book.bookId }
  }

  getPriceLabel(type: string) {
    switch (type) {
      case 'ForeignExchangeForward':
        return this.props.intl.formatMessage(messages.forwardRate)
      case 'ForeignExchangeSpot':
      default:
        return undefined
    }
  }

  getFormattedMessage(type: string) {
    switch (type) {
      case 'New':
        return formMessages.newFXTransaction
      case 'Edit':
        return formMessages.editFXTransaction
      case 'ReadOnly':
      default:
        return formMessages.readOnlyFXTransaction
    }
  }

  render() {
    const {
      spotOrForward,
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
      type,
      deliverable
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
    const showFixingDate =
      deliverable === false && spotOrForward === 'ForeignExchangeForward'
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

          <Segment inverted={darkProfile} loading={fetchingTransactionForForm}>
            <div className="edit-transaction-detail">
              <Form size="tiny" inverted={darkProfile}>
                <Grid columns={4} divided>
                  <Grid.Row>
                    {/* Column 1 */}
                    <Grid.Column>
                      <div className="column-inner-row">
                        <div className="column-inner-column">
                          <p>Spot/Forward</p>
                        </div>
                        <div className="column-inner-column">
                          <Field
                            name="spotOrForward"
                            component={Dropdown}
                            normal
                            readOnly={isReadOnly}
                            options={fxTypeOptions}
                          />
                        </div>
                      </div>

                      <TransactionDateInput readOnly={isReadOnly} />

                      <TransactionAssetDropdown
                        name="assetPrimaryReference"
                        fieldLabel={this.props.intl.formatMessage(
                          messages.currencyPair
                        )}
                        queryFilter={{ assetType: 'ForeignExchange' }}
                        initialAssetId={transaction.assetId}
                        readOnly={isReadOnly}
                      />

                      <ActionQuantityGroup
                        fieldLabel={this.props.intl.formatMessage(
                          messages.amount
                        )}
                        readOnly={isReadOnly}
                        actionOptions={fxActionOptions}
                      />

                      <PriceInput
                        readOnly={isReadOnly}
                        fieldLabel={this.getPriceLabel(spotOrForward)}
                      />

                      <SettlementDateInput
                        fieldLabel={this.props.intl.formatMessage(
                          messages.valueDate
                        )}
                        readOnly={isReadOnly}
                      />

                      {showFixingDate ? (
                        <FixingDateInput
                          fieldLabel={this.props.intl.formatMessage(
                            messages.fixingDate
                          )}
                          readOnly={isReadOnly}
                        />
                      ) : null}

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
                    </Grid.Column>
                    {/* Column 2 */}
                    <Grid.Column>
                      <NetSettlement
                        readOnly={isReadOnly}
                        currencyLabel={settlementCurrency}
                      />

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

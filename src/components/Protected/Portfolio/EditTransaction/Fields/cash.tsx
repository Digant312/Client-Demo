import React from 'react'
import { FormProps } from 'redux-form'
import messages from './strings'
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl'
import { Form, Grid, Message, Segment } from 'semantic-ui-react'
import ToastContainer from 'components/Shared/ArgomiToastContainer'
import CashTransactionHeader from 'containers/Protected/Portfolio/EditTransaction/Fields/cashHeader'
import { books, transactions, ITransaction } from '@amaas/amaas-core-sdk-js'

/* Column 1 */
import TransactionDateInput from 'containers/Shared/TransactionInputs/TransactionDate'
import TransactionAssetDropdown from 'components/Shared/TransactionInputs/Asset'
import CounterpartyBookInput from 'components/Shared/TransactionInputs/CounterpartyBookId'
import ActionQuantityGroup from 'components/Shared/TransactionInputs/ActionQuantityGroup'
import AssetBookInput from 'components/Shared/TransactionInputs/AssetBookId'
import GrossSettlementGroup from 'components/Shared/TransactionInputs/SettlementCurrencyGrossSettlement'
import NetSettlement from 'components/Shared/TransactionInputs/NetSettlement'
import CashTransactionTypeInput from 'components/Shared/TransactionInputs/CashTransactionType'

/* Column 2 */
import SettlementDateInput from 'containers/Shared/TransactionInputs/SettlementDate'
import Charges from 'containers/Shared/TransactionInputs/Charges'

/* Column 3 */
import Parties from 'components/Shared/TransactionInputs/Parties'
import References from 'components/Shared/TransactionInputs/References'
import Comments from 'components/Shared/TransactionInputs/Comments'

/* Column 4 */
import Codes from 'components/Shared/TransactionInputs/Codes'
import Links from 'components/Shared/TransactionInputs/Links'

/* Actions */
import TransactionActions from 'containers/Protected/Portfolio/EditTransaction/Fields/transactionActionSegment'

interface ITransactionProps {
  formName: string
  type: 'Edit' | 'New' | 'ReadOnly'
  fetchingTransactionForForm: boolean
  fetchTransactionError: string
  darkProfile: boolean
  books: books.Book[]
  settlementCurrency: string
  formActionWorking?: boolean
  formActionError: string
  onFormAction: Function
  transaction: transactions.CashTransaction
  transactionCurrency?: string
}

const cashTransActionOptions = [
  { key: 'deliver', value: 'Deliver', text: 'Deliver' },
  { key: 'receive', value: 'Receive', text: 'Receive' }
]

class CashTransaction extends React.Component<
  ITransactionProps & FormProps<{}, {}, {}> & InjectedIntlProps
> {
  constructor(
    props: ITransactionProps & FormProps<{}, {}, {}> & InjectedIntlProps
  ) {
    super(props)
  }

  getFormattedMessage(type: string) {
    switch (type) {
      case 'New':
        return messages.newCashTransaction
      case 'Edit':
        return messages.editCashTransaction
      case 'ReadOnly':
      default:
        return messages.readOnlyCashTransaction
    }
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

  render() {
    const {
      type,
      fetchTransactionError,
      darkProfile,
      fetchingTransactionForForm,
      books,
      settlementCurrency,
      formActionWorking,
      formActionError,
      handleSubmit,
      transaction,
      transactionCurrency
    } = this.props
    const counterPartyBookIdOptions = books
      .filter(
        book =>
          (book.bookType === 'Counterparty' || book.bookType === 'Wash') &&
          book.bookStatus === 'Active'
      )
      .map(this.bookToOptions)
    const isReadOnly = type === 'ReadOnly'
    const assetBookIdOptions = books
      .filter(
        book =>
          book.bookType !== 'Counterparty' &&
          book.bookType !== 'Wash' &&
          book.bookStatus === 'Active'
      )
      .map(this.bookToOptions)
    return (
      <div className="edit-transaction-container" style={{ padding: '20px' }}>
        <ToastContainer />
        <Segment.Group size="tiny">
          <Segment inverted={darkProfile}>
            <h3>
              <FormattedMessage {...this.getFormattedMessage(type)} />
            </h3>
          </Segment>

          <CashTransactionHeader />

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
                          queryFilter={{ assetType: ['Currency'] }}
                          readOnly={isReadOnly}
                        />

                        <ActionQuantityGroup
                          readOnly={isReadOnly}
                          actionOptions={cashTransActionOptions}
                        />

                        <CashTransactionTypeInput readOnly={isReadOnly} />

                        <AssetBookInput
                          readOnly={isReadOnly}
                          options={assetBookIdOptions}
                        />

                        <CounterpartyBookInput
                          readOnly={isReadOnly}
                          options={counterPartyBookIdOptions}
                        />

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
                  </Grid>
                </Form>
              </div>
            </Segment>
          )}
          {type === 'ReadOnly' ? null : (
            <TransactionActions
              formActionInProgress={formActionWorking}
              pristine={this.props.pristine}
              submitLabel={this.props.intl.formatMessage(messages.saveLabel)}
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

export default injectIntl(CashTransaction)

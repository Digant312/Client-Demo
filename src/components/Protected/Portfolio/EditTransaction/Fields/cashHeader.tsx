import React from 'react'
import { defineMessages, injectIntl, InjectedIntlProps } from 'react-intl'
import { Grid, Message, Segment } from 'semantic-ui-react'
import { assets, transactions } from '@amaas/amaas-core-sdk-js'
import { getTimeZone } from './helper'
import moment, { Moment } from 'moment'
import { messages } from './equityHeader'

interface ITransactionHeaderProps {
  darkProfile: boolean
  fetchingAsset: boolean
  fetchingTransaction: boolean
  headerFieldConfig: {
    label: string
    value: string | number
  }[][]
  asset: assets.AssetClassTypes & { assetType: string }
  fetchAssetError: string
  transaction: transactions.CashTransaction & { createdTime: Moment, updatedTime: Moment, executionTime: Moment }
  dateFormat: string
}

export default injectIntl(
  (props: ITransactionHeaderProps & InjectedIntlProps) => {
    const {
      asset: assetProp,
      transaction: transactionProp,
      darkProfile,
      headerFieldConfig,
      fetchingAsset,
      fetchAssetError,
      fetchingTransaction,
      intl: { formatMessage },
      dateFormat
    } = props
    const asset = assetProp || {}
    const transaction = transactionProp || {}
    const localTimeZone = getTimeZone()
    return (
      <Segment
        inverted={darkProfile}
        loading={fetchingAsset || fetchingTransaction}
      >
        {fetchAssetError ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '10px'
            }}
          >
            <Message compact error size="tiny">
              {fetchAssetError}
            </Message>
          </div>
        ) : (
          <div className='edit-transaction-summary'>
            <Grid columns={4} divided>
              <Grid.Row>
                <Grid.Column>
                  <HeaderField
                    label={formatMessage(messages.assetClass)}
                    value={asset.assetClass}
                  />
                  <HeaderField
                    label={formatMessage(messages.assetType)}
                    value={asset.assetType}
                  />

                  <HeaderField
                    label={formatMessage(messages.description)}
                    value={asset.description}
                  />

                  <HeaderField
                    label={formatMessage(messages.countryCcy)}
                    value={`${asset.countryId || ''}/${asset.currency || ''}`}
                  />
                </Grid.Column>
                <Grid.Column>
                  <HeaderField
                    label={formatMessage(messages.transactionId)}
                    value={transaction.transactionId}
                  />
                  <HeaderField
                    label={formatMessage(messages.transactionStatus)}
                    value={transaction.transactionStatus}
                  />
                  <HeaderField
                    label={formatMessage(messages.executionTime)}
                    value={transaction.executionTime ? moment.utc(transaction.executionTime).local().format(`${dateFormat.toUpperCase()} HH:mm:ss`) : ''}
                  />
                </Grid.Column>
                <Grid.Column>
                  <HeaderField
                    label={formatMessage(messages.createdBy)}
                    value={transaction.createdBy}
                  />
                  <HeaderField
                    label={formatMessage(messages.createdTime)}
                    value={transaction.createdTime ? transaction.createdTime.local().format(`${dateFormat.toUpperCase()} HH:mm:ss`) : ''}
                  />
                  <HeaderField
                    label={formatMessage(messages.updatedBy)}
                    value={transaction.updatedBy}
                  />
                  <HeaderField
                    label={formatMessage(messages.updatedTime)}
                    value={transaction.updatedTime ? transaction.updatedTime.local().format(`${dateFormat.toUpperCase()} HH:mm:ss`) : ''}
                  />
                </Grid.Column>
                <Grid.Column>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        )}
      </Segment>
    )
  }
)

interface IHeaderFieldProps {
  label: string
  value?: string | number
}

const HeaderField = (props: IHeaderFieldProps) => {
  const { label, value } = props
  return (
    <div className="column-inner-row">
      <div className="column-inner-column">
        <p>{label}</p>
      </div>
      <div className="column-inner-column">
        <p>{value}</p>
      </div>
    </div>
  )
}

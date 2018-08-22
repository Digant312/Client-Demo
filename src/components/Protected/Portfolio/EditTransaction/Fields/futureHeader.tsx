import React from 'react'
import { defineMessages, injectIntl, InjectedIntlProps } from 'react-intl'
import { Grid, Message, Segment } from 'semantic-ui-react'
import { assets, transactions } from '@amaas/amaas-core-sdk-js'
import moment, { Moment } from 'moment'
import { getTimeZone } from './helper'

import { messages } from './equityHeader'
import { dateFormats } from 'reducers/profile'

interface ITransactionHeaderProps {
  darkProfile: boolean
  fetchingAsset: boolean
  fetchingTransaction: boolean
  asset: assets.Future & {
    assetType: string
    underlyingPrimaryReference: string
  }
  fetchAssetError: string
  transaction: transactions.Transaction & {
    createdTime: Moment
    updatedTime: Moment
    executionTime: Moment
  }
  dateFormat: dateFormats
}

const futureMessages = defineMessages({
  underlying: {
    id: 'futureTransactionHeader.underlying',
    defaultMessage: 'Underlying'
  },
  contractSize: {
    id: 'futureTransactionHeader.contractSize',
    defaultMessage: 'Contract Size'
  },
  tickSize: {
    id: 'futureTransactionHeader.tickSize',
    defaultMessage: 'Tick Size'
  },
  pointValue: {
    id: 'futureTransactionHeader.pointValue',
    defaultMessage: 'Value of 1 point'
  }
})

export default injectIntl(
  (props: ITransactionHeaderProps & InjectedIntlProps) => {
    const {
      asset: assetProp,
      transaction: transactionProp,
      darkProfile,
      fetchingAsset,
      fetchAssetError,
      fetchingTransaction,
      intl: { formatMessage },
      dateFormat
    } = props
    const asset = assetProp || {}
    const transaction = transactionProp || {}
    const localTimeZone = getTimeZone()
    const safeDecimalParse = (decimal: any) => {
      if (!decimal) return ''
      if (decimal.toFixed) return decimal.toFixed()
      if (decimal.toString) return decimal.toString()
      return `${decimal}`
    }
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
          <div className="edit-transaction-summary">
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
                    label={formatMessage(futureMessages.underlying)}
                    value={asset.underlyingAssetId}
                  />

                  <HeaderField
                    label={formatMessage(futureMessages.contractSize)}
                    value={safeDecimalParse(asset.contractSize)}
                  />

                  <HeaderField
                    label={formatMessage(futureMessages.tickSize)}
                    value={safeDecimalParse(asset.tickSize)}
                  />

                  <HeaderField
                    label={formatMessage(futureMessages.pointValue)}
                    value={safeDecimalParse(asset.pointValue)}
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
                    value={
                      transaction.executionTime
                        ? moment
                            .utc(transaction.executionTime)
                            .local()
                            .format(`${dateFormat} HH:mm:ss`)
                        : ''
                    }
                  />
                </Grid.Column>
                <Grid.Column>
                  <HeaderField
                    label={formatMessage(messages.createdBy)}
                    value={transaction.createdBy}
                  />
                  <HeaderField
                    label={formatMessage(messages.createdTime)}
                    value={
                      transaction.createdTime
                        ? transaction.createdTime
                            .local()
                            .format(`${dateFormat} HH:mm:ss`)
                        : ''
                    }
                  />
                  <HeaderField
                    label={formatMessage(messages.updatedBy)}
                    value={transaction.updatedBy}
                  />
                  <HeaderField
                    label={formatMessage(messages.updatedTime)}
                    value={
                      transaction.updatedTime
                        ? transaction.updatedTime
                            .local()
                            .format(`${dateFormat} HH:mm:ss`)
                        : ''
                    }
                  />
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

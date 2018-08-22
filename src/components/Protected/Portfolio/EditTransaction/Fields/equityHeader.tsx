import React from 'react'
import { defineMessages, injectIntl, InjectedIntlProps } from 'react-intl'
import { Grid, Message, Segment } from 'semantic-ui-react'
import { assets, transactions } from '@amaas/amaas-core-sdk-js'
import { getTimeZone } from './helper'
import moment, { Moment } from 'moment'

import { dateFormats } from 'reducers/profile'

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
  transaction: transactions.Transaction & {
    createdTime: Moment
    updatedTime: Moment
    executionTime: Moment
  }
  dateFormat: dateFormats
}

export const messages = defineMessages({
  assetClass: {
    id: 'transactionHeader.AssetClass',
    defaultMessage: 'Asset Class'
  },
  assetType: {
    id: 'transactionHeader.AssetType',
    defaultMessage: 'Asset Type'
  },
  description: {
    id: 'transactionHeader.description',
    defaultMessage: 'Description'
  },
  countryCcy: {
    id: 'transactionHeader.countryCcy',
    defaultMessage: 'Country/Ccy'
  },
  transactionId: {
    id: 'transactionHeader.transacitonId',
    defaultMessage: 'Transaction ID'
  },
  transactionStatus: {
    id: 'transactionHeader.transactionStatus',
    defaultMessage: 'Transaction Status'
  },
  executionTime: {
    id: 'transactionHeader.executionTime',
    defaultMessage: 'Execution Time'
  },
  createdBy: {
    id: 'transactionHeader.createdBy',
    defaultMessage: 'Created By'
  },
  createdTime: {
    id: 'transactionHeader.createdTime',
    defaultMessage: 'Created Time'
  },
  updatedBy: {
    id: 'transactionHeader.updatedBy',
    defaultMessage: 'Updated By'
  },
  updatedTime: {
    id: 'transactionHeader.updatedTime',
    defaultMessage: 'Updated Time'
  }
})

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
                <Grid.Column />
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

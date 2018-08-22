import React from 'react'
import { Button } from 'semantic-ui-react'
import moment from 'moment'

import EquityForm from 'components/Protected/Portfolio/EditTransaction/Forms/equityForm'
import FXForm from 'components/Protected/Portfolio/EditTransaction/Forms/fxForm'
import FutureForm from 'components/Protected/Portfolio/EditTransaction/Forms/futureForm'
import GenericForm from 'components/Protected/Portfolio/EditTransaction/Forms/genericForm'
import CashForm from 'components/Protected/Portfolio/EditTransaction/Forms/cashForm'

interface INewTransactionProps {
  assumedAMID: string
  fetchTransactions: Function
}

interface INewTransactionState {
  assetClass: string
}

class NewTransaction extends React.Component<
  INewTransactionProps,
  INewTransactionState
> {
  constructor() {
    super()
    this.state = {
      assetClass: ''
    }
  }

  componentDidMount() {
    this.props.fetchTransactions()
  }

  handleSelectAssetClass(assetClass: string) {
    this.setState({ assetClass })
  }

  setInitialValues(assetClass: string) {
    const initialValues = {
      assetManagerId: parseInt(this.props.assumedAMID),
      transactionDate: moment(),
      transactionAction: 'Buy' as 'Buy',
      charges: [
        { name: 'Commission', netAffecting: true, chargeValue: '0' },
        { name: 'Stamp Duty', netAffecting: true, chargeValue: '0' }
      ]
    }
    switch (assetClass) {
      case 'ForeignExchange':
        return {
          ...initialValues,
          spotOrForward: 'ForeignExchangeSpot',
          transactionType: 'Trade' as 'Trade'
        }
      case 'Future':
        return {
          ...initialValues,
          transactionType: 'Trade' as 'Trade'
        }
      case 'Cash':
        return {
          ...initialValues,
          price: '1'
        }
      case 'Equity':
      default:
        return {
          ...initialValues,
          transactionType: 'Trade' as 'Trade',
          charges: [
            ...initialValues.charges,
            { name: 'Other Fees', netAffecting: true, chargeValue: '0' }
          ]
        }
    }
  }

  renderTransactionForm(assetClass: string, initialValues: any) {
    switch (assetClass) {
      case 'ForeignExchange':
        return (
          <FXForm
            type="New"
            initialValues={initialValues}
            assetType={assetClass}
          />
        )
      case 'Future':
        return (
          <FutureForm
            type="New"
            initialValues={initialValues}
            assetType={assetClass}
          />
        )
      case 'Equity':
        return (
          <EquityForm
            type="New"
            initialValues={initialValues}
            assetType={assetClass}
          />
        )
      case 'Cash':
        return (
          <CashForm
            type="New"
            initialValues={initialValues}
            assetType={assetClass}
          />
        )
      case 'Generic':
      default:
        return (
          <GenericForm
            type="New"
            initialValues={initialValues}
            assetType={assetClass}
          />
        )
    }
  }

  render() {
    const { assetClass } = this.state
    const initialValues = this.setInitialValues(assetClass)
    return (
      <div>
        {!assetClass ? (
          <div>
            <Button
              compact
              color="green"
              size="tiny"
              onClick={() => this.handleSelectAssetClass('Equity')}
            >
              New Equity Transaction
            </Button>
            <Button
              compact
              color="green"
              size="tiny"
              onClick={() => this.handleSelectAssetClass('ForeignExchange')}
            >
              New FX Transaction
            </Button>
            <Button
              compact
              color="green"
              size="tiny"
              onClick={() => this.handleSelectAssetClass('Future')}
            >
              New Futures Transaction
            </Button>
            <Button
              compact
              color="green"
              size="tiny"
              onClick={() => this.handleSelectAssetClass('Generic')}
            >
              New Generic Transaction
            </Button>
            <Button
              compact
              color="green"
              size="tiny"
              onClick={() => this.handleSelectAssetClass('Cash')}
            >
              New Cash Transaction
            </Button>
          </div>
        ) : (
          <Button
            compact
            size="tiny"
            content="Back to Asset Types"
            icon="angle left"
            labelPosition="left"
            onClick={() => this.handleSelectAssetClass('')}
          />
        )}
        {assetClass
          ? this.renderTransactionForm(assetClass, initialValues)
          : null}
      </div>
    )
  }
}

export default (props: INewTransactionProps) => <NewTransaction {...props} />

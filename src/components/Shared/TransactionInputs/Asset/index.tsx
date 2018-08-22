import React from 'react'
import { Field } from 'redux-form'

import AssetDropdown from 'containers/Shared/AssetDropdown'

interface ITransactionAssetInputProps {
  name?: string
  fieldLabel?: string
  initialAssetId?: string
  readOnly?: boolean
  queryFilter: object
}

interface ITransactionAssetInputState {
  assetDropdownOpen: boolean
}

export default class TransactionAssetInput extends React.Component<
  ITransactionAssetInputProps,
  ITransactionAssetInputState
> {
  constructor() {
    super()
    this.state = {
      assetDropdownOpen: false
    }
    this.handleToggleAssetDropdown = this.handleToggleAssetDropdown.bind(this)
  }

  handleToggleAssetDropdown(assetDropdownOpen: boolean) {
    this.setState({ assetDropdownOpen })
  }

  render() {
    const {
      queryFilter,
      fieldLabel,
      initialAssetId,
      name,
      readOnly
    } = this.props
    const { assetDropdownOpen } = this.state

    return (
      <div className="column-inner-row">
        <div
          className={`column-inner-column ${assetDropdownOpen
            ? 'compact'
            : ''}`}
        >
          <p>{fieldLabel || 'Asset'}</p>
        </div>
        <div className="column-inner-column">
          <Field
            name={name || 'assetId'}
            component={AssetDropdown}
            normal
            queryFilter={{ ...queryFilter, assetStatus: 'Active' }}
            scrolling
            initialOptions={
              initialAssetId
                ? [
                    {
                      key: 0,
                      text: initialAssetId,
                      value: initialAssetId
                    }
                  ]
                : []
            }
            onOpen={() => this.handleToggleAssetDropdown(true)}
            onClose={() => this.handleToggleAssetDropdown(false)}
            readOnly={readOnly}
          />
        </div>
      </div>
    )
  }
}

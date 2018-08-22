import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import ReactTable, { ReactTableDefaults } from 'react-table'
import startCase from 'lodash/startCase'
import { Field, FormProps, reduxForm } from 'redux-form'
import { Form } from 'semantic-ui-react'
import { api, transactions } from '@amaas/amaas-core-sdk-js'
import forEach from 'lodash/forEach'

import Position from './Position'
import Input from 'containers/Shared/CompactInput'
import FormTogglePosition from 'containers/Protected/Portfolio/PositionsList/FormTogglePosition'
import { formatDate, normaliseCurrency } from 'utils/form'
import Loader from 'components/Shared/Loader'
import DatePicker from 'containers/Protected/Portfolio/PositionsList/DatePicker'
import CustomButton from 'containers/Shared/ArgomiGrid/ComponentOverrides/NextPrevButton'
import CustomExpanderComponent from 'components/Shared/ArgomiGrid/ComponentOverrides/ExpanderComponent'
import CustomFilterComponent from 'containers/Shared/ArgomiGrid/ComponentOverrides/FilterComponent'
import CustomPaginationComponent from 'containers/Shared/ArgomiGrid/ComponentOverrides/PaginationComponent'
import CustomNoDataComponent from 'components/Shared/ArgomiGrid/ComponentOverrides/NoDataComponent'
import CustomDefaultCell from 'components/Shared/ArgomiGrid/ComponentOverrides/CustomDefaultCell'
import DataLoadingError from 'components/Shared/DataLoadingError'

interface IConnectInjectedProps extends RouteComponentProps<{}> {
  positions: transactions.Position[]
  assumedAMID: string
  positionsFetching: boolean
  fetchPositions: Function
  fetchError: string
  togglePositionCheckBox: boolean
}

interface IPositionsState {
  assetInfo: { assetId: string; displayName: string; description: string }[]
}

const positionColumns = (fields: string[]) => {
  return fields.map((key: string) => {
    return {
      Header: startCase(key),
      id: key,
      accessor: (d: any) => {
        const isNumber =
          key === 'grossSettlement' ||
          key === 'netSettlement' ||
          key === 'price' ||
          key === 'quantity'
        if (isNumber) {
          return normaliseCurrency(d[key])
        }
        return d[key] ? d[key] : null
      }
    }
  })
}

const positionColumnFields = [
  'bookId',
  'assetPrimaryReference',
  'assetId',
  'displayName',
  'quantity',
  'assetType'
]

class Positions extends React.Component<
  IConnectInjectedProps,
  IPositionsState
> {
  constructor() {
    super()
    this.state = {
      assetInfo: []
    }
  }
  componentDidMount() {
    const { togglePositionCheckBox } = this.props
    this.props.fetchPositions({ includeCash: togglePositionCheckBox })
  }

  componentWillReceiveProps(nextProps: IConnectInjectedProps) {
    if (
      this.props.assumedAMID != nextProps.assumedAMID ||
      this.props.togglePositionCheckBox != nextProps.togglePositionCheckBox
    ) {
      this.props.fetchPositions({
        includeCash: nextProps.togglePositionCheckBox
      })
    }
  }

  render() {
    const { positions, positionsFetching, fetchError } = this.props
    return (
      <div>
        <div
          style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}
        >
          <DatePicker />
          <FormTogglePosition
            formStyles={{ margin: '0 10px' }}
            label="Include Cash"
            defaultChecked={true}
          />
          <span style={{ display: 'inline-block', width: '50px' }} />
          <p>Total Positions: {positions.length}</p>
        </div>
        {fetchError ? (
          <DataLoadingError
            message={fetchError}
            refetchFunction={this.props.fetchPositions as any}
          />
        ) : positionsFetching ? (
          <Loader delay={200} />
        ) : (
          <ReactTable
            className="-striped -highlight"
            data={positions}
            columns={positionColumns(positionColumnFields)}
            filterable
            defaultFilterMethod={(
              filter: { id: string; value: string },
              row: any
            ) => new RegExp(`${filter.value}`, 'ig').test(row[filter.id])}
            PreviousComponent={CustomButton}
            NextComponent={CustomButton}
            ExpanderComponent={CustomExpanderComponent}
            FilterComponent={(props: any) => (
              <CustomFilterComponent {...props} />
            )}
            PaginationComponent={CustomPaginationComponent}
            NoDataComponent={CustomNoDataComponent}
            column={{
              ...ReactTableDefaults.column,
              Cell: CustomDefaultCell
            }}
          />
        )}
      </div>
    )
  }
}

export default Positions

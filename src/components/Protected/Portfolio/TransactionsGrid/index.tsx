import React from 'react'
import ReactTable, { ReactTableDefaults } from 'react-table'
import forEach from 'lodash/forEach'

import CustomButton from 'containers/Shared/ArgomiGrid/ComponentOverrides/NextPrevButton'
import CustomExpanderComponent from 'components/Shared/ArgomiGrid/ComponentOverrides/ExpanderComponent'
import CustomFilterComponent from 'containers/Shared/ArgomiGrid/ComponentOverrides/FilterComponent'
import CustomPaginationComponent from 'containers/Shared/ArgomiGrid/ComponentOverrides/PaginationComponent'
import CustomNoDataComponent from 'components/Shared/ArgomiGrid/ComponentOverrides/NoDataComponent'
import CustomDefaultCell from 'components/Shared/ArgomiGrid/ComponentOverrides/CustomDefaultCell'

interface ITransactionsGridProps {
  data: any
  columns: any[]
  defaultFilterMethod?: Function
  defaultSorted: any[]
  SubComponent: any
  [reactTableProp: string]: any
}

interface ITransactionsGridState {
  expanded: IExpandedRows
}

interface IExpandedRows {
  [rowIndex: number]: boolean
}

export default class TransactionsGrid extends React.Component<
  ITransactionsGridProps,
  ITransactionsGridState
> {
  constructor() {
    super()
    this.state = {
      expanded: {}
    }
  }

  render() {
    const {
      expanded: expandedProp,
      onExpandedChange,
      ...otherProps
    } = this.props
    const { expanded } = this.state
    return (
      <div>
        <ReactTable
          className="-striped -highlight"
          defaultFilterMethod={(
            filter: { id: string; value: string },
            row: any
          ) => new RegExp(`${filter.value}`, 'ig').test(row[filter.id])}
          expanded={expanded}
          onExpandedChange={(newExpanded: any, index: number[], event: any) => {
            const currExpandedState = !!this.state.expanded[index[0]]
            forEach(newExpanded, (value: boolean, key: number) => {
              key == index[0]
                ? (newExpanded[key] = !currExpandedState)
                : (newExpanded[key] = false)
            })
            this.setState({ expanded: newExpanded })
          }}
          PreviousComponent={CustomButton}
          NextComponent={CustomButton}
          ExpanderComponent={CustomExpanderComponent}
          FilterComponent={(props: any) => <CustomFilterComponent {...props} />}
          PaginationComponent={CustomPaginationComponent}
          NoDataComponent={CustomNoDataComponent}
          column={{ ...ReactTableDefaults.column, Cell: CustomDefaultCell }}
          {...otherProps}
        />
      </div>
    )
  }
}

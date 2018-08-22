import React from 'react'
import { render } from 'react-dom'
import ReactTable, { ReactTableDefaults } from 'react-table'
import { Button } from 'semantic-ui-react'
import CustomButton from 'containers/Shared/ArgomiGrid/ComponentOverrides/NextPrevButton'
import CustomExpanderComponent from 'components/Shared/ArgomiGrid/ComponentOverrides/ExpanderComponent'
import CustomFilterComponent from 'containers/Shared/ArgomiGrid/ComponentOverrides/FilterComponent'
import CustomPaginationComponent from 'containers/Shared/ArgomiGrid/ComponentOverrides/PaginationComponent'
import CustomNoDataComponent from 'components/Shared/ArgomiGrid/ComponentOverrides/NoDataComponent'
import CustomDefaultCell from 'components/Shared/ArgomiGrid/ComponentOverrides/CustomDefaultCell'

// variables to manage Grid toggle action
var lastExpandedRowIndex: number
var currentOpenRowIndex: number
var addDeleteColumnFlag: boolean = true
var addAdditionalActionColumnFlag: boolean = true
var columnDataWithDelete: any

class ActionButton extends React.Component<any, any> {
  constructor() {
    super()
  }
  render() {
    const { uniqueIdColumn } = this.props
    let recordStatus: string = ''
    var rowData = this.props.rowData
    let statusId: string = this.props.statusId
    if (this.props.statusId !== undefined) {
      recordStatus = this.props.rowData[statusId]
    } else {
      recordStatus = this.props.rowData.bookStatus
    }
    const assumedAMID = this.props.assumedAMID
    const assetManagerId = this.props.rowData.assetManagerId
    let displayDeleteButton = false
    if (
      assumedAMID &&
      assetManagerId !== undefined &&
      assumedAMID == assetManagerId
    ) {
      displayDeleteButton = true
    }
    //const bookStatus = this.props.rowData.bookStatus
    return (
      <div>
        {displayDeleteButton ? (
          <div
            onClick={this.props.handleDelete.bind(
              this,
              uniqueIdColumn,
              rowData,
              recordStatus
            )}
            style={{ cursor: 'pointer' }}
          >
            {this.props.actionButton ? (
              this.props.multipleActionButtonRequire ? (
                recordStatus === 'Active' ? (
                  <Button
                    compact
                    inverted
                    icon
                    color={this.props.actionButton.retire.props.color}
                    size="tiny"
                  >
                    {this.props.actionButton.retire.props.children}
                  </Button>
                ) : (
                  <Button
                    compact
                    inverted
                    icon
                    color={this.props.actionButton.reactivate.props.color}
                    size="tiny"
                  >
                    {this.props.actionButton.reactivate.props.children}
                  </Button>
                )
              ) : (
                this.props.actionButton
              )
            ) : (
              <Button compact inverted icon="delete" size="tiny" color="red" />
            )}
          </div>
        ) : (
          <div />
        )}
      </div>
    )
  }
}

class AdditionalActionButton extends React.Component<any, any> {
  constructor() {
    super()
  }
  render() {
    var uniqueIdColumn = this.props.uniqueIdColumn
    var clonedEnabledAdditionalActionButton = React.cloneElement(
      this.props.additionalActionButton.enabled,
      {
        onClick: this.props.handleAdditionalAction.bind(this, uniqueIdColumn)
      }
    )
    return (
      <div>
        {this.props.additionalActionButton ? (
          <div>
            {uniqueIdColumn.partyStatus !== 'Active'
              ? this.props.additionalActionButton.disabled
              : clonedEnabledAdditionalActionButton}
          </div>
        ) : (
          <div>
            {uniqueIdColumn.partyStatus !== 'Active' ? (
              <Button
                disabled
                compact
                inverted
                icon="minus"
                size="tiny"
                color="green"
              />
            ) : (
              <Button
                compact
                inverted
                icon="minus"
                size="tiny"
                color="green"
                onClick={this.props.handleAdditionalAction.bind(
                  this,
                  uniqueIdColumn
                )}
              />
            )}
          </div>
        )}
      </div>
    )
  }
}

class ArgomiGrid extends React.Component<any, { expanded: any }> {
  constructor(props: any) {
    super(props)
    this.state = {
      expanded: {}
    }
    this.resetState = this.resetState.bind(this)
    this.collapseEditForm = this.collapseEditForm.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleAdditionalAction = this.handleAdditionalAction.bind(this)
  }

  // methods to manage Grid Edit form toggle functionality
  expandOnlyOneRow = (rowIndex: number) => ({
    expanded: { [rowIndex]: {} }
  })

  collapseCurrentRow = (rowIndex: number) => ({
    expanded: { [rowIndex]: false }
  })

  resetState(currentRowIndex: number) {
    if (
      JSON.stringify(currentRowIndex) == JSON.stringify(lastExpandedRowIndex)
    ) {
      this.setState(this.collapseCurrentRow(currentRowIndex))
      lastExpandedRowIndex = -1
    } else {
      this.setState(this.expandOnlyOneRow(currentRowIndex))
      lastExpandedRowIndex = currentRowIndex
    }
  }

  collapseEditForm() {
    this.setState(this.collapseCurrentRow(currentOpenRowIndex))
    lastExpandedRowIndex = -1
    this.props.onGridCollapse()
  }

  getCurrentRowId() {
    return currentOpenRowIndex
  }

  // method called when grid form submitted
  handleUpdate(values: any) {
    this.collapseEditForm()
    this.props.onGridUpdate(values)
  }

  handleAdditionalAction(uniqueIdColumn: any) {
    this.props.additionalAction(uniqueIdColumn)
  }

  handleDelete(uniqueIdColumn: any, rowData: any, bookStatus: any) {
    this.props.onGridDelete(uniqueIdColumn, rowData, bookStatus)
  }

  handleClear() {}

  additionalActionEnable(
    columndata: any,
    uniqueColumnId: any,
    actionHeading: any
  ) {
    var columnDataReturn
    if (this.props.additionalActionEnable) {
      if (columndata[columndata.length - 1]['Header'] !== 'Add book') {
        addAdditionalActionColumnFlag = true
      }

      if (addAdditionalActionColumnFlag) {
        const deleteColumn = {
          Header: actionHeading,
          accessor: 'additionalActionButton',
          filterable: false,
          style: { textAlign: 'center' },
          Cell: ({ original: row }: any) => {
            return (
              <AdditionalActionButton
                handleAdditionalAction={this.handleAdditionalAction}
                uniqueIdColumn={row}
                additionalActionButton={this.props.additionalActionButton}
              />
            )
          }
        }
        columnDataReturn = columndata.concat([deleteColumn])
        return columnDataReturn
      }
      addAdditionalActionColumnFlag = false
      return columndata
    }
    return columndata
  }

  deleteEnable(columndata: any, uniqueColumnId: any, actionHeading: any) {
    var columnDataReturn
    if (this.props.deleteEnable) {
      if (columndata[columndata.length - 1]['Header'] !== actionHeading) {
        addDeleteColumnFlag = true
      }

      if (addDeleteColumnFlag) {
        const deleteColumn = {
          Header: actionHeading,
          filterable: false,
          accessor: 'deleteButton',
          style: { textAlign: 'center' },
          Cell: ({ original: row }: any) => {
            if (this.props.subcomponent) {
              return (
                <ActionButton
                  handleDelete={this.handleDelete}
                  rowData={row}
                  uniqueIdColumn={
                    row[this.props.subcomponent.props.uniqueColumnId]
                  }
                  actionButton={this.props.actionButton}
                  multipleActionButtonRequire={
                    this.props.multipleActionButtonRequire
                  }
                  statusId={this.props.statusId}
                  assumedAMID={this.props.assumedAMID}
                />
              )
            } else {
              return (
                <ActionButton
                  handleDelete={this.handleDelete}
                  actionButton={this.props.actionButton}
                  uniqueIdColumn={row[this.props.uniqueColumnId]}
                  rowData={row}
                  assumedAMID={this.props.assumedAMID}
                />
              )
            }
          }
        }
        columnDataReturn = columndata.concat([deleteColumn])
        return columnDataReturn
      }
      addDeleteColumnFlag = false
      return columndata
    }
    return columndata
  }

  render() {
    var columndata = this.props.column
    var rowData = this.props.data
    if (this.props.actionHeading !== undefined) {
      var actionHeading: any = this.props.actionHeading
    } else {
      var actionHeading: any = 'Action'
    }

    if (this.props.additionalActionHeading !== undefined) {
      var additionalActionHeading: any = this.props.additionalActionHeading
    } else {
      var additionalActionHeading: any = 'Create Book'
    }

    if (this.props.additionalActionEnable) {
      columndata = this.additionalActionEnable(
        columndata,
        uniqueColumnId,
        additionalActionHeading
      )
    }

    if (this.props.subComponentType) {
      if (this.props.subComponentType.toUpperCase() == 'FORM') {
        var uniqueColumnId = this.props.subcomponent.props.uniqueColumnId
        columndata = this.deleteEnable(
          columndata,
          uniqueColumnId,
          actionHeading
        )
      }
    } else {
      var uniqueColumnId = null
      var columnDataWithDelete = this.deleteEnable(
        columndata,
        uniqueColumnId,
        actionHeading
      )
    }

    if (this.props.subcomponent == '' || this.props.subcomponent == undefined) {
      return (
        <ReactTable
          data={this.props.data}
          //columns={columndata}
          columns={columnDataWithDelete}
          defaultPageSize={this.props.defaultPageSize}
          filterable={this.props.filterable}
          defaultFilterMethod={(
            filter: { id: string; value: string },
            row: any
          ) => new RegExp(`${filter.value}`, 'ig').test(row[filter.id])}
          className="-striped -highlight"
          PreviousComponent={CustomButton}
          NextComponent={CustomButton}
          ExpanderComponent={CustomExpanderComponent}
          FilterComponent={(props: any) => <CustomFilterComponent {...props} />}
          PaginationComponent={CustomPaginationComponent}
          NoDataComponent={CustomNoDataComponent}
          column={{
            ...ReactTableDefaults.column,
            Cell: CustomDefaultCell
          }}
          loading={this.props.loading}
          manual={this.props.manual}
          pages={this.props.pages}
          onFetchData={this.props.onFetchData}
        />
      )
    } else {
      return (
        <ReactTable
          data={this.props.data}
          columns={columndata}
          defaultPageSize={this.props.defaultPageSize}
          filterable={this.props.filterable}
          defaultFilterMethod={(
            filter: { id: string; value: string },
            row: any
          ) => new RegExp(`${filter.value}`, 'ig').test(row[filter.id])}
          className="-striped -highlight"
          inverted={this.props.darkProfile}
          SubComponent={({ original: row }: { original: any }) => {
            if (
              this.props.subComponentType &&
              this.props.subComponentType.toUpperCase() == 'FORM'
            ) {
              const data_row = this.props.data.filter(
                (data_row: any) =>
                  data_row[uniqueColumnId] === row[uniqueColumnId]
              )
              var clonedSubComponent = React.cloneElement(
                this.props.subcomponent,
                {
                  formData: data_row[0],
                  callbackOnCancel: this.collapseEditForm,
                  onSubmit: this.handleUpdate
                }
              )
              return clonedSubComponent
            } else {
              return this.props.subcomponent
            }
          }}
          onExpandedChange={(newExpanded: any, index: number, event: any) => {
            currentOpenRowIndex = index
            this.resetState(index)
            if (lastExpandedRowIndex != -1) {
              this.props.onGridExpand()
            } else {
              this.props.onGridCollapse()
            }
          }}
          expanded={this.state.expanded}
          PreviousComponent={CustomButton}
          NextComponent={CustomButton}
          ExpanderComponent={CustomExpanderComponent}
          FilterComponent={(props: any) => <CustomFilterComponent {...props} />}
          PaginationComponent={CustomPaginationComponent}
          NoDataComponent={CustomNoDataComponent}
          column={{
            ...ReactTableDefaults.column,
            Cell: CustomDefaultCell
          }}
          loading={this.props.loading}
          manual={this.props.manual}
          pages={this.props.pages}
          onFetchData={this.props.onFetchData}
        />
      )
    }
  }
}

export default ArgomiGrid

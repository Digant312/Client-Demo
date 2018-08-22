import React from 'react'
import ReactTable from 'react-table'
import { api, monitor } from '@amaas/amaas-core-sdk-js'
import { Button, Header, Icon, Label, Segment } from 'semantic-ui-react'

import MainLayout from 'containers/Shared/Layouts/Protected/Main'
import Loader from 'components/Shared/Loader'
import { columnBuilder } from 'utils/table'
import injectProps from 'components/Shared/InjectProps'
import MonitorItem from '../MonitorItem'
import { close, resubmit } from '../functions'

interface IMonitorProps {
  close: Function
  resubmit: Function
  darkProfile: boolean
}

interface IConnectInjectedProps {
  assumedAMID: string
  monitor: monitor.Item[]
  fetchMonitorItems: Function
  monitorFetching: boolean
}

interface IMonitorItemState {
  closing: boolean
  resubmitting: boolean
  closeError: string
  resubmitError: string
}

class Monitor extends React.Component<
  IMonitorProps & IConnectInjectedProps,
  IMonitorItemState
> {
  mounted: boolean
  constructor() {
    super()
    this.state = {
      closing: false,
      resubmitting: false,
      closeError: '',
      resubmitError: ''
    }
  }

  componentDidMount() {
    this.mounted = true
    this.props.fetchMonitorItems()
  }

  componentWillUnmount() {
    this.mounted = false
  }

  componentWillReceiveProps(nextProps: IMonitorProps & IConnectInjectedProps) {
    if (this.props.assumedAMID != nextProps.assumedAMID) {
      this.props.fetchMonitorItems()
    }
  }

  handleClose(AMId: string, itemId: string) {
    if (this.mounted) {
      this.setState({ closeError: '' })
      this.props.close(
        AMId,
        itemId,
        this.setState.bind(this),
        this.props.fetchMonitorItems
      )
    }
  }

  handleResubmit(AMId: string, itemId: string) {
    if (this.mounted) {
      this.setState({ resubmitError: '' })
      this.props.resubmit(
        AMId,
        itemId,
        this.setState.bind(this),
        this.props.fetchMonitorItems
      )
    }
  }

  render() {
    const { assumedAMID, darkProfile, monitor, monitorFetching } = this.props
    const { closing, resubmitting } = this.state
    const actionColumn = {
      Header: 'Action',
      accessor: 'itemStatus',
      Cell: (row: any) => {
        return (
          <Button.Group>
            <Button
              basic
              compact
              size="mini"
              color="blue"
              disabled={resubmitting}
              onClick={() =>
                this.handleResubmit(this.props.assumedAMID, row.row.itemId)}
            >
              Resubmit
            </Button>
            <Button
              basic
              compact
              size="mini"
              color="green"
              disabled={closing}
              onClick={() =>
                this.handleClose(this.props.assumedAMID, row.row.itemId)}
            >
              Close
            </Button>
          </Button.Group>
        )
      }
    }
    const columnFilter = monitor.map(item => {
      const {
        createdBy,
        createdTime,
        updatedBy,
        updatedTime,
        version,
        assetManagerId,
        ...rest
      } = item
      return rest
    })
    const columns = [
      ...columnBuilder(
        columnFilter
      ).map(
        (column: {
          Header: string
          id: string
          accessor: Function
          Cell: Function
        }) => {
          if (column.id === 'itemLevel') {
            return {
              ...column,
              Cell: (row: any) => {
                const labelConfig = {
                  size: 'small' as 'small',
                  color:
                    row.value === 'Warning'
                      ? 'yellow' as 'yellow'
                      : row.value === 'Error'
                        ? 'orange' as 'orange'
                        : row.value === 'Critical'
                          ? 'red' as 'red'
                          : 'blue' as 'blue'
                }
                return (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      height: '100%'
                    }}
                  >
                    <Label {...labelConfig}>{row.value}</Label>
                  </div>
                )
              }
            }
          }
          return { ...column }
        }
      ),
      actionColumn
    ]
    return (
      <Segment basic inverted={darkProfile}>
        <Header as="h2">
          <Icon name="computer" />
          Monitor
        </Header>
        {monitorFetching ? (
          <Loader delay={200} />
        ) : (
          <ReactTable
            data={monitor}
            columns={columns}
            SubComponent={({ row }: any) => (
              <MonitorItem
                item={row}
                refetch={this.props.fetchMonitorItems}
                darkProfile={darkProfile}
                assumedAMID={assumedAMID}
              />
            )}
          />
        )}
      </Segment>
    )
  }
}

export default injectProps<IMonitorProps & IConnectInjectedProps>({
  close: close(api.Monitor.closeItem),
  resubmit: resubmit(api.Monitor.resubmitItem)
})(Monitor)

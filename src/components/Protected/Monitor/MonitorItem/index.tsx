import React from 'react'
import { monitor } from '@amaas/amaas-core-sdk-js'
import { Button, Label, List, Message, Segment } from 'semantic-ui-react'
import { api } from '@amaas/amaas-core-sdk-js'

import { close, resubmit } from '../functions'
import injectProps from 'components/Shared/InjectProps'

interface IMonitorItemProps {
  assumedAMID: string
  item: monitor.Item
  refetch: Function
  darkProfile: boolean
}

interface InjectedProps {
  close: Function
  resubmit: Function
}

interface IMonitorItemState {
  closing: boolean
  closeError: string
  resubmitting: boolean
  resubmitError: string
}

class MonitorItem extends React.Component<IMonitorItemProps & InjectedProps, IMonitorItemState> {
  mounted: boolean
  constructor() {
    super()
    this.state = {
      closing: false,
      closeError: '',
      resubmitting: false,
      resubmitError: ''
    }
  }
  componentDidMount() {
    this.mounted = true
  }
  levelColor(level: string) {
    switch (level) {
      case 'Critical':
        return 'red'
      case 'Error':
        return 'orange'
      case 'Warning':
        return 'yellow'
      case 'Info':
      default:
        return 'blue'
    }
  }
  handleClose(AMId: string, itemId: string) {
    if (this.mounted) {
      this.setState({ closeError: '' })
      this.props.close(AMId, itemId, this.setState.bind(this), this.props.refetch)
    }
  }
  handleResubmit(AMId: string, itemId: string) {
    if (this.mounted) {
      this.setState({ resubmitError: '' })
      this.props.resubmit(AMId, itemId, this.setState.bind(this), this.props.refetch)
    }
  }
  componentWillUnmount() {
    this.mounted = false
  }
  render() {
    const { item } = this.props
    const { resubmitting, closing, closeError, resubmitError } = this.state
    return <div style={{ padding: '20px' }}>
      <Segment.Group color={this.levelColor(item.itemLevel as string)}>
        <Segment>
          <h3 style={{ display: 'inline-block' }}>{item.itemClass}</h3>&nbsp;
          <Label color={this.levelColor(item.itemLevel as string)}>{item.itemLevel}</Label>
          <br />
          ID: {item.itemId}
        </Segment>
        <Segment>
          <List bulleted>
            <List.Item>Date: {item.itemDate}</List.Item>
            <List.Item>Source: {item.itemSource}</List.Item>
            <List.Item>Type: {item.itemType}</List.Item>
            <List.Item>Message: {item.message}</List.Item>
            { item.itemStatus === 'Open' ? <List.Item>Status: {item.itemStatus}</List.Item> : null }
          </List>
        </Segment>
        <Segment>
        { (resubmitError || closeError) ? <Message negative>Error, please try again</Message> : null }
        { item.itemStatus === 'Open' ?
          <div>
            <Button disabled={resubmitting} loading={resubmitting} basic color='blue' onClick={() => this.handleResubmit(this.props.assumedAMID, item.itemId as string)}>Resubmit</Button>
            <Button disabled={closing} loading={closing} color='green' onClick={() => this.handleClose(this.props.assumedAMID, item.itemId as string)}>Close</Button>
          </div> : <Label size='big' color='green'>{item.itemStatus}</Label> }
        </Segment>
      </Segment.Group>
    </div>
  }
}

export default injectProps<IMonitorItemProps>({ close: close(api.Monitor.closeItem), resubmit: resubmit(api.Monitor.resubmitItem) })(MonitorItem)
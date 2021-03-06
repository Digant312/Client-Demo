import React from 'react'
import { render } from 'react-dom'
import PartyForm from './PartyForm'
import { Button } from 'semantic-ui-react'
import { FormattedMessage, injectIntl } from 'react-intl'
import messages from './PartyStrings'

// BrokerHeader component contain AddBroker button and AddBroker form
class BrokerHeader extends React.Component<
  any,
  { headerFormVisible: boolean }
> {
  constructor(props: any) {
    super(props)
    this.state = {
      headerFormVisible: props.headerFormVisible
    }
    this.handleAddClick = this.handleAddClick.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  getInitialState() {
    return { headerFormVisible: this.props.headerFormVisible }
  }

  componentWillReceiveProps(nextProps: any) {
    this.setState({ headerFormVisible: nextProps.headerFormVisible })
  }

  handleAddClick() {
    this.setState({ headerFormVisible: true })
    this.props.formOpened()
  }

  handleCancel() {
    this.setState({ headerFormVisible: false })
    this.props.formClosed()
  }

  handleSubmit(values: any) {
    this.props.headerForm.props.onFormSubmit(values)
  }

  render() {
    var headerForm = this.props.headerForm

    var headerState
    this.state.headerFormVisible
      ? (headerState = 'open-addform')
      : (headerState = 'default')

    if (this.props.headerForm !== undefined) {
      var clonedheaderForm = React.cloneElement(this.props.headerForm, {
        callbackOnCancel: this.handleCancel,
        onSubmit: this.handleSubmit
      })
      headerForm = clonedheaderForm
    } else {
      headerForm = this.props.headerForm
    }

    switch (headerState) {
      case 'open-addform':
        return <div className="top-header">{headerForm}</div>
      default:
        return (
          <div className="top-header float-right">
            <Button
              onClick={this.handleAddClick}
              className="top-header-btn"
              disabled={this.props.gridRowExpanded}
              color="green"
            >
              {this.props.addButtonLabel}
            </Button>
          </div>
        )
    }
  }
}

export default injectIntl(BrokerHeader)

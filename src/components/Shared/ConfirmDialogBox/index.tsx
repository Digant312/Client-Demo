import React, { Component } from 'react'
import { Button, Modal, Header } from 'semantic-ui-react'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'

class ConfirmDialogBox extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.confirmYes = this.confirmYes.bind(this)
    this.confirmNo = this.confirmNo.bind(this)
    this.state = { openConfirm: this.props.openModalProp }
    this.confirmYes = this.confirmYes.bind(this)
    this.openModal = this.openModal.bind(this)
  }

  openModal() {
    this.setState({ openConfirm: true })
  }

  close() {
    // define action on modal close here
  }

  confirmYes() {
    this.setState({ openConfirm: false })
    this.props.handleYes(this.props.bookId)
  }

  confirmNo() {
    // this.setState( {openConfirm : false});
    this.props.handleNo()
  }

  render() {
    const { darkProfile } = this.props
    const messages = defineMessages({
      defaultPositiveButtonContentMessage: {
        id: 'confirmDialogBox.defaultPositiveButtonContentMessage',
        defaultMessage: 'No'
      },
      defaultNegativeButtonContentMessage: {
        id: 'confirmDialogBox.defaultNegativeButtonContentMessage',
        defaultMessage: 'Yes'
      }
    })
    let positiveContentMessage = this.props.positiveContentMessage || (
      <FormattedMessage {...messages.defaultPositiveButtonContentMessage} />
    )
    let negativeContentMessage = this.props.negativeContentMessage || (
      <FormattedMessage {...messages.defaultNegativeButtonContentMessage} />
    )
    return (
      <div>
        <Modal open={this.props.openModalProp} size="mini" onClose={this.close}>
          <Header inverted={darkProfile} content={this.props.HeadingText} />
          <Modal.Content>
            <p>{this.props.MessageText}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button
              positive
              content={positiveContentMessage}
              onClick={this.confirmNo}
            />
            <Button
              negative
              content={negativeContentMessage}
              loading={this.props.loader}
              onClick={this.confirmYes}
            />
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}
export default injectIntl(ConfirmDialogBox)

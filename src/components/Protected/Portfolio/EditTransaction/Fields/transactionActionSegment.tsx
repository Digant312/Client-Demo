import React from 'react'
import { SubmitHandler } from 'redux-form'
import { Button, Modal, Segment } from 'semantic-ui-react'
import { FormattedMessage, defineMessages } from 'react-intl'

import { ITransactionActionMapStateProps } from 'containers/Protected/Portfolio/EditTransaction/Fields/transactionActionSegment'

export interface ITransactionActionSegmentOwnProps {
  formActionInProgress?: boolean
  handleSubmit: (e: any) => void
  handleCancel: (e: any) => void
  pristine?: boolean
  submitLabel: string | JSX.Element
  type: 'New' | 'Edit' | 'ReadOnly'
}

interface ITransactionActionSegmentState {
  cancelModalOpen: boolean
}

const transactionActionMessages = defineMessages({
  cancelLabel: {
    id: 'transactionAction.cancelLabel',
    defaultMessage: 'Cancel Transaction'
  }
})

export default class TransactionActionSegment extends React.Component<
  ITransactionActionSegmentOwnProps & ITransactionActionMapStateProps,
  ITransactionActionSegmentState
> {
  constructor() {
    super()
    this.state = {
      cancelModalOpen: false
    }
    this.handleCancel = this.handleCancel.bind(this)
    this.toggleCancelModal = this.toggleCancelModal.bind(this)
  }

  toggleCancelModal() {
    this.setState({ cancelModalOpen: !this.state.cancelModalOpen })
  }

  handleCancel(e: any) {
    this.toggleCancelModal()
    this.props.handleCancel(e)
  }

  render() {
    const { props, state } = this
    return (
      <Segment inverted={props.darkProfile}>
        <Button
          color="green"
          disabled={props.formActionInProgress || props.pristine}
          loading={props.formActionInProgress}
          onClick={props.handleSubmit}
        >
          {props.submitLabel}
        </Button>
        {props.type === 'Edit' ? (
          <Button
            disabled={props.formActionInProgress}
            loading={props.formActionInProgress}
            color="red"
            onClick={this.toggleCancelModal}
          >
            <FormattedMessage {...transactionActionMessages.cancelLabel} />
          </Button>
        ) : null}
        <CancelModal
          darkProfile={props.darkProfile}
          formActionInProgess={props.formActionInProgress}
          open={state.cancelModalOpen}
          toggleCancelModal={this.toggleCancelModal}
          handleCancelTransaction={this.handleCancel}
        />
      </Segment>
    )
  }
}

const transactionCancelModalMessages = defineMessages({
  header: {
    id: 'transactionCancelModal.header',
    defaultMessage: 'Cancel Transaction'
  },
  firstContentBlock: {
    id: 'transactionCancelModal.firstContent',
    defaultMessage:
      'Cancelling a Transaction is a permanent action. You will need to re-book the Transaction for it to be active.'
  },
  secondContentBlock: {
    id: 'transactionCancelModal.secondContent',
    defaultMessage:
      'You can still view cancelled Transactions, but they will not contribute to your Positions.'
  },
  dontCancelLabel: {
    id: 'transactionCancelModal.dontCancelLabel',
    defaultMessage: "Don't Cancel"
  },
  cancelLabel: {
    id: 'transactionCancelModal.cancelLabel',
    defaultMessage: 'Cancel Transaction'
  }
})

const CancelModal = (props: {
  darkProfile: boolean
  formActionInProgess?: boolean
  open: boolean
  toggleCancelModal: () => void
  handleCancelTransaction: (e: any) => void
}) => (
  <Modal open={props.open} size="tiny">
    <Segment.Group>
      <Segment inverted={props.darkProfile}>
        <h3>
          <FormattedMessage {...transactionCancelModalMessages.header} />
        </h3>
      </Segment>
      <Segment inverted={props.darkProfile}>
        <p>
          <FormattedMessage
            {...transactionCancelModalMessages.firstContentBlock}
          />
        </p>
        <p>
          <FormattedMessage
            {...transactionCancelModalMessages.secondContentBlock}
          />
        </p>
      </Segment>
      <Segment inverted={props.darkProfile}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            color="green"
            disabled={props.formActionInProgess}
            loading={props.formActionInProgess}
            onClick={props.toggleCancelModal}
          >
            <FormattedMessage
              {...transactionCancelModalMessages.dontCancelLabel}
            />
          </Button>
          <Button
            color="red"
            disabled={props.formActionInProgess}
            loading={props.formActionInProgess}
            onClick={props.handleCancelTransaction}
          >
            <FormattedMessage {...transactionCancelModalMessages.cancelLabel} />
          </Button>
        </div>
      </Segment>
    </Segment.Group>
  </Modal>
)

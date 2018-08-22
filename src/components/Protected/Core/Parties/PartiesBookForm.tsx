import React, { Component } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Form, Grid, Segment, Button } from 'semantic-ui-react'
import { Field, reduxForm } from 'redux-form'
import Input from 'containers/Shared/CompactInput/'
import messages from 'utils/form/BookConfig/messages'
import FormBuilder from 'containers/Shared/FormBuilder'
import { IConfigInterface } from 'components/Shared/FormBuilder'
import bookFormConfig from 'utils/form/BookConfig'

var modifiedRowData: any = {}
const filterConfig = (config: IConfigInterface) => {
  const { name } = config
  return name === 'bookId' || name === 'description' || name === 'bookType'
}
// BookForm component creates Book form
class PartiesBookForm extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }
  componentDidMount() {
    var rowData: any
    rowData = this.props.rowData
    const {
      partyId,
      permbookType,
      assetManagerId,
      closeTime,
      timezone
    } = rowData
    const data = {
      partyId: rowData.partyId,
      bookType: 'Counterparty',
      closeTime,
      timezone
    }
    this.props.initialize && this.props.initialize(data)
  }
  render() {
    const { darkProfile, handleSubmit, pristine, submitting } = this.props
    const { displayName, description } = this.props.rowData
    let formConfig: IConfigInterface[]
    formConfig = bookFormConfig().filter(filterConfig)
    return (
      <div className="">
        <Form className="" onSubmit={handleSubmit} inverted={darkProfile}>
          <Segment.Group size="tiny">
            <Segment inverted={darkProfile}>
              <h3>{this.props.HeadingText}</h3>
            </Segment>
            <Segment inverted={darkProfile}>
              <div className="column-inner-row">
                <div className="column-inner-column">
                  <h4>
                    <FormattedMessage {...messages.displayName} />
                  </h4>
                </div>
                <div className="column-inner-column">
                  <h4> {displayName || description} </h4>
                </div>
              </div>
              <FormBuilder formConfig={formConfig} columnNumber={1} />
            </Segment>
            <Segment inverted={darkProfile} style={{ textAlign: 'right' }}>
              <Button
                negative
                type="reset"
                onClick={this.props.onCancel}
                style={{ marginRight: '15px', display: 'inline-block' }}
              >
                {this.props.cancelButtonLabel}
              </Button>
              <Button positive type="submit">
                {this.props.submitButtonLabel}
              </Button>
            </Segment>
          </Segment.Group>
        </Form>
      </div>
    )
  }
}

const IntlPartiesBookForm = injectIntl(PartiesBookForm)

export default reduxForm({
  form: 'parties-book-form' // a unique identifier for this form
})(IntlPartiesBookForm)

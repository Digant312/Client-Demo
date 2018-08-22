import React from 'react'
import isEmpty from 'lodash/isEmpty'
import { RouteComponentProps } from 'react-router-dom'
import { Field, FormProps, reduxForm } from 'redux-form'
import { DropdownItemProps, Form, Message, Progress } from 'semantic-ui-react'

import Layout from 'containers/Shared/Layouts/Public'
import Input from 'components/Shared/Input'
import CheckBox from 'containers/Shared/CheckBox'
import Select from 'components/Shared/Select'
import { required } from 'utils/form'

interface INewCoProps extends FormProps<{}, {}, {}> {
  regulatedChoice: { unregulatedCompany: boolean; regulatedCompany: boolean }
  creating: boolean
  newCompanyError: string
  progress?: number
}

const options: DropdownItemProps[] = [
  { text: 'Bank', value: 'Bank' },
  { text: 'Broker', value: 'Broker' },
  { text: 'Corporate Treasury', value: 'Corporate Treasury' },
  { text: 'Family Office', value: 'Family Office' },
  { text: 'Fund Administrator', value: 'Fund Administrator' },
  { text: 'Fund Manager', value: 'Fund Manager' },
  { text: 'Hedge Fund', value: 'Hedge Fund' },
  { text: 'Private Equity', value: 'Private Equity' },
  { text: 'Venture Capital', value: 'Venture Capital' }
]

class NewCompany extends React.Component<
  INewCoProps & RouteComponentProps<{}>
> {
  componentWillReceiveProps(nextProps: INewCoProps) {
    if (
      !this.props.regulatedChoice ||
      !nextProps.regulatedChoice ||
      isEmpty(this.props.regulatedChoice) ||
      isEmpty(nextProps.regulatedChoice)
    )
      return
    let isRegulatedChanged =
      this.props.regulatedChoice.regulatedCompany !==
      nextProps.regulatedChoice.regulatedCompany
    let isUnregulatedChanged =
      this.props.regulatedChoice.unregulatedCompany !==
      nextProps.regulatedChoice.unregulatedCompany
    if (isRegulatedChanged && nextProps.change) {
      nextProps.change(
        'unregulatedCompany',
        !nextProps.regulatedChoice.regulatedCompany
      )
    }

    if (isUnregulatedChanged && nextProps.change) {
      nextProps.change(
        'regulatedCompany',
        !nextProps.regulatedChoice.unregulatedCompany
      )
    }
  }
  render() {
    return (
      <Layout>
        <Form onSubmit={this.props.handleSubmit}>
          <Field
            name="unregulatedCompany"
            component={CheckBox}
            type="checkbox"
            label={<label style={{ color: '#95bc49' }}>Unregulated</label>}
            normalize={(val: string | boolean) => !!val}
          />
          <Field
            name="regulatedCompany"
            component={CheckBox}
            type="checkbox"
            label={<label style={{ color: '#95bc49' }}>Regulated</label>}
            normalize={(val: string | boolean) => !!val}
          />
          <Field
            name="companyName"
            component={Input}
            type="text"
            validate={required}
            title="Company Name"
          />
          <div style={{ height: '20px' }} />
          <Field
            name="companyType"
            component={Select}
            validate={required}
            options={options}
            placeholder="Company Type"
          />
          <div style={{ height: '50px' }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Form.Button
              type="submit"
              color="green"
              disabled={this.props.creating}
              loading={this.props.creating}
            >
              Next
            </Form.Button>
          </div>
          {this.props.newCompanyError ? (
            <p>{this.props.newCompanyError}</p>
          ) : null}
          {this.props.progress ? (
            <div style={{ marginTop: '10px' }}>
              <Progress
                color="green"
                size="small"
                percent={this.props.progress || 0}
              />
              We are setting up your account, this may take up to a minute.
            </div>
          ) : null}
        </Form>
        <Message color="green">
          <Message.Header>Your email address has been verified</Message.Header>
          <br />
          <p>
            Welcome! Looks like you are the first user from your company. In
            order to set up a new company on Argomi, please enter your company
            name and the appropriate company type. Please also indicate whether
            your company is regulated in your jurisdiction.
          </p>
        </Message>
      </Layout>
    )
  }
}

const WrappedForm = reduxForm({
  form: 'newCompany'
})(NewCompany)

export default (props: INewCoProps & RouteComponentProps<{}>) => (
  <WrappedForm {...props} />
)

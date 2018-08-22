import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Field, reduxForm, FormProps } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import {
  Button,
  Form,
  Message,
  Popup,
  Progress,
  Segment
} from 'semantic-ui-react'

import CheckBox from 'containers/Shared/CheckBox'
import Layout from 'containers/Shared/Layouts/Public'
import messages from './messages'

interface ITandCProps extends RouteComponentProps<{}>, FormProps<{}, {}, {}> {
  newCompanyError: string
  creating: boolean
  progress?: number
}

const TermsAndConditions = (props: ITandCProps) => {
  let showOutsourcing = false
  if (props.location.state.regulated) showOutsourcing = true

  return (
    <Layout>
      <div>
        <Form onSubmit={props.handleSubmit}>
          <Field
            name="termsAndConditions"
            component={CheckBox}
            type="checkbox"
            fieldLabel={
              <a target="_blank" href="http://www.argomi.com/legal/terms">
                Terms and Conditions
              </a>
            }
            normalize={(val: string | boolean) => !!val}
          />
          <Field
            name="privacyPolicy"
            component={CheckBox}
            type="checkbox"
            fieldLabel={
              <a target="_blank" href="http://www.argomi.com/legal/privacy">
                Privacy Policy
              </a>
            }
            normalize={(val: string | boolean) => !!val}
          />
          {showOutsourcing ? (
            <Field
              name="outsourcingGuidelines"
              component={CheckBox}
              type="checkbox"
              fieldLabel={
                <a
                  target="_blank"
                  href="http://www.argomi.com/legal/outsourcing"
                >
                  Outsourcing Guidelines
                </a>
              }
              normalize={(val: string | boolean) => !!val}
            />
          ) : null}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Form.Button color="red" disabled={props.creating}>
              Do not agree
            </Form.Button>
            <Form.Button type="submit" color="green" disabled={props.creating}>
              Agree
            </Form.Button>
          </div>
        </Form>

        {props.progress ? (
          <div style={{ marginTop: '10px' }}>
            <Progress
              color="green"
              size="small"
              percent={props.progress || 0}
            />
            We are setting up your account, this may take up to a minute.
          </div>
        ) : null}
        {props.newCompanyError ? (
          <Message error>{props.newCompanyError}</Message>
        ) : null}
      </div>
      <Message color="green">
        {showOutsourcing ? (
          <FormattedMessage {...messages.regulatedInstructions} />
        ) : (
          <FormattedMessage {...messages.unregulatedInstructions} />
        )}
      </Message>
    </Layout>
  )
}

export default reduxForm({ form: 'termsAndConditionsForm' })(TermsAndConditions)

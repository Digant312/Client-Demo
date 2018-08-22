import React from 'react'
import { Field, FieldArrayMetaProps } from 'redux-form'
import { Button, Grid } from 'semantic-ui-react'
import { parties } from '@amaas/amaas-core-sdk-js'

import Input from 'containers/Shared/CompactInput'
import Dropdown from 'containers/Shared/Dropdown'
import TextArea from 'containers/Shared/CompactTextArea'
import CheckBox from 'containers/Shared/CheckBox'
import PartyDropdown from 'containers/Shared/PartyDropdown'
import { normaliseCurrency, required } from 'utils/form'

interface IMapStateProps {}
interface IFormChildFieldsState {
  partyDropdownOpen: number
}

class FormChildFields extends React.Component<
  {
    fields: any
    meta: FieldArrayMetaProps
    type: string
    valueKey: string
    label?: string
    readOnly?: boolean
  },
  IFormChildFieldsState
> {
  mounted: boolean
  constructor() {
    super()
    this.state = {
      partyDropdownOpen: -1
    }
  }
  componentDidMount() {
    this.mounted = true
  }
  componentWillUnmount() {
    this.mounted = false
  }

  togglePartyDropdownOpen(index: number) {
    if (this.mounted) this.setState({ partyDropdownOpen: index })
  }

  render() {
    const { partyDropdownOpen } = this.state
    const { fields, type, valueKey, label, readOnly } = this.props
    return (
      <div>
        {fields.map((member: any, i: number) => {
          const fieldValue = fields.get(i) ? fields.get(i)[valueKey] : null
          return (
            <div key={member}>
              <div className="column-inner-row">
                {readOnly ? null : (
                  <div className="column-inner-column compact">
                    <Button
                      basic
                      compact
                      color="red"
                      size="mini"
                      icon="trash outline"
                      onClick={e => {
                        e.preventDefault()
                        fields.remove(i)
                      }}
                    />
                  </div>
                )}
                <div className="column-inner-column">
                  <Field
                    name={`${member}.name`}
                    component={Input}
                    readOnly={readOnly}
                  />
                </div>
                <div
                  style={{ flex: partyDropdownOpen === i ? '3' : '' }}
                  className="column-inner-column"
                >
                  {type === 'Party' ? (
                    <Field
                      name={`${member}.${valueKey}`}
                      component={PartyDropdown}
                      onOpen={() => this.togglePartyDropdownOpen(i)}
                      onClose={() => this.togglePartyDropdownOpen(-1)}
                      readOnly={readOnly}
                    />
                  ) : (
                    <Field
                      name={`${member}.${valueKey}`}
                      component={type === 'Comment' ? TextArea : Input}
                      format={
                        type === 'Charge' || type === 'Rate' ? (
                          normaliseCurrency
                        ) : null
                      }
                      label={type === 'Charge' && label ? label : undefined}
                      readOnly={readOnly}
                      validate={[required]}
                    />
                  )}
                </div>
                {type === 'Charge' ? (
                  <div className="column-inner-column compact">
                    <Field
                      name={`${member}.netAffecting`}
                      component={CheckBox}
                      type="checkbox"
                      normalize={(val: string | boolean) => !!val}
                      readOnly={readOnly}
                    />
                  </div>
                ) : null}
                {type === 'Email' ? (
                  <div className="column-inner-column compact">
                    <Field
                      name={`${member}.emailPrimary`}
                      component={CheckBox}
                      type="checkbox"
                      normalize={(val: string | boolean) => !!val}
                      readOnly={readOnly}
                    />
                  </div>
                ) : null}
                {type === 'Phone Number' ? (
                  <div className="column-inner-column compact">
                    <Field
                      name={`${member}.phoneNumberPrimary`}
                      component={CheckBox}
                      type="checkbox"
                      normalize={(val: string | boolean) => !!val}
                      readOnly={readOnly}
                    />
                  </div>
                ) : null}
                {type === 'Reference' ? (
                  <div className="column-inner-column compact">
                    <Field
                      name={`${member}.referencePrimary`}
                      component={CheckBox}
                      type="checkbox"
                      normalize={(val: string | boolean) => !!val}
                      readOnly={readOnly}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          )
        })}
        <div className="column-inner-row">
          {readOnly ? null : (
            <div className="column-inner-column">
              <Button
                basic
                compact
                fluid
                color="green"
                size="mini"
                onClick={e => {
                  e.preventDefault()
                  fields.push({})
                }}
              >
                {`Add ${type}`}
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default (props: {
  fields: any
  meta: FieldArrayMetaProps
  type: string
  valueKey: string
}) => <FormChildFields {...props} />

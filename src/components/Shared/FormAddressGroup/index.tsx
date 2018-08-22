import React from 'react'
import { Field, FieldArrayMetaProps } from 'redux-form'
import { Accordion, Button, Grid, Icon } from 'semantic-ui-react'

import Input from 'containers/Shared/CompactInput'
import CheckBox from 'containers/Shared/CheckBox'
import CountryDropdown from 'components/Shared/CountryDropdown'
import { required } from 'utils/form'
import AccordionWrapper from 'components/Shared/AccordionWrapper'

export default ({
  fields,
  meta,
  type,
  darkProfile,
  readOnly
}: {
  fields: any
  meta: FieldArrayMetaProps
  type: string
  darkProfile: boolean
  readOnly?: boolean
}) => {
  return (
    <div>
      {fields.map((member: any, i: number) => {
        return (
          <AccordionWrapper key={i}>
            {({ activeIndex, handleChangeIndex }) => (
              <Accordion fluid key={i} inverted={darkProfile}>
                <Accordion.Title
                  index={i}
                  active={activeIndex === i}
                  onClick={handleChangeIndex}
                >
                  <div className="column-inner-row">
                    <div className="column-inner-column compact">
                      <Icon name="dropdown" />
                    </div>
                    <div className="column-inner-column">
                      <Field
                        name={`${member}.name`}
                        component={Input}
                        validate={[required]}
                        readOnly={readOnly}
                      />
                    </div>
                    {!readOnly ? (
                      <div className="column-inner-column compact">
                        <Button
                          basic
                          compact
                          color="red"
                          size="mini"
                          onClick={e => {
                            e.preventDefault()
                            fields.remove(i)
                          }}
                        >
                          Delete Address
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </Accordion.Title>
                <Accordion.Content active={activeIndex === i}>
                  <div className="links-group-container">
                    <div className="column-inner-row">
                      <div className="column-inner-column">Primary Address</div>
                      <div className="column-inner-column">
                        <Field
                          name={`${member}.addressPrimary`}
                          component={CheckBox}
                          type="checkbox"
                          readOnly={readOnly}
                          normalize={(val: string | boolean) => !!val}
                        />
                      </div>
                    </div>
                    <div className="column-inner-row">
                      <div className="column-inner-column">Line One</div>
                      <div className="column-inner-column">
                        <Field
                          name={`${member}.lineOne`}
                          component={Input}
                          readOnly={readOnly}
                          validate={[required]}
                        />
                      </div>
                    </div>
                    <div className="column-inner-row">
                      <div className="column-inner-column">Line Two</div>
                      <div className="column-inner-column">
                        <Field
                          name={`${member}.lineTwo`}
                          component={Input}
                          readOnly={readOnly}
                        />
                      </div>
                    </div>
                    <div className="column-inner-row">
                      <div className="column-inner-column">City</div>
                      <div className="column-inner-column">
                        <Field
                          name={`${member}.city`}
                          component={Input}
                          readOnly={readOnly}
                          validate={[required]}
                        />
                      </div>
                    </div>
                    <div className="column-inner-row">
                      <div className="column-inner-column">Region</div>
                      <div className="column-inner-column">
                        <Field
                          name={`${member}.region`}
                          component={Input}
                          readOnly={readOnly}
                        />
                      </div>
                    </div>
                    <div className="column-inner-row">
                      <div className="column-inner-column">Postal Code</div>
                      <div className="column-inner-column">
                        <Field
                          name={`${member}.postalCode`}
                          component={Input}
                          readOnly={readOnly}
                          validate={[required]}
                        />
                      </div>
                    </div>
                    <div className="column-inner-row">
                      <div className="column-inner-column">Country ID</div>
                      <div className="column-inner-column">
                        <Field
                          name={`${member}.countryId`}
                          component={CountryDropdown}
                          readOnly={readOnly}
                          validate={[required]}
                        />
                      </div>
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion>
            )}
          </AccordionWrapper>
        )
      })}
      <div className="column-inner-row">
        {!readOnly ? (
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
              Add Address
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

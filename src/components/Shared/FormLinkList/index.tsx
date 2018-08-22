import React from 'react'
import isEmpty from 'lodash/isEmpty'
import { Field, FieldArray, FieldArrayMetaProps } from 'redux-form'
import { Accordion, Button, Divider, Icon } from 'semantic-ui-react'
import { transactions } from '@amaas/amaas-core-sdk-js'

import Dropdown from 'containers/Shared/Dropdown'
import AssetDropdown from 'containers/Shared/AssetDropdown'
import PartyDropdown from 'containers/Shared/PartyDropdown'
import AccordionWrapper from 'components/Shared/AccordionWrapper'

export interface ILinkListBaseProps {
  fields: any
  meta: FieldArrayMetaProps
  type: string
  accessor: string
}

export interface IDropdownOptions {
  key?: string | number
  text: string | number
  value: string | number
}

const LinkListBase = ({
  fields,
  meta,
  type,
  accessor,
  darkProfile,
  readOnly
}: ILinkListBaseProps & { darkProfile: boolean; readOnly?: boolean }) => {
  const selectDropdownType = (type: string) => {
    switch (type) {
      case 'assets':
        return AssetDropdown
      case 'parties':
        return PartyDropdown
      case 'transactions':
        return () => <div>No Transactions Dropdown yet</div>
      default:
    }
  }
  return (
    <div>
      <AccordionWrapper>
        {({ activeIndex, handleChangeIndex }) => (
          <Accordion fluid inverted={darkProfile}>
            <Accordion.Title
              className="links"
              index={0}
              active={activeIndex === 0}
              onClick={handleChangeIndex}
            >
              <Icon name="dropdown" />
              {`${fields.length} Links`}
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 0}>
              <div className="links-group-container">
                {fields.map((link: any, i: number) => {
                  const initialValue = fields.get(i)
                  const initialOptions = isEmpty(initialValue)
                    ? []
                    : [
                        {
                          key: 0,
                          text: initialValue[accessor],
                          value: initialValue[accessor]
                        }
                      ]
                  return (
                    <div key={i} className="link-group">
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
                          name={`${link}.${accessor}`}
                          component={selectDropdownType(type)}
                          compact={false}
                          initialOptions={initialOptions}
                          readOnly={readOnly}
                        />
                      </div>
                    </div>
                  )
                })}
                {readOnly ? null : (
                  <div className="add-link-btn">
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
                      Add Link
                    </Button>
                  </div>
                )}
                <Divider />
              </div>
            </Accordion.Content>
          </Accordion>
        )}
      </AccordionWrapper>
    </div>
  )
}

export default LinkListBase

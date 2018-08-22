import React from 'react'
import { Field, FieldArray, FieldArrayMetaProps } from 'redux-form'
import { Button, Grid } from 'semantic-ui-react'

import Input from 'containers/Shared/CompactInput'
import TransactionLinkList from 'components/Shared/TransactionLinkList'
import AssetLinkList from 'components/Shared/AssetLinkList'
import PartyLinkList from 'components/Shared/PartyLinkList'
import { required } from 'utils/form'

export default ({
  fields,
  meta,
  type,
  valueKey,
  readOnly
}: {
  fields: any
  meta: FieldArrayMetaProps
  type?: string
  valueKey?: string
  readOnly?: boolean
}) => {
  const checkLinkType = () => {
    switch (type) {
      case 'assets':
        return AssetLinkList
      case 'parties':
        return PartyLinkList
      case 'transactions':
        return TransactionLinkList
      default:
        return () => null
    }
  }
  return (
    <div>
      {fields.map((member: any, i: number) => {
        return (
          <div key={i}>
            <div className="column-inner-row">
              <div className="column-inner-column">
                <Field
                  name={`${member}.name`}
                  component={Input}
                  readOnly={readOnly}
                  validate={[required]}
                />
              </div>
              {readOnly ? null : (
                <div className="column-inner-column">
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
                    Delete Link Set
                  </Button>
                </div>
              )}
            </div>
            <div className="column-inner-row">
              <div className="column-inner-column">
                <FieldArray
                  name={`${member}.links`}
                  component={checkLinkType()}
                  readOnly={readOnly}
                />
              </div>
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
              Add Link Set
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

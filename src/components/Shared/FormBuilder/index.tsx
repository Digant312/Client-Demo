import React from 'react'
import { Field, FieldArray } from 'redux-form'
import {
  DropdownItemProps,
  Grid,
  Label,
  SemanticWIDTHSNUMBER
} from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'

export interface IConfigInterface {
  name: string
  component: React.ComponentType<any>
  type?: string
  options?: DropdownItemProps[]
  validate?: any[]
  normalize?: Function
  valueKey?: string
  normal?: boolean
  label: { id: string; defaultMessage: string }
  extraLabel?: { id: string; defaultMessage: string }
  fieldArray?: boolean
  readOnly?: boolean
  [componentProps: string]: any
}

export default (props: {
  formConfig: IConfigInterface[]
  columnNumber?: SemanticWIDTHSNUMBER
  readOnly?: boolean
  darkProfile: boolean
}) => {
  let { formConfig, columnNumber } = props
  const resolvedColumnNumber = columnNumber || 3

  // Strip out the child fields
  const nonChildFields = formConfig.filter(config => {
    return (
      config.name !== 'comments' &&
      config.name !== 'links' &&
      config.name !== 'references' &&
      config.name !== 'addresses' &&
      config.name !== 'emails' &&
      config.name !== 'phoneNumbers'
    )
  })

  // Grab the individual child fields
  let commentsField = formConfig.filter(config => {
    return config.name === 'comments'
  })
  commentsField = commentsField.length > 0 ? commentsField : []

  let linksField = formConfig.filter(config => {
    return config.name === 'links'
  })
  linksField = linksField.length > 0 ? linksField : []

  let referencesField = formConfig.filter(config => {
    return config.name === 'references'
  })
  referencesField = referencesField.length > 0 ? referencesField : []

  let addressesField = formConfig.filter(config => {
    return config.name === 'addresses'
  })
  addressesField = addressesField.length > 0 ? addressesField : []

  let emailsField = formConfig.filter(config => {
    return config.name === 'emails'
  })
  emailsField = emailsField.length > 0 ? emailsField : []

  let phoneNumbersField = formConfig.filter(config => {
    return config.name === 'phoneNumbers'
  })
  phoneNumbersField = phoneNumbersField.length > 0 ? phoneNumbersField : []

  // Calculate the number of fields per column (without children)
  const equalFieldsPerCol = Math.floor(
    nonChildFields.length / resolvedColumnNumber
  )

  // Calculate the number of remainder fields (0 <= x < no. of columns)
  const remainderFields = nonChildFields.length % resolvedColumnNumber

  // Fill the remainder fields up from left to right
  const fieldsPerCol = (fieldCount: number) => [
    0,
    ...new Array(resolvedColumnNumber - 1).fill(0).map((el, i) => {
      return fieldCount * (i + 1)
    })
  ]

  const rowsPerCol = (fieldCount: number) =>
    new Array(resolvedColumnNumber).fill(0).map((el, i) => {
      return fieldCount
    })
  const rowsPerColWithRemainder = (arr: any[], remainder: number) =>
    arr.map((el, i) => {
      if (remainder > i) return el + 1
      return el
    })
  const sliceConfig = (rows: any[]) =>
    rows
      .reduce(
        (arr, curr) => {
          arr.push(arr.slice(-1)[0] + curr)
          return arr
        },
        [0]
      )
      .slice(0, -1)

  const nonChildColumnConfig = rowsPerCol(equalFieldsPerCol)
  const childColumnConfig = rowsPerColWithRemainder(
    nonChildColumnConfig,
    remainderFields
  )
  const childSliceConfig = sliceConfig(childColumnConfig)

  const childFields = [
    commentsField,
    linksField,
    referencesField,
    addressesField,
    emailsField,
    phoneNumbersField
  ]
  const resolvedChildFields = childFields.filter(el => el.length > 0)
  const childFieldsPerCol = Math.floor(
    resolvedChildFields.length / resolvedColumnNumber
  )
  const childRemainders = resolvedChildFields.length % resolvedColumnNumber

  const remainderNonChildColumnConfig = rowsPerCol(childFieldsPerCol)
  const remainderChildColumnConfig = rowsPerColWithRemainder(
    remainderNonChildColumnConfig,
    childRemainders
  )
  const remainderChildSliceConfig = sliceConfig(remainderChildColumnConfig)

  const mapToCol = (config: IConfigInterface, i: number) => {
    const {
      label,
      fieldArray,
      readOnly: configReadOnly,
      extraLabel,
      ...fieldProps
    } = config
    const { darkProfile, readOnly } = props
    const resolvedReadOnly = configReadOnly || readOnly
    return fieldArray ? (
      <span key={i}>
        <div className="column-inner-row">
          <div className="column-inner-column">
            {extraLabel ? (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4 style={{ margin: '0' }}>
                  <FormattedMessage {...label} />
                </h4>
                <Label
                  basic={!darkProfile}
                  color={darkProfile ? 'black' : 'grey'}
                  size="mini"
                >
                  <FormattedMessage {...extraLabel} />
                </Label>
              </div>
            ) : (
              <h4>
                <FormattedMessage {...label} />
              </h4>
            )}
          </div>
        </div>
        <div className="column-inner-column">
          <FieldArray {...fieldProps} readOnly={resolvedReadOnly} />
        </div>
      </span>
    ) : (
      <div className="column-inner-row" key={i}>
        <div className="column-inner-column">
          <label>
            <FormattedMessage {...label} />
          </label>
        </div>
        <div className="column-inner-column">
          <Field {...fieldProps} readOnly={resolvedReadOnly} />
        </div>
      </div>
    )
  }

  const columns = new Array(resolvedColumnNumber).fill(1).map((el, i) => {
    const resolvedChildMember = (i: number) => childFields[i] || []
    return (
      <Grid.Column key={i}>
        {nonChildFields
          .slice(childSliceConfig[i], childSliceConfig[i + 1])
          .concat(
            ...childFields.slice(
              remainderChildSliceConfig[i],
              remainderChildSliceConfig[i + 1]
            )
          )
          .map(mapToCol)}
      </Grid.Column>
    )
  })
  return (
    <Grid columns={resolvedColumnNumber} divided>
      <Grid.Row>{columns}</Grid.Row>
    </Grid>
  )
}

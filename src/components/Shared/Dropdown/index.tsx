import React from 'react'
import {
  FieldValue,
  WrappedFieldProps,
  WrappedFieldInputProps
} from 'redux-form'
import {
  Dropdown,
  DropdownItemProps,
  DropdownProps,
  Form,
  Icon,
  Label
} from 'semantic-ui-react'

export interface IConnectInjectedProps {
  darkProfile: boolean
  readOnly?: boolean
}

export default (
  props: WrappedFieldProps<{}> &
    DropdownProps &
    IConnectInjectedProps & { dispatch: Function }
) => {
  const {
    meta: { touched, error, warning },
    input,
    disabled,
    options,
    placeholder,
    loading,
    darkProfile,
    search,
    compact,
    onSearchChange,
    dispatch,
    normal,
    scrolling,
    readOnly,
    ...rest
  } = props
  const {
    value,
    onChange,
    onFocus,
    onBlur,
    ...inputRest
  } = input as WrappedFieldInputProps
  const className = `${darkProfile ? 'inverted' : ''} ${error && touched
    ? 'error'
    : ''}`
  const compactFlag = compact === false ? false : true
  const optionLengths = (options && options.length) || 0

  // For some reason, onChange is not called when blurring and therefore sometimes the value disappears after blurring
  const overloadedOnBlur = (e: any, { value }: { value: FieldValue }) => {
    onBlur(e)
    onChange(value)
  }

  const resolvedOptions = options || []
  const optionFromValue = resolvedOptions.find(
    option => option.value === value
  ) || { text: '', value: '' }

  // TODO: Change this inline style in the stylesheet. I think can safely assume we will never want this padding
  return readOnly ? (
    <div className="read-only-form-value">
      {optionFromValue.text || optionFromValue.value}
    </div>
  ) : (
    <Form.Field style={{ padding: '0' }} disabled={disabled}>
      <Dropdown
        className={className}
        search={onSearchChange ? search : true}
        selection
        compact={compactFlag}
        options={options || []}
        scrolling={optionLengths === 0 ? false : scrolling}
        placeholder={placeholder}
        loading={loading}
        onChange={(e, { value }: { value: FieldValue }) => onChange(value)}
        value={value}
        onSearchChange={onSearchChange}
        {...rest}
        onFocus={onFocus}
        onBlur={overloadedOnBlur}
        selectOnNavigation={false}
        {...inputRest}
      />
      {touched &&
        ((error && (
          <Label style={{ marginTop: '5px' }} basic color="red" size="tiny">
            {error}
          </Label>
        )) ||
          (warning && (
            <Label style={{ marginTop: '5px' }} basic color="red" size="tiny">
              {warning}
            </Label>
          )))}
    </Form.Field>
  )
}

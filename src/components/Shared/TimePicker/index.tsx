import React from 'react'
import { WrappedFieldProps, WrappedFieldInputProps } from 'redux-form'
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import moment from 'moment';    
import { Form, Icon } from 'semantic-ui-react'

const format = 'hh:mm:ss';

const now = moment().hour(0).minute(0);

interface ITimePickerProps {
  disabled?: boolean
  options?: any[]
  placeholder?: string
  loading?: boolean
  darkProfile: boolean
}

export default (props: WrappedFieldProps<{}> & ITimePickerProps & { dispatch: Function }) => {
  const { meta: { touched, error, warning }, input, disabled, options, placeholder, loading, darkProfile, ...rest } = props
  const { value, onChange, ...inputRest } = input as WrappedFieldInputProps
  const className = `${darkProfile ? 'inverted' : ''} ${(error && touched) ? 'error' : ''}`

  return <Form.Field style={{ padding: '0' }} disabled={disabled}>
    <TimePicker 
        showSecond={false}
        defaultValue={now}
        className="date-picker"
        onChange={onChange}
        format={format}
        use12Hours={false}
    />
  </Form.Field>
}
 
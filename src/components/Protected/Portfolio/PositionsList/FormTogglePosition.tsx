import React from 'react'
import { Form } from 'semantic-ui-react'
import { Field, reduxForm, FormProps } from 'redux-form'
import CheckBox from 'containers/Shared/CheckBox'


export interface IFormTogglePositionProps {
  label: string
  formStyles?: {}
  defaultChecked: boolean
}

export interface IDarkProfileProps {
  darkProfile: boolean
  togglePositionCheckBox: boolean  
}

class FormTogglePosition extends React.Component<IFormTogglePositionProps & IDarkProfileProps & FormProps<{ togglePositionCheckBox: boolean }, {}, {}>> {
  render() {
    const { label, darkProfile, formStyles, defaultChecked, togglePositionCheckBox } = this.props
    console.log(darkProfile)
    return (
      <Form 
        inverted={darkProfile}
        style={formStyles}
      >
        <Field
          name='togglePositionCheckBox'
          component={CheckBox}
          label={label}
          defaultChecked={defaultChecked}
        />
      </Form>
    )
  }
}

export default reduxForm({
  form: 'toggle-position-form',
  initialValues: { togglePositionCheckBox: true }
})(FormTogglePosition)
import React from 'react'
import { reduxForm, Field, FormProps } from 'redux-form'
import { Button, Form } from 'semantic-ui-react'
import moment, { Moment } from 'moment'

import Input from 'containers/Shared/CompactInput'
import { formatDate, convertToAMaaSDate, parseDate } from 'utils/form'
import DateInput from 'containers/Shared/DateInput'
import { dateFormats } from 'reducers/profile'

interface IDatePickerProps {
  fetchPositions: Function
  dateFormat: dateFormats
}

class DatePicker extends React.Component<
  FormProps<{}, {}, {}> & IDatePickerProps,
  any
> {
  constructor() {
    super()
    this.normaliseDate = this.normaliseDate.bind(this)
    this.selectDate = this.selectDate.bind(this)
    this.state = {
      initialDate: moment()
    }
  }
  componentDidMount() {
    const { initialize } = this.props
    const date = new Date()
    const initialDate = moment()
    if (initialize) {
      initialize({ positionDate: initialDate })
    }
  }

  normaliseDate(value: string, previousValue: string) {
    return formatDate(this.props.dateFormat)(value, previousValue)
  }

  selectDate(data: { positionDate: string }) {
    const convertedData = {
      ...data,
      positionDate: convertToAMaaSDate(this.props.dateFormat)(data.positionDate)
    }
    this.props.fetchPositions(convertedData)
  }

  render() {
    const { handleSubmit, fetchPositions, change } = this.props
    return (
      <Form
        size="tiny"
        onSubmit={
          handleSubmit
            ? handleSubmit((data: { positionDate: Moment }) => {
                const positionDate = data.positionDate.format('YYYY-MM-DD')
                fetchPositions({ ...data, positionDate })
              })
            : () => null
        }
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>Date</span>
          <span style={{ width: '100px', margin: '0 10px' }}>
            <Field name="positionDate" component={DateInput} />
          </span>
          <Button compact color="green">
            Go
          </Button>
          <Button
            basic
            compact
            color="blue"
            onClick={
              handleSubmit
                ? handleSubmit(data => {
                    const formData = {
                      positionDate: moment().format('YYYY-MM-DD')
                    }
                    change ? change('positionDate', moment()) : null
                    fetchPositions(formData)
                  })
                : () => null
            }
          >
            Today
          </Button>
        </div>
      </Form>
    )
  }
}

export default reduxForm({
  form: 'positionDatePicker'
})(DatePicker)

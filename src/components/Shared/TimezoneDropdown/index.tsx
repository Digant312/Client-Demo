import React from 'react'
import uniqBy from 'lodash/uniqBy'
import { WrappedFieldProps } from 'redux-form'
import { DropdownProps, DropdownItemProps } from 'semantic-ui-react'
import timezones from 'timezones.json'

import Dropdown from 'containers/Shared/Dropdown'

interface ITimezoneDropdownState {
  rawOptions: any[]
  options: DropdownItemProps[]
  loadingOptions: boolean
}

export default class TimezoneDropdown extends React.Component<WrappedFieldProps<{}> & DropdownProps, ITimezoneDropdownState> {
  constructor() {
    super()
    this.state = {
      rawOptions: [],
      options: [],
      loadingOptions: true
    }
  }
  
  componentDidMount() {
    this.setState({ loadingOptions: true, rawOptions: timezones })
    const options = this.parseOptions(timezones)
    this.setState({ options, loadingOptions: false })
  }

  parseOptions(coll: any[]) {
    const utcOption = {
      'text': 'UTC',
      'value': 'UTC',
      'abbr': 'UTC',
      'offset': 0,
      'content': '',
      'utc': ['UTC']
    }
    coll.push(utcOption)
    return uniqBy(coll
      .map(timezone => {
        if (!timezone.utc) return
        return timezone.utc
          .map((utc: any[]) => ({ text: utc, value: utc, content: <div>
            {timezone.text}<br />{utc}
          </div> }))
        })
      .filter(timezone => timezone)
      .reduce((arr: any, curr: any) => {
        return arr.concat(curr)
      }, []), (option: { value: string }) => option.value)
  }

  render() {
    return <Dropdown {...this.props} options={this.state.options} loading={this.state.loadingOptions} />
  } 
}
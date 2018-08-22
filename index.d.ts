declare module '*.json' {
  const value: any
  export default value
}

declare module 'json!*' {
  const value: any
  export default value
}

declare module 'react-table' {
  const reactTable: any
  export const ReactTableDefaults: any
  export default reactTable
}

declare module 'react-button' {
  const Button: any
  export default Button
}

declare module 'react-toastify' {
  const { ToastContainer, toast }: any
  export { ToastContainer, toast }
}

declare module 'rc-time-picker' {
  const TimePicker: any
  export default TimePicker
}

declare module 'timezones.json' {
  interface ITimezone {
    value: string
    abbr: string
    offset: number
    isdst: boolean
    text: string
    utc: string[]
  }
  const timezones: ITimezone[]
  export default timezones
}

declare module 'zE' {
  const zE: any
  export default zE
}

declare module 'react-file-drag-and-drop' {
  const FileDragAndDrop: any
  export default FileDragAndDrop
}

declare module 'react-dropzone' {
  const Dropzone: any
  export default Dropzone
}

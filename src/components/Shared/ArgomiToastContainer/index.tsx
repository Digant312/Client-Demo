import React from 'react'
import { ToastContainer, toast } from 'react-toastify'
import './index.scss'
import 'react-toastify/dist/ReactToastify.min.css'

export default () => (
  <ToastContainer hideProgressBar={true} newestOnTop={true} />
)

const toastOptions = {
  autoClose: 3000,
  type: toast.TYPE.SUCESS,
  className: 'argomi-toast',
  hideProgressBar: true,
  position: toast.POSITION.TOP_RIGHT,
  pauseOnHover: true,
  newestOnTop: true
}

const successOptions = {
  className: 'argomi-toast-success'
}
const errorOptions = {}

export const successToast = (text: string) => {
  toast.success(text, toastOptions)
}
export const errorToast = (text: string) => {
  toast.error(text, { ...toastOptions, autoClose: false })
}

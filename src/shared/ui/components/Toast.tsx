import React, { type ReactElement } from 'react'
import { ToastContainer } from 'react-toastify'

export interface ToastOption {
  text: string
  type: 'success' | 'error' | 'info'
}

interface ToastProps {
  id: string
}

const Toast = ({ id }: ToastProps): ReactElement => {
  return (
    <ToastContainer containerId={id} pauseOnHover={false} theme={'colored'} autoClose={1500} position={'bottom-right'}/>
  )
}

export default Toast

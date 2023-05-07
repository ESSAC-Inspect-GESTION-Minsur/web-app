import React, { type ReactElement } from 'react'
import { Navigate } from 'react-router-dom'

const Redirect = (): ReactElement => {
  return (
    <Navigate to='/inicio' />
  )
}

export default Redirect

import React, { type ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isAuthenticated } from '@/shared/config/store/features/auth-slice'

const RequireAuth = (): ReactElement => {
  const authenticated = useSelector(isAuthenticated)
  const location = useLocation()
  return (
    authenticated
      ? <Outlet />
      : <Navigate to='/login' state={{ from: location }} replace/>
  )
}

export default RequireAuth

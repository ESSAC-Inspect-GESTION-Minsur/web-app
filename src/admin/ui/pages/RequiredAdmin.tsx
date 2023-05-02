import { getCurrentUser } from '@/shared/config/store/features/auth-slice'
import React, { type ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const RequiredAdmin = (): ReactElement => {
  const user = useSelector(getCurrentUser)
  const location = useLocation()

  return (
    user.role === 'admin'
      ? <Outlet />
      : <Navigate to='/inicio' state={{ from: location }} replace />

  )
}

export default RequiredAdmin

import React, { type ReactElement } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import Header from './Header'
import { useSelector } from 'react-redux'

import { isAuthenticated } from '@/shared/config/store/features/auth-slice'

const Layout = (): ReactElement => {
  const authenticated = useSelector(isAuthenticated)
  const location = useLocation()
  return (
    <>
      <Header />

      {authenticated
        ? <Outlet />
        : <Navigate to='/login' state={{ from: location }} replace />
      }
    </>
  )
}

export default Layout

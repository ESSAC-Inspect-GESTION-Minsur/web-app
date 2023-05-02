import React, { type ReactElement } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { getCurrentUser, logout } from '@/shared/config/store/features/auth-slice'
import useMediaQuery from '@/shared/hooks/userMediaQuery'
import { DesktopUserOptions, MobileUserOptions } from './navbar-options/UserOptions'
import { DesktopAdminOptions } from './navbar-options/AdminOptions'

interface NavBarProps {
  divLinksClasses?: string
  extraLinkClasses?: string
  handleClick: () => void
}

interface Link {
  name: string
  to: string
}

const links: Link[] = [
  { name: 'Inicio', to: '/inicio' },
  { name: 'Checklist - Recorridos', to: '/recorridos' }
]

const NavBar = ({ divLinksClasses, extraLinkClasses, handleClick }: NavBarProps): ReactElement => {
  const dispatch = useDispatch()

  const handleLogout = (): void => {
    dispatch(logout({}))
    location.reload()
  }
  const isAboveSmallScreens = useMediaQuery('(min-width: 640px)')

  const currentUser = useSelector(getCurrentUser)
  return (
    <div className={`${divLinksClasses ?? ''}`} >
      {links.map(({ name, to }) => {
        return (
          <NavLink
            key={name}
            to={to}
            className={({ isActive }) =>
              ` py-3 font-m text-white px-6 sm:rounded-2xl md:py-1
              ${extraLinkClasses ?? ''} ${isActive ? 'bg-red' : ''}`
            }
            onClick={handleClick}
          >
            {name}
          </NavLink>
        )
      })}
      { isAboveSmallScreens && currentUser.role === 'admin' && <DesktopAdminOptions />}
      {isAboveSmallScreens ? <DesktopUserOptions handleLogout={handleLogout} /> : <MobileUserOptions handleClick={handleClick} handleLogout={handleLogout} />}
    </div>

  )
}

export default NavBar

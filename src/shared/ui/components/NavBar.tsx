import React, { useState, type ReactElement, useEffect, Fragment } from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

import { getCurrentUser } from '@/shared/config/store/features/auth-slice'
import useMediaQuery from '@/shared/hooks/useMediaQuery'
import UserCircleIcon from '@/shared/ui/assets/icons/UserCircleIcon'
import UserIcon from '@/shared/ui/assets/icons/UserIcon'
import ArrowDown from '@/shared/ui/assets/icons/ArrowDown'
import ReportIcon from '@/shared/ui/assets/icons/ReportIcon'
import FieldIcon from '@/shared/ui/assets/icons/FieldIcon'
import VehicleIcon from '@/shared/ui/assets/icons/VehicleIcon'
import MaterialIcon from '@/shared/ui/assets/icons/MaterialIcon'

import { type UserRole } from '@/users/models/enum/role.enum'

import DropDown, { type DropdownLink } from './Dropdown'
import MobileDropDown from './MobileDropdown'

interface NavBarProps {
  extraLinkClasses?: string
  handleClick: () => void
}

interface NavbarLink {
  name: string
  isDropdown: boolean
  isLogout?: boolean
  icon?: ReactElement
  to: string
  subLinks?: DropdownLink[]
}

const defaultLinks: NavbarLink[] = [
  { name: 'Inicio', to: '/inicio', isDropdown: false }
]

const profileLinks: NavbarLink[] = [
  {
    name: 'User',
    to: '/users',
    isDropdown: true,
    isLogout: true,
    icon: <UserCircleIcon className='w-8 h-8 text-white' />,
    subLinks: [
      // { name: 'Perfil', to: 'perfil', icon: <EyeIcon className='w-5 h-5' /> }
    ]
  }
]

const roleLinks: Record<UserRole, NavbarLink[]> = {
  admin: [
    { name: 'Checklist - Recorridos', to: '/recorridos', isDropdown: false },
    {
      name: 'Entidades',
      to: '/admin',
      isDropdown: true,
      subLinks: [
        { name: 'M. Usuarios', to: 'usuarios', icon: <UserIcon className='w-5 h-5' /> },
        { name: 'Empresas', to: 'empresas', icon: <MaterialIcon className='w-5 h-5'/> }
      ]
    },
    {
      name: 'Checklist',
      to: '/admin',
      isDropdown: true,
      subLinks: [
        { name: 'M. Grupo Checklists', to: 'grupos-reportes', icon: <MaterialIcon className='w-5 h-5'/> },
        { name: 'M. Checklist', to: 'reportes', icon: <ReportIcon className='w-5 h-5' /> },
        { name: 'M. Campos Checklist', to: 'campos', icon: <FieldIcon className='w-5 h-5' /> }
      ]
    },
    {
      name: 'Vehículos',
      to: '/admin',
      isDropdown: true,
      subLinks: [
        { name: 'M. Tipo de Vehículo', to: 'tipo-vehiculos', icon: <VehicleIcon className='w-5 h-5' /> },
        { name: 'M. Vehículo', to: 'vehiculos', icon: <VehicleIcon className='w-5 h-5' /> },
        { name: 'M. Semirremolque', to: 'carretas', icon: <VehicleIcon className='w-5 h-5' /> },
        { name: 'M. Tipo de Materiales', to: 'tipo-materiales', icon: <MaterialIcon className='w-5 h-5' /> }
      ]
    }
  ],
  supervisor: [
    { name: 'Checklist - Recorridos', to: '/recorridos', isDropdown: false },
    {
      name: 'Entidades',
      to: '/admin',
      isDropdown: true,
      subLinks: [
        { name: 'M. Usuarios', to: 'usuarios', icon: <UserIcon className='w-5 h-5' /> },
        { name: 'Empresas', to: 'empresas', icon: <MaterialIcon className='w-5 h-5'/> }
      ]
    },
    {
      name: 'Checklist',
      to: '/admin',
      isDropdown: true,
      subLinks: [
        { name: 'M. Grupo Checklists', to: 'grupos-reportes', icon: <MaterialIcon className='w-5 h-5'/> },
        { name: 'M. Checklist', to: 'reportes', icon: <ReportIcon className='w-5 h-5' /> },
        { name: 'M. Campos Checklist', to: 'campos', icon: <FieldIcon className='w-5 h-5' /> }
      ]
    },
    {
      name: 'Vehículos',
      to: '/admin',
      isDropdown: true,
      subLinks: [
        { name: 'M. Tipo de Vehículo', to: 'tipo-vehiculos', icon: <VehicleIcon className='w-5 h-5' /> },
        { name: 'M. Vehículo', to: 'vehiculos', icon: <VehicleIcon className='w-5 h-5' /> },
        { name: 'M. Carretas', to: 'carretas', icon: <VehicleIcon className='w-5 h-5' /> },
        { name: 'M. Tipo de Materiales', to: 'tipo-materiales', icon: <MaterialIcon className='w-5 h-5' /> }
      ]
    }
  ],
  user: [
    { name: 'Checklist - Recorridos', to: '/recorridos', isDropdown: false }
  ]
}

const NavBar = ({ extraLinkClasses, handleClick }: NavBarProps): ReactElement => {
  const isAboveSmallScreens = useMediaQuery('(min-width: 700px)')

  const currentUser = useSelector(getCurrentUser)
  const [links, setLinks] = useState<NavbarLink[]>([])

  useEffect(() => {
    setLinks([...defaultLinks, ...roleLinks[currentUser?.role ?? 'user'], ...profileLinks])
  }, [])

  const menuIcon = (name: string): ReactElement => {
    return (
      <a className='text-gray-300 hover:text-white flex items-center gap-1'>
        {name}
        <ArrowDown className='w-5 h-5 mt-[2px]' />
      </a>
    )
  }

  return (
    <Fragment>
      {links.map(({ name, to, isDropdown, icon, subLinks = [], isLogout }) => {
        const subLinksWithFullTo = subLinks.map((link) => {
          return {
            ...link,
            to: `${to}/${link.to}`
          }
        })

        if (isDropdown) {
          if (!isAboveSmallScreens) {
            return (
            <MobileDropDown name={name} subLinks={subLinksWithFullTo} hasLogout={isLogout} key={name}/>
            )
          }

          return (
            <DropDown hasLogout={isLogout ?? false} items={subLinksWithFullTo} menu={icon ?? menuIcon(name)} key={name} />
          )
        }

        return (
          <NavLink
            key={name}
            to={to}
            className={({ isActive }) =>
              `font-m px-4 sm:px-1 md:px-2 py-1 md:py-0 transition-all hover:text-white hover:font-semibold md:grid place-items-center
              ${extraLinkClasses ?? ''} ${isActive ? 'text-white font-semibold' : 'text-gray-300'}`
            }
            onClick={handleClick}
          >
            {name}
          </NavLink>
        )
      })}
    </Fragment>

  )
}

export default NavBar

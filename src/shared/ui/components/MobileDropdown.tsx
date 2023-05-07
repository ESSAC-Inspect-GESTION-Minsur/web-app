import React, { useState, type ReactElement, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { logout } from '@/shared/config/store/features/auth-slice'
import ArrowDown from '@/shared/ui/assets/icons/ArrowDown'

import { type DropdownLink } from './Dropdown'

interface MobileDropDownProps {
  name: string
  subLinks: DropdownLink[]
  hasLogout?: boolean
}

const MobileDropdown = ({ name, subLinks, hasLogout }: MobileDropDownProps): ReactElement => {
  const dispatch = useDispatch()

  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = useCallback(() => {
    dispatch(logout({}))
    location.reload()
  }, [hasLogout])

  return (
    <div className='px-4 cursor-pointer'>
      <a
        onClick={() => { setIsOpen(!isOpen) }}
        className='text-gray-300 py-1 hover:text-white flex items-center gap-1'>
        {name}
        <ArrowDown className='w-5 h-5 mt-[2px]' />
      </a>
      <div style={{ maxHeight: isOpen ? '500px' : '0' }}
        className='overflow-hidden transition-max-height duration-300 ease max-h-0'>
        {
          subLinks.map(({ name, to }) => (
            <NavLink
              key={name}
              to={to}
              className={({ isActive }) =>
                `block font-m px-3 py-1 transition-all hover:text-white hover:font-semibold
                ${isActive ? 'text-white font-semibold' : 'text-gray-300'}`
              }
            >
              {name}
            </NavLink>
          ))
        }
        {hasLogout && (
          <button
            className='text-gray-300 font-m px-3 py-1 transition-all hover:text-white hover:font-semibold'
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>

    </div>
  )
}

export default MobileDropdown

import { Menu, Transition } from '@headlessui/react'
import React, { Fragment, type ReactElement } from 'react'
import { NavLink } from 'react-router-dom'
import LogoutIcon from '../../assets/icons/LogoutIcon'

interface Link {
  name: string
  to: string
  icon?: ReactElement
}

interface DropDownProps {
  menu: React.ReactElement
  items: Link[]
  logout: boolean
  handleLogout?: () => void
}

const DropDown = ({ menu, items, logout, handleLogout }: DropDownProps): ReactElement => {
  return (
    <div className='grid place-items-center ml-3'>
      <Menu as="div" className="relative inline-block text-left">
        <div className='grid place-items-center'>
          <Menu.Button>
            {menu}
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-4 w-48 z-50 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
            {
              items.map((item, index) => {
                return (
                  <div key={index} className="px-1 py-1 ">
                    <Menu.Item>
                      {({ active }) => (
                        <NavLink
                          to={item.to}
                          className={({ isActive }) =>
                            `group flex w-full items-center rounded-md px-2 py-2 text-sm
                            ${isActive || active ? 'bg-red text-white' : ''}`
                          }
                        >
                          {item.icon}
                          {item.name}
                        </NavLink>
                      )}
                    </Menu.Item>
                  </div>
                )
              })
            }

            {logout && (
              <div className="px-1 py-1 ">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${active ? 'bg-red text-white' : ''
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      onClick={handleLogout}
                    >
                      <LogoutIcon className='w-5 h-5 mr-2' />
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            )}

          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default DropDown

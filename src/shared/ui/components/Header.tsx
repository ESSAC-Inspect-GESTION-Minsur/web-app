import React, { type ReactElement, useState } from 'react'

import useMediaQuery from '@/shared/hooks/useMediaQuery'

import BarsIcon from '@/shared/ui/assets/icons/Bars'
import NavBar from './NavBar'

const Header = (): ReactElement => {
  const [isMenuToggled, setIsMenuToggled] = useState(false)

  const isAboveSmallScreens = useMediaQuery('(min-width: 770px)')

  const handleLinkClick = (): void => {
    setIsMenuToggled(!isMenuToggled)
  }

  const desktopNav = (): ReactElement => (
    <NavBar handleClick={handleLinkClick} />
  )

  const hamburgerMenu = (): ReactElement => (
    <button
      onClick={() => { setIsMenuToggled(!isMenuToggled) }}
    >
      <span className='block border-[1px] border-gray-300 rounded-[4px] opacity-30 py-[1px] px-2 text-white transition-all hover:opacity-80'>
        <BarsIcon className='w-9 h-9' />
      </span>
    </button>
  )

  const mobileNav = (): ReactElement => (
    <div
      style={{ maxHeight: isMenuToggled ? '500px' : '0' }}
      className={'absolute bg-black top-full z-10 left-0 w-full overflow-hidden transition-max-height duration-300 ease max-h-0 pb-2'}>

      <NavBar handleClick={handleLinkClick} extraLinkClasses='block hover:text-white' />
    </div>
  )
  return (
    <header className='relative bg-black shadow-md shadow-black/10 py-5 mb-7'>
      <nav className='flex mx-auto px-4 md:px-0 md:w-[92%] justify-between items-center md:justify-normal'>
        <div className='md:w-1/3'>
          <div className='flex gap-4 items-center'>
            <img className='max-w-[180px] md:border-r-[3px] filter brightness-0 invert pr-5 border-red' src="/logo-header.png" alt="" />
            { isAboveSmallScreens && <img className='max-w-[150px]' src="/brand.png" alt="" />}
          </div>
        </div>
        <div className='sm:flex md:justify-end md:items-center md:w-2/3'>
          {
            isAboveSmallScreens
              ? desktopNav()
              : hamburgerMenu()
          }
        </div>

        {!isAboveSmallScreens && mobileNav()}
      </nav>
    </header>
  )
}

export default Header

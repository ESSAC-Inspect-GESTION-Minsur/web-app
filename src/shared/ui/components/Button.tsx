import React, { type ReactElement, useEffect, useState } from 'react'

type ButtonType = 'button' | 'submit' | 'reset' | undefined

type ButtonColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning'

interface ButtonProps {
  children?: React.ReactNode
  color: ButtonColor
  onClick?: () => void
  disabled?: boolean
  type?: ButtonType
  isLoading?: boolean
  className?: string
  isActive?: boolean
}

const getButtonColor = (buttonColor: ButtonColor): string => {
  const colors = {
    primary: 'bg-red',
    secondary: 'bg-black',
    success: 'bg-success',
    info: 'bg-info',
    warning: 'bg-warning'
  }

  return colors[buttonColor]
}

const getDisableButtonColor = (buttonColor: ButtonColor): string => {
  const colors = {
    primary: 'bg-red-hover',
    secondary: 'bg-black-light',
    success: 'bg-success-dark',
    info: 'bg-info-dark',
    warning: 'bg-warning-dark'
  }

  return colors[buttonColor]
}

const getHoverButtonColor = (buttonColor: ButtonColor): string => {
  const colors = {
    primary: 'hover:bg-red-hover',
    secondary: 'hover:bg-black-hover',
    success: 'hover:bg-success-hover',
    info: 'hover:bg-info-hover',
    warning: 'hover:bg-warning-hover'
  }

  return colors[buttonColor]
}

const Button = ({ children, color, onClick, disabled = false, type = 'button', isLoading = false, className = '', isActive = false }: ButtonProps): ReactElement => {
  const [bgColor, setBgColor] = useState('bg-blue')
  const [hoverBgColor, setHoverBgColor] = useState('hover:bg-blue-hover')

  useEffect(() => {
    if (disabled) {
      setBgColor(getDisableButtonColor(color))
      return
    }

    const actualBgColor = getButtonColor(color) + (isActive ? '-hover' : '')
    setBgColor(actualBgColor)
    setHoverBgColor(getHoverButtonColor(color))
  }, [color, disabled, isActive])

  const loadingStyle = 'text-transparent after:absolute after:w-5 after:h-5 after:top-0 after:right-0 after:left-0 after:bottom-0 after:m-auto after:border-4 after:border-t-white after:opacity-100 after:rounded-[50%] after:animate-spin'

  return (
    <button
      className={`${className} ${bgColor} ${!disabled && !isLoading ? hoverBgColor : ''} uppercase px-4 py-[6px] rounded-md relative ${isLoading ? loadingStyle : 'text-white'} `}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  )
}

export default Button

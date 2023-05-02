import React, { type ReactElement } from 'react'

interface DividerProps {
  className?: string
}

const Divider = ({ className = '' }: DividerProps): ReactElement => {
  return (
    <div className={`border-b border-gray-300 my-4 ${className}`} />
  )
}

export default Divider

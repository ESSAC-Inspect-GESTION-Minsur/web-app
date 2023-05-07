import { useState } from 'react'

export const useBooleanState = (): [
  boolean,
  () => void,
  (value: boolean) => void
] => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleModal = (): void => {
    setIsOpen(!isOpen)
  }

  const setOpen = (value: boolean): void => {
    setIsOpen(value)
  }

  return [
    isOpen,
    toggleModal,
    setOpen
  ]
}

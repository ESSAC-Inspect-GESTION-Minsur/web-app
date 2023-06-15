import React, { useEffect, type ChangeEvent, type ReactElement, useState, useMemo, useRef } from 'react'
import ArrowDown from '../assets/icons/ArrowDown'
import { ArrowUp } from '../assets/icons/ArrowUp'

interface SelectInputProps<T> {
  name: string
  label: string
  objects: T[]
  value: string
  valueKey?: keyof T
  optionKey?: keyof T
  disabled?: boolean
  className?: string

  searchable?: boolean
  setValue: (name: string, value: string) => void
}

const SelectInput = <T,>({ name, label, objects, value, valueKey, optionKey, disabled = false, className = '', searchable = false, setValue }: SelectInputProps<T>): ReactElement => {
  const [searchItem, setSearchItem] = useState<string>('')
  const [showOptions, setShowOptions] = useState<boolean>(false)
  const selectRef = useRef<HTMLDivElement>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  const handleOptionClick = (): void => {
    if (disabled) return

    setShowOptions(!showOptions)
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [showOptions])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchItem(event.target.value)
  }

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent): void => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false)
      }
    }

    window.addEventListener('click', handleOutsideClick)

    return () => {
      window.removeEventListener('click', handleOutsideClick)
    }
  }, [])

  const isObject = useMemo(() => {
    if (objects.length === 0) return false

    return typeof objects[0] === 'object'
  }, [objects])

  const filteredOptions = useMemo(() => {
    return objects.filter((object) => {
      const option = isObject && object && optionKey ? object[optionKey] : object

      return String(option).toLowerCase().includes(searchItem.toLowerCase())
    })
  }, [objects, searchItem])

  const selectedOption: string | null = useMemo(() => {
    const object = objects.find((object) => {
      const objectValue = isObject && object && valueKey ? object[valueKey] : object

      return String(objectValue) === value
    })

    if (object === undefined || object == null) return null

    return isObject && optionKey ? String(object[optionKey]) : String(object)
  }, [objects, value])

  useEffect(() => {
    if (objects.length === 0 || selectedOption !== null) return

    const object = objects[0]

    const objectValue = isObject && object && valueKey ? object[valueKey] : object

    setValue(name, String(objectValue))
  }, [selectedOption])

  const highlightSearchTerm = (label: string): React.ReactNode => {
    if (searchItem.trim() === '') {
      return label
    }

    const regex = new RegExp(`(${searchItem.toLowerCase()})`, 'gi')
    const parts = label.toLowerCase().split(regex)

    return (
      <span>
        {parts.map((part, index) =>
          regex.test(part)
            ? (
              <strong key={index}>{part}</strong>
              )
            : (
              <span key={index}>{part}</span>
              )
        )}
      </span>
    )
  }

  return (
    <div className={`mb-2 ${className}`} ref={selectRef}>
      <label htmlFor={name}>{label}</label>
      <div
        onClick={handleOptionClick}
        className={`cursor-pointer w-full h-10 px-2 border border-gray-300 border-solid flex flex-col justify-center ${selectedOption == null ? 'text-blue' : ''} ${showOptions ? 'rounded-tl-md rounded-tr-md' : 'rounded-md '} ${disabled ? 'bg-gray-300 text-gray-500' : ''}`}>

        <div className='flex justify-between items-center'>
          <p>{selectedOption ?? label}</p>
          <ArrowUp className={`w-6 h-6 ${!showOptions ? 'hidden' : ''}`} />
          <ArrowDown className={`w-6 h-6 ${showOptions ? 'hidden' : ''}`} />
        </div>
      </div>
      <div className='relative'>
        {
          showOptions && (
            <div className='absolute z-10 w-full bg-white border border-gray-400 max-h-36 overflow-y-auto max-w-full overflow-x-hidden rounded-br-md rounded-bl-md'>
              {
                searchable && (
                  <input
                    ref={inputRef}
                    type="text"
                    className="w-full text-gray-600 py-1 pr-10 pl-3 focus:outline-none border-b-[1px] border-gray-300"
                    placeholder="Search..."
                    value={searchItem}
                    onChange={handleInputChange}
                  />
                )
              }
              {
                ...filteredOptions.map((object) => {
                  const isObject = typeof object === 'object'
                  const objectValue = isObject && object && valueKey ? object[valueKey] : object
                  const option = isObject && object && optionKey ? object[optionKey] : object

                  const selected = String(value) === objectValue

                  return (
                    <p
                      key={String(objectValue)}
                      className={`block w-full px-2 py-1 cursor-pointer ${selected ? 'bg-blue text-white' : 'hover:bg-gray-200'}`}
                      onClick={() => {
                        setValue(name, String(objectValue))
                        setSearchItem('')
                        setShowOptions(false)
                      }}
                    >{highlightSearchTerm(String(option))}</p>
                  )
                })
              }
            </div>
          )
        }
      </div>
    </div>
  )
}

export default SelectInput

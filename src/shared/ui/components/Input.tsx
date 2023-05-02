import React, { type ReactElement, useEffect, useState } from 'react'

interface InputProps {
  value: string | undefined
  type: string
  name: string
  placeholder: string
  disabled?: boolean
  reset?: boolean
  required?: boolean
  setValue: (value: string) => void
  setValid?: (valid: boolean) => void
}

const Input = ({ name, placeholder, value, type, reset = false, disabled = false, required = true, setValue, setValid = () => { } }: InputProps): ReactElement => {
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!required) {
      setValid(true)
    } else {
      setValid(error === '' && value?.trim() !== '')
    }
  }, [value])

  useEffect(() => {
    setError('')
  }, [reset])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target

    if (type === 'checkbox') {
      setValue(event.target.checked ? 'true' : 'false')
      return
    }

    if (value.trim() === '' && required) {
      setError(`El campo ${name} no puede estar vacío`)
    } else {
      setError('')
    }

    setValue(value)
  }

  const input = (): ReactElement => {
    return (
      <input
        className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none'
        disabled={disabled} id={name} type={type} name={name} placeholder={placeholder} value={value} onChange={handleChange}
        checked={value === 'true'}
      />
    )
  }

  const checkboxInput = (): ReactElement => {
    return (
      <label className="flex items-center gap-4 cursor-pointer">
        <span className="ml-2 text-gray-700">{placeholder}</span>
        <div className="relative">
          <input
            type="checkbox"
            className="hidden"
            checked={value === 'true'}
            onChange={handleChange}
          />
          <div className="w-5 h-5 bg-white border border-gray-500 rounded">
            {value === 'true' && (
              <div
                className="absolute w-3 h-3 bg-red transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full"
              />
            )}
          </div>
        </div>
      </label>
    )
  }

  return (
    <div>
      {type === 'checkbox' ? checkboxInput() : input()}
      <p className='m-0 mt-1 text-red-dark'>{error}</p>
    </div>
  )
}

export default Input

import React, { type ReactElement, useEffect, useState } from 'react'

type InputType = 'text' | 'password' | 'number' | 'checkbox' | 'textarea' | 'email' | 'date' | 'tel'

interface InputProps {
  label: string
  value: string | undefined
  type: InputType
  name: string
  placeholder: string
  setValue: (name: string, value: string | boolean | number) => void
  disabled?: boolean
  reset?: boolean
  required?: boolean
  className?: string
  setValid?: (valid: boolean) => void
}

const Input = ({ label, name, placeholder, value, type, reset = false, disabled = false, required = true, className = '', setValue, setValid = () => { } }: InputProps): ReactElement => {
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!required) {
      setValid(true)
      return
    }

    setValid(error === '' && value?.trim() !== '')
  }, [value])

  useEffect(() => {
    setError('')
  }, [reset])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { value } = event.target

    if ('checked' in event.target && type === 'checkbox') {
      setValue(name, event.target.checked)
      return
    }

    if (type === 'number') {
      setValue(name, Number(value))
      return
    }

    if (value.trim() === '') {
      setError(`El campo ${label.toLowerCase()} no puede estar vacío`)
    } else {
      setError('')
    }

    setValue(name, value)
  }

  const input = (): ReactElement => {
    return (
      <div className={`flex flex-col gap-2 mb-2 ${className}`}>
        <label htmlFor={name}>{label} {required && <span className='text-red-600'>*</span>}</label>
        <input
          className='block w-full h-10 px-2 border border-gray-300 rounded-md border-solid outline-none focus:shadow-blue focus:shadow-input-focus disabled:bg-gray-200 disabled:text-gray-500'
          disabled={disabled} id={name} type={type} name={name} placeholder={placeholder} value={value} onChange={handleChange}
          checked={value === 'true'} required={required}
        />
      </div>
    )
  }

  const textArea = (): ReactElement => {
    return (
      <div className={`flex flex-col gap-2 mb-2 ${className}`}>
        <label htmlFor={name}>{label} {required && <span className='text-red-600'>*</span>}</label>
        <textarea
          className='block w-full h-20 max-h-[100px]  px-2 border border-gray-300 rounded-md border-solid outline-none focus:shadow-blue focus:shadow-input-focus disabled:bg-gray-200 disabled:text-gray-500'
          disabled={disabled} id={name} name={name} placeholder={placeholder} value={value} onChange={handleChange} required={required}
        />
      </div>
    )
  }

  const checkboxInput = (): ReactElement => {
    return (
      <label className={`flex items-center gap-4 cursor-pointer mb-2 ${className}`}>
        <span className='ml-2 text-gray-700'>{label}</span>
        <div className='relative'>
          <input
            type='checkbox'
            className='hidden'
            checked={value === 'true'}
            onChange={handleChange}
          />
          <div className='w-5 h-5 bg-white border border-gray-500 rounded'>
            {value === 'true' && (
              <div
                className='absolute w-3 h-3 bg-success transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full'
              />
            )}
          </div>
        </div>
      </label>
    )
  }

  const types = {
    text: input,
    password: input,
    email: input,
    date: input,
    tel: input,
    number: input,
    checkbox: checkboxInput,
    textarea: textArea
  }

  return (
    <div>
      {types[type]()}
      <p className='m-0 mt-1 text-red-dark'>{error}</p>
    </div>
  )
}

export default Input

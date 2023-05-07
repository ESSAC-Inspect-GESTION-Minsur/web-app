import React, { useEffect, type ChangeEvent, type ReactElement } from 'react'

interface SelectInputProps<T> {
  name: string
  label: string
  objects: T[]
  value: string
  valueKey?: keyof T
  optionKey?: keyof T
  setValue: (name: string, value: string) => void
  disabled?: boolean
  className?: string
}

const SelectInput = <T,>({ name, label, objects, value, valueKey, optionKey, setValue, disabled = false, className = '' }: SelectInputProps<T>): ReactElement => {
  useEffect(() => {
    if (objects.length === 0) return

    const aux = valueKey ? objects[0][valueKey] : objects[0]
    setValue(name, String(aux))
  }, [])

  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setValue(name, event.target.value)
  }

  return (
    <div className={`flex flex-col gap-2 mb-2 ${className}`}>
      <label htmlFor={name}>{label}</label>
      <select
        className='capitalize block w-full h-10 px-2 border border-gray-300 rounded-md border-solid outline-none focus:shadow-blue focus:shadow-input-focus'
        name={name} id={name} value={value} onChange={handleChange} disabled={disabled}>
        {
          objects.map((object) => {
            const isObject = typeof object === 'object'
            const value = isObject && object && valueKey ? object[valueKey] : object
            const option = isObject && object && optionKey ? object[optionKey] : object

            return (
              <option
                key={String(value)}
                value={String(value)}
                >{String(option)}</option>
            )
          })
        }
      </select>
    </div>

  )
}

export default SelectInput

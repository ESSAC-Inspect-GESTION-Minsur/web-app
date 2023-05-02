import { type FieldValue } from '@/reports/models/field-value.interface'
import { type Field } from '@/reports/models/field.entity'
import React, { type ReactElement, useEffect, useState } from 'react'
import FieldValueForm from './FieldValueForm'

interface FieldValueProp {
  toastId: string
  field: Field
  addFieldValueToCurrent: (fieldValue: FieldValue) => void
}

const FieldValueComponent = ({ field, toastId, addFieldValueToCurrent }: FieldValueProp): ReactElement => {
  const [values, setValues] = useState<FieldValue[]>(field.values)

  useEffect(() => {
    setValues(field.values)
  }, [field])

  const handleUpdateValues = (fieldValue: FieldValue): void => {
    addFieldValueToCurrent(fieldValue)
  }

  return (
    <div>
      {values.length > 0 && (
        <>
          <div className='w-full border-t border-solid border-gray-light my-3'></div>
          <h2 className='uppercase font-medium'>Valores posibles para el campo: <span>{field.name}</span></h2>
        </>
      )}
      {
        values.length > 0 &&
        (
          <ul>

            {
              values.map(value => {
                return (
                  <li
                    key={value.id}
                    className='capitalize'
                  > - {value.value}</li>
                )
              })
            }
          </ul>
        )
      }

      <FieldValueForm toastId={toastId} field={field} updateFieldValues={handleUpdateValues} />
    </div>
  )
}

export default FieldValueComponent

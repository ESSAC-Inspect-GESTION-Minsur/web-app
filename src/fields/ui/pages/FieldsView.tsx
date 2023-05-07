import React, { type ReactElement, useEffect, useState } from 'react'
import { useArrayReducer } from '@/shared/hooks/useArrayReducer'
import Toast from '@/shared/ui/components/Toast'
import { FieldType } from '@/fields/models/enums/field-type.enum'
import { type Field } from '@/fields/models/field.interface'
import { FieldsService } from '@/fields/services/fields.service'
import { FieldContext } from '../contexts/FieldContext'
import FieldsTable from '../components/FieldsTable'
import FieldForm from '../components/FieldForm'
import Divider from '@/shared/ui/components/Divider'

const TOAST_ID = 'field'

const FieldsView = (): ReactElement => {
  const [fields, setFields, addField, updateField, removeField] = useArrayReducer<Field>([])

  const [selectedField, setSelectedField] = useState<Field | null>(null)
  const [fieldForm, setFieldForm] = useState<Field | null>(null)

  useEffect(() => {
    const fieldsService = new FieldsService()
    void fieldsService.findAll()
      .then(response => {
        response.sort((a, b) => a.id > b.id ? 1 : -1)
        setFields(response)
      })
  }, [])

  return (
    <FieldContext.Provider value={{
      fields,
      addField,
      updateField,
      removeField,
      selectedField,
      setSelectedField,
      fieldForm,
      setFieldForm,
      toastId: TOAST_ID
    }}>
      <h1 className='text-2xl uppercase font-semibold'>Tipo de Checklists - Campos</h1>
      <Divider></Divider>
      <div className='md:grid md:grid-cols-table md:gap-10'>
        <div className='mb-5 md:mb-0'>
          <aside className='mb-5 md:mb-0'>
            <h2 className='font-bold uppercase '>Tipo de campos</h2>
            {
              Object.values(FieldType).map(fieldType => {
                return (
                  <p className='capitalize border-b last-of-type:border-b-0 px-3 w-1/2' key={fieldType}>{fieldType}</p>
                )
              })
            }
          </aside>
          <FieldForm/>
        </div>

        <FieldsTable />

      </div>

      <Toast id={TOAST_ID}></Toast>
    </FieldContext.Provider>

  )
}

export default FieldsView

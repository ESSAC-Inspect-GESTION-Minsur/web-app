import React from 'react'
import { type Field } from '@/fields/models/field.interface'

interface FieldContextInterface {
  toastId: string

  fields: Field[]
  addField: (field: Field) => void
  updateField: (field: Field) => void
  removeField: (id: string) => void

  selectedField: Field | null
  setSelectedField: (field: Field | null) => void

  fieldForm: Field | null
  setFieldForm: (fieldForm: Field | null) => void
}

export const FieldContext = React.createContext<FieldContextInterface>({
  toastId: '',
  fields: [],
  addField: () => { },
  updateField: () => { },
  removeField: () => { },
  selectedField: null,
  setSelectedField: () => { },
  fieldForm: null,
  setFieldForm: () => { }
})

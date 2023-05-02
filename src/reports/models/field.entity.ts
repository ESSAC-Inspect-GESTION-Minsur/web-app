import { FieldType } from './enums/field-type.enum'
import { type FieldValue } from './field-value.interface'

export interface Field {
  createdAt: string
  updatedAt: string
  id: string
  name: string
  placeholder?: string
  type: FieldType
  active: boolean
  values: FieldValue[]
}

export const FIELD_INITIAL_STATE: Field = {
  createdAt: '',
  updatedAt: '',
  id: '',
  name: '',
  placeholder: '',
  type: FieldType.TEXT,
  active: true,
  values: []
}

import { type FieldType } from '../enums/field-type.enum'
import { type FieldValue } from '../field-value.interface'
import { type Field } from '../field.entity'

export interface FieldApiResponse {
  createdAt: string
  updatedAt: string
  id: string
  name: string
  value: string
  placeholder?: string
  type: FieldType
  active: boolean
  values: FieldValue[]
}

export const transformAllToFieldArrayEntity = (fieldsApi: FieldApiResponse[]): Field[] => {
  return fieldsApi.map((fieldApi) => {
    const { value, ...field } = fieldApi
    return field
  })
}

export const transformToFieldEntity = (fieldApi: FieldApiResponse): Field => {
  const { value, ...field } = fieldApi
  return field
}

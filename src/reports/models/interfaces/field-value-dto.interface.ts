import { type FieldValue } from '../field-value.interface'

export interface FieldValueDto extends Omit<FieldValue, 'id'> {}

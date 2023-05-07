import { type Field } from './field.interface'
import { type Group } from './group.interface'

export interface FieldReport {
  fieldId: string
  reportId: string
  value: string
  type: string
  isCritical: boolean
  imageEvidence: string
  group: Group
  field: Field
}

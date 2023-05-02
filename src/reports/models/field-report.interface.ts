import { type Field } from './field.entity'
import { type FieldGroup } from './group.interface'

export interface FieldReport {
  fieldId: string
  reportId: string
  value: string
  type: string
  isCritical: boolean
  imageEvidence: string
  priority: string
  group: FieldGroup
  field: Field
}

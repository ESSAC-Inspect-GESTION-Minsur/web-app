import { PRIORITY } from './enums/priority.enum'
import { type Field } from './field.entity'

export interface GroupField {
  fieldId: string
  groupId: string
  field: Field
  maxLength: number
  isCritical: boolean
  needImage: boolean
  priority: PRIORITY
}

export interface GroupFieldDto extends Pick<GroupField, 'maxLength' | 'isCritical' | 'needImage' | 'priority' > {}

export const GROUP_FIELD_INITIAL_STATE: GroupFieldDto = {
  maxLength: 0,
  isCritical: false,
  needImage: false,
  priority: PRIORITY.LOW
}

import { type GroupField } from './group-field.interface'

export interface Group {
  id: string
  name: string
  reportTypeId: string
  groupFields: GroupField[]

  createdAt: string
  updatedAt: string
  active: boolean
}

export interface FieldGroup {
  id: string
  name: string
}

export interface GroupDto extends Pick<Group, 'name' | 'reportTypeId'> {}

export const GROUP_INITIAL_STATE: Group = {
  createdAt: '',
  updatedAt: '',
  id: '',
  name: '',
  reportTypeId: '',
  active: true,
  groupFields: []
}

export const GROUP_DTO_INITIAL_STATE: GroupDto = {
  name: '',
  reportTypeId: ''
}

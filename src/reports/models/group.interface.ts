export interface Group {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  active: boolean
  reportTypeId: string
  fieldsGroups: []
}

export interface FieldGroup {
  id: string
  name: string
}

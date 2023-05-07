import { type Group } from '@/fields/models/group.interface'
import React from 'react'

interface GroupContextInterface {
  groups: Group[]
  addGroup: (group: Group) => void
  updateGroup: (group: Group) => void
  removeGroup: (id: string) => void

  selectedGroup: Group | null
  setSelectedGroup: (group: Group | null) => void

  groupForm: Group | null
  setGroupForm: (groupForm: Group | null) => void

  toggleShowGroupDetail: () => void
  toggleShowGroupFormModal: () => void
}

export const GroupContext = React.createContext<GroupContextInterface>({
  groups: [],
  addGroup: () => { },
  updateGroup: () => { },
  removeGroup: () => { },
  selectedGroup: null,
  setSelectedGroup: () => { },
  groupForm: null,
  setGroupForm: () => { },
  toggleShowGroupDetail: () => { },
  toggleShowGroupFormModal: () => { }
})

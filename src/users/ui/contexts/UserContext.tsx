import React from 'react'
import { type User } from '@/users/models/user.interface'

interface UserContextInterface {
  toastId: string

  users: User[]
  addUser: (user: User) => void
  updateUser: (user: User) => void
  removeUser: (id: string) => void

  selectedUser: User | null
  setSelectedUser: (user: User | null) => void

  userForm: User | null
  setUserForm: (userForm: User | null) => void
}

export const UserContext = React.createContext<UserContextInterface>({
  toastId: '',
  users: [],
  addUser: () => { },
  updateUser: () => { },
  removeUser: () => { },
  selectedUser: null,
  setSelectedUser: () => { },
  userForm: null,
  setUserForm: () => { }
})

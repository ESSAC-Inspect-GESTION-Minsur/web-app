import { type UserRole } from './role.enum'

export interface AddUser {
  username: string
  password: string
  company: string
  role: UserRole
}

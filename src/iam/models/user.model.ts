import { type UserRole } from '@/admin/models/role.enum'
import { type Profile } from '@/profiles/models/profile.entity'

export interface User {
  createdAt: string
  updatedAt: string
  id: string
  username: string
  password: string
  company: string
  active: boolean
  role: UserRole
  areas: Area[]
  profile: Profile
}

export interface Area {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  active: boolean
}

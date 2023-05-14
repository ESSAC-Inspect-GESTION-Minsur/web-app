import { PROFILE_INITIAL_STATE, type ProfileDto, type Profile, PROFILE_DTO_INITIAL_STATE } from '@/profiles/models/profile.interface'
import { type Sponsor } from './sponsor.interface'
import { UserRole } from './enum/role.enum'

export interface User {
  id: string
  username: string
  company: string
  role: UserRole
  sponsors: Sponsor[]
  profile: Profile

  createdAt: string
  updatedAt: string
  active: boolean
}

export interface UserDto extends Pick<User, 'username' | 'company' | 'role'> {
  password: string
  sponsorId: string

  profile: ProfileDto
}

export interface UserLogin extends Pick<User, 'username'> {
  password: string
}

export interface UserToStorage extends Pick<User, 'id' | 'username' | 'role'> {}

export interface UserChangeRole extends Pick<User, 'id' | 'role'> {}

export const USER_INITIAL_STATE: User = {
  id: '',
  username: '',
  company: '',
  role: UserRole.USER,
  sponsors: [],
  profile: PROFILE_INITIAL_STATE,
  createdAt: '',
  updatedAt: '',
  active: false
}

export const USER_DTO_INITIAL_STATE: UserDto = {
  username: '',
  password: '',
  company: '',
  role: UserRole.USER,
  sponsorId: '',
  profile: PROFILE_DTO_INITIAL_STATE
}

export const USER_LOGIN_INITIAL_STATE: UserLogin = {
  username: '',
  password: ''
}

export const USER_CHANGE_ROLE_INITIAL_STATE: UserChangeRole = {
  id: '',
  role: UserRole.USER
}

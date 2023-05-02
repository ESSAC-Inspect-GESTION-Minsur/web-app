import { type Company } from './company.interface'

export interface Profile {
  createdAt: string
  updatedAt: string
  active: boolean
  id: string
  name: string
  lastName: string
  dni: string
  company: string
  phone1: string
  phone2: string
  email: string
  license: string
  licenseCategory: string
  licenseExpiration: string
  fullName: string
  companies: Company[]
}

export interface ProfileDto extends Omit<Profile, 'id' | 'createdAt' | 'updatedAt' | 'fullName' | 'active' | 'companies'> {}

export const INITIAL_STATE_PROFILE: Profile = {
  createdAt: '',
  updatedAt: '',
  active: true,
  id: '',
  name: '',
  lastName: '',
  dni: '',
  company: '',
  phone1: '',
  phone2: '',
  email: '',
  license: '',
  licenseCategory: '',
  licenseExpiration: '',
  fullName: '',
  companies: []
}

export const INITIAL_STATE_PROFILE_DTO: ProfileDto = {
  name: '',
  lastName: '',
  dni: '',
  company: '',
  phone1: '',
  phone2: '',
  email: '',
  license: '',
  licenseCategory: '',
  licenseExpiration: ''
}

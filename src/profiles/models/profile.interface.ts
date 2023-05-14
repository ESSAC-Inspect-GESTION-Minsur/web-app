import { type Company } from './company.interface'

export interface Profile {
  id: string
  name: string
  lastName: string
  dni: string
  phone1: string | null
  phone2: string | null
  email: string | null
  license: string | null
  licenseCategory: string | null
  licenseExpiration: string | null
  fullName: string
  isDriver: boolean
  companies: Company[]

  createdAt: string
  updatedAt: string
  active: boolean
}

export interface ProfileDto extends Omit<Profile, 'id' | 'createdAt' | 'updatedAt' | 'fullName' | 'active' | 'companies' > {}

export const PROFILE_INITIAL_STATE: Profile = {
  id: '',
  name: '',
  lastName: '',
  dni: '',
  phone1: '',
  phone2: '',
  email: '',
  license: '',
  licenseCategory: '',
  licenseExpiration: new Date().toISOString(),
  isDriver: false,
  fullName: '',
  companies: [],
  createdAt: '',
  updatedAt: '',
  active: true
}

export const PROFILE_DTO_INITIAL_STATE: ProfileDto = {
  name: '',
  lastName: '',
  dni: '',
  phone1: '',
  phone2: '',
  email: '',
  license: '',
  licenseCategory: '',
  isDriver: false,
  licenseExpiration: new Date().toISOString()
}

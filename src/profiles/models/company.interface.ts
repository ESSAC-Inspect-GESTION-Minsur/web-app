import { type Contractor } from './contractor.interface'

export interface Company {
  id: string
  name: string
  ruc: string
  contractors: Contractor[]

  createdAt: string
  updatedAt: string
  active: boolean
}

export interface CompanyDto extends Pick<Company, 'name' | 'ruc'> {}

export const INITIAL_STATE_COMPANY: Company = {
  id: '',
  name: '',
  ruc: '',
  contractors: [],
  createdAt: '',
  updatedAt: '',
  active: true
}

export const INITIAL_STATE_COMPANY_DTO: CompanyDto = {
  name: '',
  ruc: ''
}

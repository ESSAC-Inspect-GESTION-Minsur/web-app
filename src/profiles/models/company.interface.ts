export interface Company {
  id: string
  name: string
  ruc: string

  createdAt: string
  updatedAt: string
  active: boolean
}

export interface CompanyDto extends Pick<Company, 'name' | 'ruc'> {}

export const INITIAL_STATE_COMPANY: Company = {
  id: '',
  name: '',
  ruc: '',
  createdAt: '',
  updatedAt: '',
  active: true
}

export const INITIAL_STATE_COMPANY_DTO: CompanyDto = {
  name: '',
  ruc: ''
}

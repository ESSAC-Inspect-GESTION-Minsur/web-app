export interface Contractor {
  id: string
  name: string
  ruc: string

  createdAt: string
  updatedAt: string
  active: boolean
}

export interface ContractorDto extends Pick<Contractor, 'name' | 'ruc' > {}

export const CONTRACTOR_INITIAL_STATE: Contractor = {
  id: '',
  name: '',
  ruc: '',
  createdAt: '',
  updatedAt: '',
  active: false
}

export const CONTRACTOR_DTO_INITIAL_STATE: ContractorDto = {
  name: '',
  ruc: ''
}

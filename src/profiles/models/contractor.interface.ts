export interface Contractor {
  id: string
  name: string

  createdAt: string
  updatedAt: string
  active: boolean
}

export interface ContractorDto extends Pick<Contractor, 'name'> {}

export const CONTRACTOR_INITIAL_STATE: Contractor = {
  id: '',
  name: '',
  createdAt: '',
  updatedAt: '',
  active: false
}

export const CONTRACTOR_DTO_INITIAL_STATE: ContractorDto = {
  name: ''
}

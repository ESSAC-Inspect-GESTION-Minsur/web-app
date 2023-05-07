export interface Material {
  id: string
  name: string

  createdAt: string
  updatedAt: string
  active: boolean
}

export interface MaterialDto extends Pick<Material, 'name'> {}

export const MATERIAL_INITIAL_STATE: Material = {
  createdAt: '',
  updatedAt: '',
  id: '',
  name: '',
  active: true
}

export const MATERIAL_DTO_INITIAL_STATE: MaterialDto = {
  name: ''
}

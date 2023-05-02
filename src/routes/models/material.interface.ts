export interface Material {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  active: boolean
}

export interface MaterialDto extends Pick<Material, 'name'> {}

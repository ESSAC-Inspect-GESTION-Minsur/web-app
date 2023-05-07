export interface Area {
  id: string
  name: string

  createdAt: string
  updatedAt: string
  active: boolean
}

export interface AreaDto extends Pick<Area, 'name'> {}

export const AREA_INITIAL_STATE: Area = {
  id: '',
  name: '',
  createdAt: '',
  updatedAt: '',
  active: false
}

export const AREA_DTO_INITIAL_STATE: AreaDto = {
  name: ''
}

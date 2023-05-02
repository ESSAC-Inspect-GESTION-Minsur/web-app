import { type Material } from './material.interface'

export interface VehicleType {
  createdAt: string
  updatedAt: string
  id: string
  name: string
  isCart: boolean
  active: boolean
  materials: Material[]
  parent: VehicleType | null
  children: VehicleType[]
}

export interface VehicleTypeDto extends Pick<VehicleType, 'name' | 'isCart'> {}

export const VEHICLE_TYPE_DTO_INITIAL_STATE: VehicleTypeDto = {
  name: '',
  isCart: false
}

export const VEHICLE_TYPE_INITIAL_STATE: VehicleType = {
  createdAt: '',
  updatedAt: '',
  id: '',
  name: '',
  isCart: false,
  materials: [],
  parent: null,
  active: true,
  children: []
}

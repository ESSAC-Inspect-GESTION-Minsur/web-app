import { type Company } from '@/profiles/models/company.interface'
import { VEHICLE_TYPE_INITIAL_STATE, type VehicleType } from './vehicle-type.interface'
import { type Sponsor } from '@/users/models/sponsor.interface'

export interface Vehicle {
  id: string
  licensePlate: string
  brand: string | null
  model: string | null
  soatExpiration: string | null
  technicalReviewExpiration: string | null

  vehicleType: VehicleType
  companies: Company[]
  sponsors: Sponsor[]

  createdAt: string
  updatedAt: string
  active: boolean
}

export interface VehicleDto extends Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt' | 'active' | 'companies' | 'vehicleType' | 'companies' | 'sponsors'> {
  vehicleTypeId: string
}

export const VEHICLE_INITIAL_STATE: Vehicle = {
  id: '',
  createdAt: '',
  updatedAt: '',
  active: true,
  licensePlate: '',
  brand: '',
  model: '',
  soatExpiration: '',
  technicalReviewExpiration: '',
  vehicleType: VEHICLE_TYPE_INITIAL_STATE,
  companies: [],
  sponsors: []
}

export const VEHICLE_DTO_INITIAL_STATE: VehicleDto = {
  licensePlate: '',
  brand: '',
  model: '',
  soatExpiration: new Date().toISOString(),
  technicalReviewExpiration: new Date().toISOString(),
  vehicleTypeId: ''
}

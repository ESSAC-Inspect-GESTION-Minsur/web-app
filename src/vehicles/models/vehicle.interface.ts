import { type Company } from '@/profiles/models/company.interface'
import { VEHICLE_TYPE_INITIAL_STATE, type VehicleType } from './vehicle-type.interface'

export interface Vehicle {
  id: string
  licensePlate: string
  provider: string | null
  company: string
  imei: string | null
  brand: string | null
  model: string | null
  lastMaintenance: string | null
  soatExpiration: string | null
  technicalReviewExpiration: string | null
  vehicleType: VehicleType
  companies: Company[]

  createdAt: string
  updatedAt: string
  active: boolean
}

export interface VehicleDto extends Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt' | 'active' | 'companies' | 'vehicleType' | 'companies'> {
  vehicleTypeId: string
}

export const VEHICLE_INITIAL_STATE: Vehicle = {
  id: '',
  createdAt: '',
  updatedAt: '',
  active: true,
  licensePlate: '',
  provider: '',
  company: '',
  imei: '',
  brand: '',
  model: '',
  lastMaintenance: '',
  soatExpiration: '',
  technicalReviewExpiration: '',
  vehicleType: VEHICLE_TYPE_INITIAL_STATE,
  companies: []
}

export const VEHICLE_DTO_INITIAL_STATE: VehicleDto = {
  licensePlate: '',
  provider: '',
  company: '',
  brand: '',
  imei: '',
  model: '',
  lastMaintenance: new Date().toISOString(),
  soatExpiration: new Date().toISOString(),
  technicalReviewExpiration: new Date().toISOString(),
  vehicleTypeId: ''
}

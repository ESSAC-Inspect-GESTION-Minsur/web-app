import { type Company } from '@/profiles/models/company.interface'
import { VEHICLE_TYPE_INITIAL_STATE, type VehicleType } from './vehicle-type.interface'

export interface Vehicle {
  createdAt: string
  updatedAt: string
  active: boolean
  licensePlate: string
  provider: string
  company: string
  companyWhoHires: string
  imei: string
  brand: string
  model: string
  lastMaintenance: string
  soatExpiration: string
  technicalReviewExpiration: string
  vehicleType: VehicleType
  companies: Company[]
}

export interface VehicleDto extends Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt' | 'active' | 'companies' | 'vehicleType'> {}

export const INITIAL_STATE_VEHICLE: Vehicle = {
  createdAt: '',
  updatedAt: '',
  active: true,
  licensePlate: '',
  provider: '',
  company: '',
  companyWhoHires: '',
  imei: '',
  brand: '',
  model: '',
  lastMaintenance: '',
  soatExpiration: '',
  technicalReviewExpiration: '',
  vehicleType: VEHICLE_TYPE_INITIAL_STATE,
  companies: []
}

export const INITIAL_STATE_VEHICLE_DTO: VehicleDto = {
  licensePlate: '',
  provider: '',
  company: '',
  companyWhoHires: '',
  brand: '',
  imei: '',
  model: '',
  lastMaintenance: '',
  soatExpiration: '',
  technicalReviewExpiration: ''
}

import React from 'react'
import { type VehicleType } from '@/vehicles/models/vehicle-type.interface'
import { type VehicleTypeTab } from '../pages/VehicleTypesView'

interface VehicleTypeContextInterface {
  toastId: string

  vehicleTypes: VehicleType[]
  addVehicleType: (vehicleType: VehicleType) => void
  updateVehicleType: (vehicleType: VehicleType) => void
  removeVehicleType: (id: string) => void

  selectedVehicleType: VehicleType | null
  setSelectedVehicleType: (vehicleType: VehicleType | null) => void

  vehicleTypeTab: VehicleTypeTab

  vehicleTypeForm: VehicleType | null
  setVehicleTypeForm: (vehicleType: VehicleType | null) => void
}

export const VehicleTypeContext = React.createContext<VehicleTypeContextInterface>({
  toastId: '',
  vehicleTypes: [],
  addVehicleType: () => { },
  updateVehicleType: () => { },
  removeVehicleType: () => { },
  selectedVehicleType: null,
  setSelectedVehicleType: () => { },
  vehicleTypeTab: 'materials',
  vehicleTypeForm: null,
  setVehicleTypeForm: () => { }
})

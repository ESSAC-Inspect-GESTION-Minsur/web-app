import React from 'react'
import { type VehicleType } from '@/routes/models/vehicle-type.interface'
import { type VehicleTypeTab } from '.'

interface VehicleTypeContextInterface {
  toastId: string

  vehicleTypes: VehicleType[]
  add: (vehicleType: VehicleType) => void
  update: (vehicleType: VehicleType) => void
  remove: (id: string) => void

  selectedVehicleType: VehicleType | null
  setSelectedVehicleType: (vehicleType: VehicleType | null) => void

  vehicleTypeTab: VehicleTypeTab

  vehicleTypeForm: VehicleType | null
  setVehicleTypeForm: (vehicleType: VehicleType | null) => void
}

export const VehicleTypeContext = React.createContext<VehicleTypeContextInterface>({
  toastId: '',
  vehicleTypes: [],
  add: () => { },
  update: () => { },
  remove: () => { },
  selectedVehicleType: null,
  setSelectedVehicleType: () => { },
  vehicleTypeTab: 'materials',
  vehicleTypeForm: null,
  setVehicleTypeForm: () => { }
})

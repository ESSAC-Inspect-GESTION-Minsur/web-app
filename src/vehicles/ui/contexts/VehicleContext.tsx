import React from 'react'
import { type Vehicle } from '@/vehicles/models/vehicle.interface'

interface VehicleContextInterface {
  toastId: string

  vehicles: Vehicle[]
  addVehicle: (vehicle: Vehicle) => void
  updateVehicle: (vehicle: Vehicle) => void
  removeVehicle: (id: string) => void

  selectedVehicle: Vehicle | null
  setSelectedVehicle: (vehicle: Vehicle | null) => void

  vehicleForm: Vehicle | null
  setVehicleForm: (vehicleForm: Vehicle | null) => void
}

export const VehicleContext = React.createContext<VehicleContextInterface>({
  toastId: '',
  vehicles: [],
  addVehicle: () => { },
  updateVehicle: () => { },
  removeVehicle: () => { },
  selectedVehicle: null,
  setSelectedVehicle: () => { },
  vehicleForm: null,
  setVehicleForm: () => { }
})

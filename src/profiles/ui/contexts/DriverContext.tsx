import React from 'react'
import { type Profile } from '@/profiles/models/profile.interface'

interface DriverContextInterface {
  toastId: string

  drivers: Profile[]
  addDriver: (driver: Profile) => void
  updateDriver: (driver: Profile) => void
  removeDriver: (id: string) => void

  selectedDriver: Profile | null
  setSelectedDriver: (driver: Profile | null) => void

  driverForm: Profile | null
  setDriverForm: (driverForm: Profile | null) => void
}

export const DriverContext = React.createContext<DriverContextInterface>({
  toastId: '',
  drivers: [],
  addDriver: () => { },
  updateDriver: () => { },
  removeDriver: () => { },
  selectedDriver: null,
  setSelectedDriver: () => { },
  driverForm: null,
  setDriverForm: () => { }
})

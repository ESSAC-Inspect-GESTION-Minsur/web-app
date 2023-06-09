import { type RouteProfile } from '@/profiles/models/route-profile.interface'
import { type Report } from '@/reports/models/report.interface'
import { type Vehicle } from '@/vehicles/models/vehicle.interface'

export interface Route {
  id: string
  startLocation: string
  endLocation: string
  materialType: string
  name: string
  code: string
  checked: boolean
  doubleLicensePlate: boolean
  isFull: boolean

  userCompany: string
  vehicleCompany: string
  vehicleContractor: string
  vehicleSponsor: string
  vehicleOwner: string
  differentOwner: boolean

  vehicles: Vehicle[]
  reports: Report[]
  routeProfiles: RouteProfile[]

  message: string
  state: string

  createdAt: string
  updatedAt: string
  active: boolean
}

export const ROUTE_INITIAL_STATE: Route = {
  id: '',
  startLocation: '',
  endLocation: '',
  materialType: '',
  name: '',
  code: '',
  userCompany: '',
  vehicleCompany: '',
  vehicleContractor: '',
  vehicleSponsor: '',
  vehicleOwner: '',
  differentOwner: false,
  checked: false,
  doubleLicensePlate: false,
  isFull: false,
  vehicles: [],
  reports: [],
  routeProfiles: [],

  message: '',
  state: '',

  createdAt: '',
  updatedAt: '',
  active: true
}

import { type RouteProfile } from '@/profiles/models/route-profile.interface'
import { type Report } from '@/reports/models/report.interface'
import { type Vehicle } from './vehicle.interface'

export interface Route {
  id: string
  createdAt: string
  updatedAt: string
  startLocation: string
  endLocation: string
  materialType: string
  name: string
  code: string
  message: string
  state: string
  checked: boolean
  doubleLicensePlate: boolean
  isFull: boolean
  active: boolean
  vehicles: Vehicle[]
  reports: Report[]
  routeProfiles: RouteProfile[]
}

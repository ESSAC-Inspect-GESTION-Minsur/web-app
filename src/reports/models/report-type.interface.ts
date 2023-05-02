import { type VehicleType } from '@/routes/models/vehicle-type.interface'
import { type ReportTypeGroup } from './report-type-group.interface'

export interface ReportType {
  createdAt: string
  updatedAt: string
  id: string
  name: string
  active: boolean
  company: string
  reportTypeGroup: ReportTypeGroup | null
  vehicleTypes: VehicleType[]
}

export const REPORT_TYPE_INITIAL_STATE: ReportType = {
  createdAt: '',
  updatedAt: '',
  id: '',
  name: '',
  company: '',
  active: false,
  vehicleTypes: [],
  reportTypeGroup: null
}

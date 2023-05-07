import { type Checkpoint } from '@/checkpoints/models/checkpoint.interface'
import { REPORT_TYPE_INITIAL_STATE, type ReportType } from './report-type.interface'

export interface Report {
  id: string
  location: string
  checked: boolean
  type: string
  checkpoints: Checkpoint[]
  routeId: string
  reportType: ReportType

  createdAt: string
  updatedAt: string
  active: boolean
}

export const REPORT_INITIAL_STATE: Report = {
  createdAt: '',
  updatedAt: '',
  id: '',
  location: '',
  checked: false,
  active: true,
  type: '',
  checkpoints: [],
  routeId: '',
  reportType: REPORT_TYPE_INITIAL_STATE
}

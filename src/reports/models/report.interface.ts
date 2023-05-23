import { REPORT_TYPE_INITIAL_STATE, type ReportType } from './report-type.interface'
import { type CheckpointGroup } from '@/checkpoints/models/checkpoint-group.interface'

export interface Report {
  id: string
  location: string
  checked: boolean
  type: string
  checkpointGroups: CheckpointGroup[]
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
  checkpointGroups: [],
  routeId: '',
  reportType: REPORT_TYPE_INITIAL_STATE
}

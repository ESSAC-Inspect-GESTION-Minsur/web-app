import { type Checkpoint } from './checkpoint.interface'
import { type ReportType } from './report-type.interface'

export interface Report {
  createdAt: string
  updatedAt: string
  active: boolean
  id: string
  location: string
  checked: boolean
  type: string
  checkpoints: Checkpoint[]
  routeId: string
  reportType: ReportType
}

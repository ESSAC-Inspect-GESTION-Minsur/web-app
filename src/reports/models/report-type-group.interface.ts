import { type Project } from '@/users/models/project.interface'
import { type ReportType } from './report-type.interface'

export interface ReportTypeGroup {
  id: string
  name: string
  reportTypes: ReportType[]
  project: Project | null

  createdAt: string
  updatedAt: string
  active: boolean
}

export interface ReportTypeGroupDto extends Pick<ReportTypeGroup, 'name'> {}

export const REPORT_TYPE_GROUP_DTO_INITIAL_STATE: ReportTypeGroupDto = {
  name: ''
}

export const REPORT_TYPE_GROUP_INITIAL_STATE: ReportTypeGroup = {
  id: '',
  name: '',
  createdAt: '',
  updatedAt: '',
  active: false,
  reportTypes: [],
  project: null
}

import { type ReportType } from './report-type.interface'

export interface ReportTypeGroup {
  id: string
  name: string
  reportTypes: ReportType[]

  createdAt: string
  updatedAt: string
  active: boolean
}

export interface ReportTypeGroupDto extends Pick<ReportTypeGroup, 'name'> {}

export const REPORT_TYPE_GROUP_DTO_INITIAL_STATE = {
  name: ''
}

export const REPORT_TYPE_GROUP_INITIAL_STATE = {
  id: '',
  name: '',
  createdAt: '',
  updatedAt: '',
  active: false,
  reportTypes: []
}

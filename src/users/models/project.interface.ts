import { type ReportTypeGroup } from '@/reports/models/report-type-group.interface'
import { type Sponsor } from './sponsor.interface'

export interface Project {
  id: string
  name: string
  sponsors: Sponsor[]
  reportTypeGroups: ReportTypeGroup[]

  createdAt: string
  updatedAt: string
  active: boolean
}

export interface ProjectDto extends Pick<Project, 'name'> {}

export const PROJECT_INITIAL_STATE: Project = {
  id: '',
  name: '',
  sponsors: [],
  reportTypeGroups: [],
  createdAt: '',
  updatedAt: '',
  active: false
}

export const PROJECT_DTO_INITIAL_STATE: ProjectDto = {
  name: ''
}

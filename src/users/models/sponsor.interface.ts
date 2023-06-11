import { type Project } from './project.interface'

export interface Sponsor {
  id: string
  name: string
  project: Project | null

  createdAt: string
  updatedAt: string
  active: boolean
}

export interface SponsorDto extends Pick<Sponsor, 'name'> {
  projectId: string
}

export const SPONSOR_INITIAL_STATE: Sponsor = {
  id: '',
  name: '',
  project: null,
  createdAt: '',
  updatedAt: '',
  active: false
}

export const SPONSOR_DTO_INITIAL_STATE: SponsorDto = {
  name: '',
  projectId: ''
}

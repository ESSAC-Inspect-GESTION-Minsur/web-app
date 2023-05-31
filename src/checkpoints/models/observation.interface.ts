import { type OBSERVATION_STATUS } from './enum/status.enum'

export interface Observation {
  id: string
  fieldName: string
  message: string
  imageEvidence: string
  status: OBSERVATION_STATUS

  createdAt: string
  updatedAt: string
  active: boolean
}

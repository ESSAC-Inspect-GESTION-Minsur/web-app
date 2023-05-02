import { type Profile } from '@/profiles/models/profile.entity'
import { type Observation } from './observation.interface'

export interface Checkpoint {
  id: string
  checked: boolean
  location: string
  createdAt: string
  updatedAt: string
  active: boolean
  observations: Observation[]
  profile: Profile
}

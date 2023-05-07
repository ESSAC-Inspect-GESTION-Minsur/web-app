import { type Profile } from '@/profiles/models/profile.interface'
import { type Observation } from './observation.interface'

export interface Checkpoint {
  id: string
  checked: boolean
  location: string
  observations: Observation[]
  profile: Profile

  createdAt: string
  updatedAt: string
  active: boolean
}

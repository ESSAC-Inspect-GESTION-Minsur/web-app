import { type Profile } from './profile.entity'

export interface RouteProfile {
  profileId: string
  routeId: string
  role: string
  supervisor: boolean
  profile: Profile
}

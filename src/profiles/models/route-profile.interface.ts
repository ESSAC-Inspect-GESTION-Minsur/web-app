import { type Profile } from './profile.interface'

export interface RouteProfile {
  profileId: string
  routeId: string
  role: string
  supervisor: boolean
  profile: Profile
}

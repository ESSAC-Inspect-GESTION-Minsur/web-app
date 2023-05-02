import { type User } from '../user.model'

export interface UserApiResponse {
  tokens: {
    accessToken: string
  }
  authenticatedUser: User
}

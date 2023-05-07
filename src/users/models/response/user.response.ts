import { type User } from '../user.interface'

export interface UserResponse {
  tokens: {
    accessToken: string
  }
  authenticatedUser: User
}

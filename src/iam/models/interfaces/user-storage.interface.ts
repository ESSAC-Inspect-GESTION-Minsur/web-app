import { type Area } from '../user.model'

export interface UserStorage {
  id: string
  role: string
  areas: Area[]
  username: string
  company: string
}

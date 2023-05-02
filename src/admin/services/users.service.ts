import { type User } from '@/iam/models/user.model'
import { type Profile, type ProfileDto } from '@/profiles/models/profile.entity'
import { AppServices } from '@/shared/service/app-api.service'
import { type AddUser } from '../models/add-user.interface'
import { type ChangeRole } from '../models/change-role.interface'

export class UsersService extends AppServices {
  constructor () {
    super({ baseUrl: 'users', contentType: 'application/json' })
  }

  getAll = async (): Promise<User[]> => {
    return await this.get<User[]>('')
      .then(response => response.data)
  }

  create = async (user: AddUser): Promise<User> => {
    return await this.post<User>('', user)
      .then(response => response.data)
  }

  changeRole = async (changeRole: ChangeRole, userId: string): Promise<User> => {
    return await this.patch<User>(`/${userId}`, changeRole)
      .then(response => response.data)
  }

  toggleActiveUser = async (userId: string): Promise<User> => {
    return await this.patch<User>(`/${userId}/toggle-active`)
      .then(response => response.data)
  }

  remove = async (id: string): Promise<User> => {
    return await this.delete<User>(`/${id}`)
      .then(response => response.data)
  }

  createProfile = async (userId: string, profile: ProfileDto): Promise<Profile> => {
    return await this.post<Profile>(`/${userId}/profile`, profile)
      .then(response => response.data)
  }

  getProfile = async (userId: string): Promise<Profile> => {
    return await this.get<Profile>(`/${userId}/profile`)
      .then(response => response.data)
  }
}

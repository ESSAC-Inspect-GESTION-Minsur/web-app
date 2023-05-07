import { AppServices } from '@/shared/service/api.service'
import { type UserDto, type User, type UserChangeRole } from '../models/user.interface'
import { type Profile, type ProfileDto } from '@/profiles/models/profile.interface'

export class UsersService extends AppServices {
  constructor () {
    super({ baseUrl: 'users', contentType: 'application/json' })
  }

  findAll = async (): Promise<User[]> => {
    return await this.get<User[]>('')
      .then(response => response.data)
  }

  create = async (user: UserDto): Promise<User> => {
    const { areaId, ...userDto } = user
    return await this.post<User>('', userDto)
      .then(response => response.data)
  }

  changeRole = async (userChangeRole: UserChangeRole, userId: string): Promise<User> => {
    const { id, ...userChangeRoleDto } = userChangeRole
    return await this.patch<User>(`/${userId}`, userChangeRoleDto)
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

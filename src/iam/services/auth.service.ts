import { AppServices } from '@/shared/service/app-api.service'
import { StatusCodes } from 'http-status-codes'
import { type LoginData } from '../models/interfaces/login.interface'
import { type UserApiResponse } from '../models/interfaces/user-api.interface'
import { type UserStorage } from '../models/interfaces/user-storage.interface'
import { type User } from '../models/user.model'
import { TokenService } from './token.service'

export class AuthServices extends AppServices {
  constructor () {
    super({ baseUrl: 'auth', contentType: 'application/json' })
  }

  login = async (loginData: LoginData): Promise<UserStorage | null | undefined> => {
    return await this.post<UserApiResponse>('/login', loginData)
      .then(response => {
        if (response.status === StatusCodes.CREATED) {
          const { tokens, authenticatedUser } = response.data
          const { id, username, role, areas, company } = authenticatedUser

          const userStorage: UserStorage = {
            id,
            username,
            role,
            areas,
            company
          }

          TokenService.saveToken(tokens.accessToken)
          sessionStorage.setItem('user', JSON.stringify(userStorage))

          return userStorage
        }
      })
  }

  logout = (): void => {
    TokenService.removeToken()
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('routes-request')
  }

  currentUser = async (): Promise<User | null> => {
    const response = await this.post<UserApiResponse>('/user')

    if (response.status === StatusCodes.CREATED) {
      return response.data.authenticatedUser
    }

    return null
  }
}

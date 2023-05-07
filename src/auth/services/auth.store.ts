import StoreService from '@/shared/service/store.service'
import { type UserToStorage } from '@/users/models/user.interface'

interface AppStorage {
  token: string
  user: UserToStorage | null
}

const APP_STORAGE: AppStorage = {
  token: 'token',
  user: null
}

export class AuthStore {
  store: StoreService<AppStorage>
  constructor () {
    this.store = new StoreService<AppStorage>({ initialState: APP_STORAGE })
  }

  getToken = (): string | null => {
    return this.store.get('token')
  }

  saveToken = (_token: string): void => {
    this.store.set('token', _token)
  }

  removeToken = (): void => {
    this.store.remove('token')
  }

  getUser = (): UserToStorage | null => {
    return this.store.get('user')
  }

  saveUser = (user: UserToStorage): void => {
    this.store.set('user', user)
  }

  removeUser = (): void => {
    this.store.remove('user')
  }
}

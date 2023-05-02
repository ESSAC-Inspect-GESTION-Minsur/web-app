import { AppServices } from '@/shared/service/app-api.service'
import { type Profile } from '../models/profile.entity'

export class ProfileService extends AppServices {
  constructor () {
    super({ baseUrl: 'profiles', contentType: 'application/json' })
  }

  findAll = async (): Promise<Profile[]> => {
    return await this.get<Profile[]>('')
      .then(response => response.data)
  }

  findById = async (id: string): Promise<Profile> => {
    return await this.get<Profile>(`/id/${id}`)
      .then(response => response.data)
  }

  assignCompany = async (id: string, companyId: string): Promise<Profile> => {
    return await this.patch<Profile>(`/${id}/assign-company/${companyId}`)
      .then(response => response.data)
  }

  removeCompany = async (id: string, companyId: string): Promise<Profile> => {
    return await this.patch<Profile>(`/${id}/remove-company/${companyId}`)
      .then(response => response.data)
  }
}

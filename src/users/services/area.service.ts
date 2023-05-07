import { AppServices } from '@/shared/service/api.service'
import { type AreaDto, type Area } from '../models/area.interface'
import { type User } from '../models/user.interface'

export class AreasService extends AppServices {
  constructor () {
    super({ baseUrl: 'areas', contentType: 'application/json' })
  }

  findAll = async (): Promise<Area[]> => {
    return await this.get<Area[]>('/')
      .then(response => response.data)
  }

  assignUser = async (areaId: string, userId: string): Promise<User> => {
    return await this.post<User>(`/${areaId}/users/${userId}`)
      .then(response => response.data)
  }

  create = async (area: AreaDto): Promise<Area> => {
    return await this.post<Area>('/', area)
      .then(response => response.data)
  }

  update = async (area: AreaDto, id: string): Promise<Area> => {
    return await this.patch<Area>(`/${id}`, area)
      .then(response => response.data)
  }

  remove = async (id: string): Promise<Area> => {
    return await this.delete<Area>(`/${id}`)
      .then(response => response.data)
  }
}

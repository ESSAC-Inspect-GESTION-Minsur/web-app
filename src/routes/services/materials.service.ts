import { AppServices } from '@/shared/service/app-api.service'
import { type Material, type MaterialDto } from '../models/material.interface'

export class MaterialsService extends AppServices {
  constructor () {
    super({ baseUrl: 'materials', contentType: 'application/json' })
  }

  findAll = async (): Promise<Material[]> => {
    return await this.get<Material[]>('')
      .then(response => response.data)
  }

  create = async (material: MaterialDto): Promise<Material> => {
    return await this.post<Material>('', material)
      .then(response => response.data)
  }

  update = async (id: string, material: MaterialDto): Promise<Material> => {
    return await this.patch<Material>(`/${id}`, material)
      .then(response => response.data)
  }

  remove = async (id: string): Promise<Material> => {
    return await this.delete<Material>(`/${id}`)
      .then(response => response.data)
  }
}

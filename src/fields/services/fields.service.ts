import { AppServices } from '@/shared/service/api.service'
import { type FieldDto, type Field } from '../models/field.interface'

export class FieldsService extends AppServices {
  constructor () {
    super({ baseUrl: 'fields', contentType: 'application/json' })
  }

  findAll = async (): Promise<Field[]> => {
    return await this.get<Field[]>('')
      .then(response => response.data)
  }

  remove = async (id: string): Promise<Field> => {
    return await this.delete<Field>(`/${id}`)
      .then(response => response.data)
  }

  create = async (field: FieldDto): Promise<Field> => {
    return await this.post<Field>('', field)
      .then(response => response.data)
  }

  update = async (field: FieldDto, id: string): Promise<Field> => {
    return await this.patch<Field>(`/${id}`, field)
      .then(response => response.data)
  }

  toggleActive = async (id: string): Promise<Field> => {
    return await this.patch<Field>(`/${id}/toggle-active`)
      .then(response => response.data)
  }
}

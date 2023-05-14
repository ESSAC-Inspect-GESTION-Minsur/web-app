import { AppServices } from '@/shared/service/api.service'
import { type ContractorDto, type Contractor } from '../models/contractor.interface'

export class ContractorsService extends AppServices {
  constructor () {
    super({ baseUrl: 'contractors', contentType: 'application/json' })
  }

  findAll = async (): Promise<Contractor[]> => {
    return await this.get<Contractor[]>('')
      .then(response => response.data)
  }

  create = async (contractor: ContractorDto): Promise<Contractor> => {
    return await this.post<Contractor>('', contractor)
      .then(response => response.data)
  }

  findById = async (id: string): Promise<Contractor> => {
    return await this.get<Contractor>(`/${id}`)
      .then(response => response.data)
  }

  update = async (contractor: ContractorDto, id: string): Promise<Contractor> => {
    return await this.patch<Contractor>(`/${id}`, contractor)
      .then(response => response.data)
  }

  toggleActive = async (id: string): Promise<Contractor> => {
    return await this.patch<Contractor>(`/${id}/toggle-active`)
      .then(response => response.data)
  }

  remove = async (id: string): Promise<Contractor> => {
    return await this.delete<Contractor>(`/${id}`)
      .then(response => response.data)
  }
}

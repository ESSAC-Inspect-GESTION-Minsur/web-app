import { AppServices } from '@/shared/service/api.service'
import { type CompanyDto, type Company } from '../models/company.interface'

export class CompaniesService extends AppServices {
  constructor () {
    super({ baseUrl: 'companies', contentType: 'application/json' })
  }

  findAll = async (): Promise<Company[]> => {
    return await this.get<Company[]>('')
      .then(response => response.data)
  }

  findById = async (id: string): Promise<Company> => {
    return await this.get<Company>(`/${id}`)
      .then(response => response.data)
  }

  create = async (companyDto: CompanyDto): Promise<Company> => {
    return await this.post<Company>('', companyDto)
      .then(response => response.data)
  }

  update = async (companyDto: CompanyDto, id: string): Promise<Company> => {
    return await this.patch<Company>(`/${id}`, companyDto)
      .then(response => response.data)
  }

  assignContractor = async (id: string, contractorId: string): Promise<Company> => {
    return await this.patch<Company>(`/${id}/assign-contractor/${contractorId}`)
      .then(response => response.data)
  }

  removeContractor = async (id: string, contractorId: string): Promise<Company> => {
    return await this.patch<Company>(`/${id}/remove-contractor/${contractorId}`)
      .then(response => response.data)
  }

  remove = async (id: string): Promise<Company> => {
    return await this.delete<Company>(`/${id}`)
      .then(response => response.data)
  }
}

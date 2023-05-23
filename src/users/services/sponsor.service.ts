import { AppServices } from '@/shared/service/api.service'
import { type SponsorDto, type Sponsor } from '../models/sponsor.interface'
import { type User } from '../models/user.interface'

export class SponsorsService extends AppServices {
  constructor () {
    super({ baseUrl: 'sponsors', contentType: 'application/json' })
  }

  findAll = async (projectId: string): Promise<Sponsor[]> => {
    return await this.get<Sponsor[]>(`?projectId=${projectId}`)
      .then(response => response.data)
  }

  create = async (sponsorDto: SponsorDto): Promise<Sponsor> => {
    const { projectId, ...sponsor } = sponsorDto
    return await this.post<Sponsor>(`?projectId=${projectId}`, sponsor)
      .then(response => response.data)
  }

  update = async (sponsorDto: SponsorDto, id: string): Promise<Sponsor> => {
    const { projectId, ...sponsor } = sponsorDto
    return await this.patch<Sponsor>(`/${id}`, sponsor)
      .then(response => response.data)
  }

  remove = async (id: string): Promise<Sponsor> => {
    return await this.delete<Sponsor>(`/${id}`)
      .then(response => response.data)
  }

  assignUser = async (sponsorId: string, userId: string): Promise<User> => {
    return await this.post<User>(`/${sponsorId}/users/${userId}`)
      .then(response => response.data)
  }

  assignVehicle = async (sponsorId: string, vehicleId: string): Promise<User> => {
    return await this.post<User>(`/${sponsorId}/vehicles/${vehicleId}`)
      .then(response => response.data)
  }
}

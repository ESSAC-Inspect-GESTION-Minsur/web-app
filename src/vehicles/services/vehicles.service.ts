import { AppServices } from '@/shared/service/api.service'
import { type VehicleDto, type Vehicle } from '../models/vehicle.interface'

export class VehiclesService extends AppServices {
  constructor () {
    super({ baseUrl: 'vehicles', contentType: 'application/json' })
  }

  findAll = async (): Promise<Vehicle[]> => {
    return await this.get<Vehicle[]>('')
      .then(response => response.data)
  }

  create = async (vehicleDto: VehicleDto, vehicleTypeId: string): Promise<Vehicle> => {
    const { vehicleTypeId: _, ...vehicle } = vehicleDto
    return await this.post<Vehicle>(`/${vehicleTypeId}`, vehicle)
      .then(response => response.data)
  }

  update = async (vehicleDto: VehicleDto, licensePlate: string): Promise<Vehicle> => {
    const { vehicleTypeId: _, ...vehicle } = vehicleDto
    return await this.patch<Vehicle>(`/${licensePlate}`, vehicle)
      .then(response => response.data)
  }

  remove = async (licensePlate: string): Promise<Vehicle> => {
    return await this.delete<Vehicle>(`/${licensePlate}`)
      .then(response => response.data)
  }

  assignCompany = async (licensePlate: string, companyId: string): Promise<Vehicle> => {
    return await this.patch<Vehicle>(`/${licensePlate}/assign-company/${companyId}`)
      .then(response => response.data)
  }

  assignSponsor = async (licensePlate: string, sponsorId: string): Promise<Vehicle> => {
    return await this.patch<Vehicle>(`/${licensePlate}/assign-sponsor/${sponsorId}`)
      .then(response => response.data)
  }
}

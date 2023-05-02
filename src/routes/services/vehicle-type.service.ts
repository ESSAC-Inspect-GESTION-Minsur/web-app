import { AppServices } from '@/shared/service/app-api.service'
import { type Material } from '../models/material.interface'
import { type VehicleTypeDto, type VehicleType } from '../models/vehicle-type.interface'

export class VehicleTypesService extends AppServices {
  constructor () {
    super({ baseUrl: 'vehicle-types', contentType: 'application/json' })
  }

  findAll = async (): Promise<VehicleType[]> => {
    return await this.get<VehicleType[]>('')
      .then(response => response.data)
  }

  create = async (vehicleTypeDto: VehicleTypeDto): Promise<VehicleType> => {
    return await this.post<VehicleType>('', vehicleTypeDto)
      .then(response => response.data)
  }

  update = async (vehicleTypeDto: VehicleTypeDto, id: string): Promise<VehicleType> => {
    return await this.patch<VehicleType>(`/${id}`, vehicleTypeDto)
      .then(response => response.data)
  }

  remove = async (id: string): Promise<VehicleType> => {
    return await this.delete<VehicleType>(`/${id}`)
      .then(response => response.data)
  }

  assingChild = async (id: string, childId: string): Promise<VehicleType> => {
    return await this.patch<VehicleType>(`/${id}/assign-child/${childId}`)
      .then(response => response.data)
  }

  removeChild = async (id: string, childId: string): Promise<VehicleType> => {
    return await this.patch<VehicleType>(`/${id}/remove-child/${childId}`)
      .then(response => response.data)
  }

  findAllMaterials = async (id: string): Promise<Material[]> => {
    return await this.get<Material[]>(`/${id}/materials`)
      .then(response => response.data)
  }

  assignMaterial = async (id: string, materialId: string): Promise<VehicleType> => {
    return await this.patch<VehicleType>(`/${id}/assign-material/${materialId}`)
      .then(response => response.data)
  }

  removeMaterial = async (id: string, materialId: string): Promise<VehicleType> => {
    return await this.delete<VehicleType>(`/${id}/remove-material/${materialId}`)
      .then(response => response.data)
  }
}

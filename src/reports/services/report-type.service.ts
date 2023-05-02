import { AppServices } from '@/shared/service/app-api.service'
import { type ReportTypeDto } from '../models/interfaces/report-type-dto.interface'
import { type ReportType } from '../models/report-type.interface'
import { type Group } from '../models/group.interface'
import { type GroupField } from '../models/group-field.interface'
import { type VehicleType } from '@/routes/models/vehicle-type.interface'

export class ReportTypesService extends AppServices {
  constructor () {
    super({ baseUrl: 'report-types', contentType: 'application/json' })
  }

  findAll = async (): Promise<ReportType[]> => {
    return await this.get<ReportType[]>('')
      .then(response => response.data)
  }

  findAllGroups = async (id: string): Promise<Group[]> => {
    return await this.get<Group[]>(`/${id}/groups`)
      .then(response => response.data)
  }

  findAllGroupFields = async (id: string): Promise<GroupField[]> => {
    return await this.get<GroupField[]>(`/${id}/groups/fields`)
      .then(response => response.data)
  }

  findAllVehicleTypes = async (id: string): Promise<VehicleType[]> => {
    console.log(id)
    return await this.get<VehicleType[]>(`/${id}/vehicle-types`)
      .then(response => response.data)
  }

  create = async (reportType: ReportTypeDto): Promise<ReportType> => {
    return await this.post<ReportType>('', reportType)
      .then(response => response.data)
  }

  update = async (id: string, reportType: ReportTypeDto): Promise<ReportType> => {
    return await this.patch<ReportType>(`/${id}`, reportType)
      .then(response => response.data)
  }

  toggleActive = async (id: string): Promise<ReportType> => {
    return await this.patch<ReportType>(`/${id}/toggle-active`)
      .then(response => response.data)
  }

  createGroup = async (reportTypeId: string, group: Pick<Group, 'name'>): Promise<Group> => {
    return await this.post<Group>(`/${reportTypeId}/groups`, group)
      .then(response => response.data)
  }

  assignVehicleType = async (reportTypeId: string, vehicleTypeId: string): Promise<ReportType> => {
    return await this.post<ReportType>(`/${reportTypeId}/vehicle-types/${vehicleTypeId}`)
      .then(response => response.data)
  }

  removeVehicleType = async (reportTypeId: string, vehicleTypeId: string): Promise<ReportType> => {
    return await this.delete<ReportType>(`/${reportTypeId}/vehicle-types/${vehicleTypeId}`)
      .then(response => response.data)
  }
}

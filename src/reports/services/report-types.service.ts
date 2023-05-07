
import { AppServices } from '@/shared/service/api.service'
import { type VehicleType } from '@/vehicles/models/vehicle-type.interface'
import { type GroupDto, type Group } from '@/fields/models/group.interface'
import { type GroupField } from '@/fields/models/group-field.interface'
import { type ReportTypeDto, type ReportType } from '../models/report-type.interface'

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

  update = async (reportType: ReportTypeDto, id: string): Promise<ReportType> => {
    return await this.patch<ReportType>(`/${id}`, reportType)
      .then(response => response.data)
  }

  toggleActive = async (id: string): Promise<ReportType> => {
    return await this.patch<ReportType>(`/${id}/toggle-active`)
      .then(response => response.data)
  }

  createGroup = async (group: GroupDto, reportTypeId: string): Promise<Group> => {
    const { reportTypeId: _, ...groupDto } = group
    return await this.post<Group>(`/${reportTypeId}/groups`, groupDto)
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

import { AppServices } from '@/shared/service/app-api.service'
import { type ReportTypeGroupDto, type ReportTypeGroup } from '../models/report-type-group.interface'

export class ReportTypeGroupService extends AppServices {
  constructor () {
    super({ baseUrl: 'report-type-groups', contentType: 'application/json' })
  }

  findAll = async (): Promise<ReportTypeGroup[]> => {
    return await this.get<ReportTypeGroup[]>('')
      .then(response => response.data)
  }

  findById = async (): Promise<ReportTypeGroup> => {
    return await this.get<ReportTypeGroup>('')
      .then(response => response.data)
  }

  create = async (group: ReportTypeGroupDto): Promise<ReportTypeGroup> => {
    return await this.post<ReportTypeGroup>('', group)
      .then(response => response.data)
  }

  assignReportType = async (id: string, reportTypeId: string): Promise<ReportTypeGroup> => {
    return await this.post<ReportTypeGroup>(`/${id}/assign-report-types/${reportTypeId}`)
      .then(response => response.data)
  }

  removeReportType = async (id: string, reportTypeId: string): Promise<ReportTypeGroup> => {
    return await this.patch<ReportTypeGroup>(`/${id}/remove-report-types/${reportTypeId}`)
      .then(response => response.data)
  }

  update = async (group: ReportTypeGroupDto, id: string): Promise<ReportTypeGroup> => {
    return await this.patch<ReportTypeGroup>(`/${id}`, group)
      .then(response => response.data)
  }

  remove = async (id: string): Promise<ReportTypeGroup> => {
    return await this.delete<ReportTypeGroup>(`/${id}`)
      .then(response => response.data)
  }
}

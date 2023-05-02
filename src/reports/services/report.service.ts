import { AppServices } from '@/shared/service/app-api.service'
import { type Checkpoint } from '../models/checkpoint.interface'
import { type FieldReport } from '../models/field-report.interface'
import { type Report } from '../models/report.interface'

export interface FindAllReportsOptions {
  dateStart: string
  dateEnd: string
}

export class ReportsService extends AppServices {
  constructor () {
    super({ baseUrl: 'reports', contentType: 'application/json' })
  }

  findAll = async ({ dateStart, dateEnd }: FindAllReportsOptions): Promise<Report[]> => {
    return await this.get<Report[]>(`?date-start=${dateStart}&date-end=${dateEnd}`)
      .then(response => {
        sessionStorage.setItem('reports', JSON.stringify(response.data))
        sessionStorage.setItem('last-request-reports', JSON.stringify(new Date()))
        return response.data
      })
  }

  findAllFieldsByReportId = async (reportId: string): Promise<FieldReport[]> => {
    return await this.get<FieldReport[]>(`/${reportId}/fields`)
      .then(response => response.data)
  }

  findAllCheckpoints = async (reportId: string): Promise<Checkpoint[]> => {
    return await this.get<Checkpoint[]>(`/${reportId}/checkpoints`)
      .then(response => response.data)
  }
}

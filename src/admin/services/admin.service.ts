import { AppServices } from '@/shared/service/api.service'
import { type ExcelResponse } from '../responses/excel.response'

export class AdminService extends AppServices {
  constructor () {
    super({ baseUrl: 'admin', contentType: 'application/json' })
  }

  importDriverExcel = async (file: any): Promise<ExcelResponse> => {
    return await this.post<ExcelResponse>('/import-driver-excel', file)
      .then(response => response.data)
  }

  importVehicleExcel = async (file: any): Promise<ExcelResponse> => {
    return await this.post<ExcelResponse>('/import-vehicle-excel', file)
      .then(response => response.data)
  }

  importCartExcel = async (file: any): Promise<ExcelResponse> => {
    return await this.post<ExcelResponse>('/import-cart-excel', file)
      .then(response => response.data)
  }

  importCompanyExcel = async (file: any): Promise<ExcelResponse> => {
    return await this.post<ExcelResponse>('/import-company-excel', file)
      .then(response => response.data)
  }

  importAssignUserCompanyExcel = async (file: any): Promise<ExcelResponse> => {
    return await this.post<ExcelResponse>('/import-assign-company-drivers-excel', file)
      .then(response => response.data)
  }

  importAssignVehicleCompanyExcel = async (file: any): Promise<ExcelResponse> => {
    return await this.post<ExcelResponse>('/import-assign-company-vehicles-excel', file)
      .then(response => response.data)
  }
}

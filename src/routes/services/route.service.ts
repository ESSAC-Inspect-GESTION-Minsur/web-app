import { type Report } from '@/reports/models/report.interface'
import { type DateRange } from '@/shared/types/date-range'
import { AppServices } from '@/shared/service/api.service'
import { type Route } from '../models/route.interface'

export interface FindAllOptions {
  dateRange: DateRange
  profileId: string
}

export default class RoutesServices extends AppServices {
  constructor () {
    super({ baseUrl: 'routes', contentType: 'application/json' })
  }

  findAll = async ({ dateRange, profileId }: FindAllOptions): Promise<Route[]> => {
    const dateStart = dateRange.formattedDateStart()
    const dateEnd = dateRange.formattedDateEnd()

    return await this.get<Route[]>(`?date-start=${dateStart}&date-end=${dateEnd}&profile-id=${profileId}`)
      .then(response => {
        const routes = response.data
        createRouteStorage(routes, dateRange)
        return routes
      })
  }

  findById = async (id: string): Promise<Route> => {
    return await this.get<Route>(`/${id}`)
      .then(response => response.data)
  }
}
export class RoutePDFServices extends AppServices {
  constructor () {
    super({ baseUrl: 'routes', contentType: 'application/pdf' })
  }

  exportPdf = async (code: string, type: string): Promise<void> => {
    await this.get<any>(`/${code}/generate-pdf`, {
      responseType: 'blob'
    })
      .then(response => {
        const blob = new Blob([response.data], { type: 'application/pdf' })
        const downloadUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')

        link.href = downloadUrl
        link.download = `${code}_${type}.pdf`.toUpperCase()
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
  }
}

const createRouteStorage = (routes: Route[], dateRange: DateRange): void => {
  const aux: Report[] = []
  const reports = routes.reduce((previosValue, currentValue) => previosValue.concat(currentValue.reports), aux)

  sessionStorage.setItem('routes-request', JSON.stringify({
    routes,
    reports,
    dateRange: dateRange.toObject(),
    lastRequest: new Date()
  }))
}

import { AppServices } from '@/shared/service/api.service'
import { type CheckpointGroup } from '../models/checkpoint-group.interface'

export class CheckpointGroupsService extends AppServices {
  constructor () {
    super({ baseUrl: 'checkpoint-groups', contentType: 'application/json' })
  }

  findAllByReportId = async (reportId: string): Promise<CheckpointGroup[]> => {
    return await this.get<CheckpointGroup[]>(`?reportId=${reportId}`)
      .then(response => {
        console.log(response)
        return response.data
      })
  }
}

export class CheckpointPDFServices extends AppServices {
  constructor () {
    super({ baseUrl: 'checkpoints', contentType: 'application/pdf' })
  }

  exportPdf = async (id: string): Promise<void> => {
    await this.get<any>(`/${id}/generate-pdf`, {
      responseType: 'blob'
    })
      .then(response => {
        const blob = new Blob([response.data], { type: 'application/pdf' })
        const downloadUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')

        link.href = downloadUrl
        link.download = `${id}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
  }
}

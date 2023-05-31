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

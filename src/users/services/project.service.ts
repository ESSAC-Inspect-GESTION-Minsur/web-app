import { AppServices } from '@/shared/service/api.service'
import { type ProjectDto, type Project } from '../models/project.interface'

export class ProjectsService extends AppServices {
  constructor () {
    super({ baseUrl: 'projects', contentType: 'application/json' })
  }

  findAll = async (): Promise<Project[]> => {
    return await this.get<Project[]>('')
      .then(response => response.data)
  }

  create = async (projectDto: ProjectDto): Promise<Project> => {
    return await this.post<Project>('/', projectDto)
      .then(response => response.data)
  }

  update = async (projectDto: ProjectDto, projectId: string): Promise<Project> => {
    return await this.patch<Project>(`/${projectId}`, projectDto)
      .then(response => response.data)
  }

  toggleActive = async (projectId: string): Promise<Project> => {
    return await this.patch<Project>(`/${projectId}/toggle-active`)
      .then(response => response.data)
  }
}

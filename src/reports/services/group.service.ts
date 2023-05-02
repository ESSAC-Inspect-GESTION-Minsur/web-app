import { AppServices } from '@/shared/service/app-api.service'
import { type GroupFieldDto, type GroupField } from '../models/group-field.interface'
import { type Group } from '../models/group.interface'

export class GroupsService extends AppServices {
  constructor () {
    super({ baseUrl: 'groups', contentType: 'application/json' })
  }

  findAll = async (): Promise<Group[]> => {
    return await this.get<Group[]>('')
      .then(response => response.data)
  }

  update = async (id: string, group: Pick<Group, 'name'>): Promise<Group> => {
    console.log(group)
    return await this.patch<Group>(`/${id}`, group)
      .then(response => response.data)
  }

  remove = async (id: string): Promise<Group> => {
    return await this.delete<Group>(`/${id}`)
      .then(response => response.data)
  }

  findAllFields = async (groupId: string): Promise<GroupField[]> => {
    return await this.get<GroupField[]>(`/${groupId}/fields`)
      .then(response => response.data)
  }

  assignField = async (groupId: string, fieldId: string, groupFieldDto: GroupFieldDto): Promise<GroupField> => {
    return await this.post<GroupField>(`/${groupId}/fields/${fieldId}`, groupFieldDto)
      .then(response => response.data)
  }

  updateField = async (groupId: string, fieldId: string, groupFieldDto: GroupFieldDto): Promise<GroupField> => {
    return await this.patch<GroupField>(`/${groupId}/fields/${fieldId}`, groupFieldDto)
      .then(response => response.data)
  }

  deleteField = async (groupId: string, fieldId: string): Promise<GroupField> => {
    return await this.delete<GroupField>(`/${groupId}/fields/${fieldId}`)
      .then(response => response.data)
  }
}

import { type GroupField, type GroupFieldDto } from '@/fields/models/group-field.interface'
import { type GroupDto, type Group } from '@/fields/models/group.interface'
import { AppServices } from '@/shared/service/api.service'

export class GroupsService extends AppServices {
  constructor () {
    super({ baseUrl: 'groups', contentType: 'application/json' })
  }

  findAll = async (): Promise<Group[]> => {
    return await this.get<Group[]>('')
      .then(response => response.data)
  }

  update = async (group: GroupDto, id: string): Promise<Group> => {
    const { reportTypeId, ...groupDto } = group
    return await this.patch<Group>(`/${id}`, groupDto)
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
    const { groupId: _, fieldId: __, ...groupField } = groupFieldDto

    return await this.post<GroupField>(`/${groupId}/fields/${fieldId}`, groupField)
      .then(response => response.data)
  }

  updateField = async (groupId: string, fieldId: string, groupFieldDto: GroupFieldDto): Promise<GroupField> => {
    const { groupId: _, fieldId: __, ...groupField } = groupFieldDto
    return await this.patch<GroupField>(`/${groupId}/fields/${fieldId}`, groupField)
      .then(response => response.data)
  }

  deleteField = async (groupId: string, fieldId: string): Promise<GroupField> => {
    return await this.delete<GroupField>(`/${groupId}/fields/${fieldId}`)
      .then(response => response.data)
  }
}

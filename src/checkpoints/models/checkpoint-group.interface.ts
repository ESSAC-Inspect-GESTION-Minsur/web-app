import { type Checkpoint } from './checkpoint.interface'

export interface CheckpointGroup {
  id: string
  type: string
  checkpoints: Checkpoint[]

  createdAt: string
  updatedAt: string
  active: boolean
}

export interface CheckpointGroupDto extends Pick<CheckpointGroup, 'type'> {}

export const CHECKPOINT_GROUP_INITIAL_STATE: CheckpointGroup = {
  id: '',
  type: '',
  checkpoints: [],
  createdAt: '',
  updatedAt: '',
  active: true
}

export const CHECKPOINT_GROUP_DTO_INITIAL_STATE: CheckpointGroupDto = {
  type: ''
}

import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { useArrayReducer } from '@/shared/hooks/useArrayReducer'
import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import { type GroupField } from '@/fields/models/group-field.interface'
import { GroupsService } from '@/reports/services/groups.service'
import { GroupContext } from '../contexts/GroupContext'
import GroupFieldsTable from './GroupFieldsTable'
import AssignFieldForm from './AssignFieldForm'
import UpdateFieldForm from './UpdateFieldForm'

interface GroupModalProps {
  isOpen: boolean
  onClose: () => void
}

const GroupDetail = ({ isOpen, onClose }: GroupModalProps): ReactElement => {
  const { selectedGroup: group } = useContext(GroupContext)

  const [groupFields, setGroupFields, addGroupField, updateGroupField, removeGroupField] = useArrayReducer<GroupField>([])
  const [selectedGroupField, setSelectedGroupField] = useState<GroupField | null>(null)

  const [showAssignField, toggleShowAssignField, setShowAssignField] = useBooleanState()
  const [showUpdateField, toggleShowUpdateField, setShowUpdateField] = useBooleanState()

  useEffect(() => {
    if (group === null) return

    const groupsService = new GroupsService()
    void groupsService.findAllFields(group.id)
      .then(setGroupFields)
  }, [group])

  useEffect(() => {
    if (showAssignField) { setShowUpdateField(false) }
    if (showUpdateField) { setShowAssignField(false) }
  }, [showAssignField, showUpdateField])

  const handleClose = (): void => {
    onClose()
    setShowAssignField(false)
    setShowUpdateField(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className='min-w-[600px] sm:min-w-[1000px]' onTop={true}>
      <div className='p-3'>
        <div className='flex justify-between items-center mb-4 gap-4'>
          <h2 className='text-center text-2xl uppercase'>{group?.name}</h2>

          <div className='flex gap-2'>
            <Button color='secondary' onClick={handleClose}>Cerrar</Button>
            <Button color='primary' onClick={toggleShowAssignField}>Añadir Campo</Button>
          </div>
        </div>
        <div className='border-b-2 mb-3'></div>
        <div className='mb-4'>
          {showAssignField && group && <AssignFieldForm group={group} groupFields={groupFields} close={toggleShowAssignField} onSuccess={addGroupField}/>}
          {showUpdateField && group && selectedGroupField && <UpdateFieldForm group={group} selectedGroupField={selectedGroupField} onClose={toggleShowUpdateField} onSuccess={updateGroupField} />}
        </div>

        <GroupFieldsTable
          groupFields={groupFields}
          removeGroupField={removeGroupField}
          setSelectedGroupField={setSelectedGroupField}
          toggleFieldForm={toggleShowUpdateField}
        />

      </div>
    </Modal>
  )
}

export default GroupDetail

import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@/shared/ui/components/Button'
import Input from '@/shared/ui/components/Input'
import Modal from '@/shared/ui/components/Modal'
import { useDataForm } from '@/shared/hooks/useDataForm'
import { type FormAction } from '@/shared/types'
import { GROUP_DTO_INITIAL_STATE, type GroupDto } from '@/fields/models/group.interface'
import { ReportTypeContext } from '../contexts/ReportTypeContext'
import { GroupContext } from '../../../fields/ui/contexts/GroupContext'
import { GroupsService } from '@/reports/services/groups.service'
import { ReportTypesService } from '@/reports/services/report-types.service'

interface GroupFormModalProps {
  isOpen: boolean
  onClose: () => void
}

const GroupFormModal = ({ isOpen, onClose }: GroupFormModalProps): ReactElement => {
  const { toastId, selectedReportType } = useContext(ReportTypeContext)
  const { groupForm, setGroupForm, addGroup, updateGroup } = useContext(GroupContext)

  const [group, setGroupValue, setGroup, reset] = useDataForm<GroupDto>(GROUP_DTO_INITIAL_STATE)
  const [formAction, setFormAction] = useState<FormAction>('add')

  useEffect(() => {
    setGroupValue('reportTypeId', selectedReportType?.id ?? '')
    if (groupForm === null) {
      setFormAction('add')
      return
    }

    const { name, reportTypeId } = groupForm
    setFormAction('update')

    setGroup({
      name,
      reportTypeId
    })
  }, [groupForm, selectedReportType])

  const handleCancel = (): void => {
    setGroupForm(null)
    reset()
    onClose()
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const groupsService = new GroupsService()
    const reportTypesService = new ReportTypesService()

    const submitAction = formAction === 'update' ? groupsService.update : reportTypesService.createGroup
    const onSuccess = formAction === 'add' ? addGroup : updateGroup
    const id = formAction === 'update' ? groupForm?.id ?? '' : selectedReportType?.id ?? ''

    void submitAction(group, id)
      .then((response) => {
        onSuccess(response)
        reset()
        toast('Sección guardada correctamente', { toastId, type: 'success' })
      })
      .catch((error) => {
        console.log(error)
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
      .finally(() => {
        onClose()
      })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='p-3'>
        <h2 className='uppercase font-bold text-xl mb-3'>{formAction === 'add' ? 'Agregar sección al' : 'Editar sección del'} <span className='text-red'>checklist {selectedReportType?.name}</span></h2>
        <form onSubmit={handleSubmit}>
          <Input
            label='Nombre de la sección'
            value={group.name}
            name='name' placeholder='Nombre' type='text'
            setValue={setGroupValue}></Input>

          <div className='mt-5 flex justify-center gap-3 items-center'>
            <Button color='primary' type='submit'>{formAction === 'add' ? 'Añadir' : 'Guardar'}</Button>
            <Button color='secondary' onClick={handleCancel}>Cerrar</Button>
          </div>
        </form>
      </div>
    </Modal>

  )
}

export default GroupFormModal

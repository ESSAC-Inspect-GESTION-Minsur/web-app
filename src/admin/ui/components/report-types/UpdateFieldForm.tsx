import { type GroupFieldDto, type GroupField, GROUP_FIELD_INITIAL_STATE } from '@/reports/models/group-field.interface'
import Button from '@/shared/ui/components/Button'
import React, { type ReactElement, useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { GroupsService } from '@/reports/services/group.service'
import { type Group } from '@/reports/models/group.interface'
import { ReportToastContext } from '../../pages/ReportsView'

interface UpdateFieldFormProps {
  group: Group
  groupField: GroupField | null
  closeModal: () => void
  onFinishSubmit: (reportTypeField: GroupField) => void
}

const getInitialState = (groupField: GroupField | null): GroupFieldDto => {
  if (groupField === null) return GROUP_FIELD_INITIAL_STATE
  const { field, fieldId, groupId, ...groupFieldDto } = groupField
  return groupFieldDto
}

const UpdateFieldForm = ({ group, groupField, closeModal, onFinishSubmit }: UpdateFieldFormProps): ReactElement => {
  const reportToastContext = useContext(ReportToastContext)
  const groupsService = new GroupsService()

  const [inputValue, setInputValue] = useState<GroupFieldDto>(getInitialState(groupField))
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, checked, type } = event.target

    setInputValue({
      ...inputValue,
      [name]: type === 'checkbox' ? checked : parseInt(value)
    })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const fieldId = groupField ? groupField.fieldId : ''
    void groupsService.updateField(group.id, fieldId, inputValue)
      .then((response) => {
        onFinishSubmit(response)
        toast('Campo actualizado correctamente', { toastId: reportToastContext.id, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId: reportToastContext.id, type: 'error' })
      })
      .finally(() => {
        closeModal()
      })
  }

  return (
    <div>
      <h2 className='text-center font-bold uppercase text-xl'>Editar campo</h2>
      <p className='font-medium text-red-dark text-center uppercase'>Campo: {groupField?.field.name}</p>
      <form onSubmit={handleSubmit}>
        {groupField?.field.type === 'text' && (
          <div className='mb-3'>
            <label className='font-medium'>Max caractéres</label>
            <input
              className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none capitalize'
              onChange={handleChange} type="number" name='maxLength' placeholder='max length' min={0} value={inputValue.maxLength} />
          </div>
        )}
        <div className='grid grid-cols-2 place-items-center'>
          <div className='flex items-center gap-5'>
            <label htmlFor='isCritical'>Crítico</label>
            <input onChange={handleChange} id='isCritical' checked={inputValue.isCritical} type="checkbox" name='isCritical' />
          </div>
          <div className='flex items-center gap-5'>
            <label htmlFor='needImage'>Validación con imagen</label>
            <input onChange={handleChange} id='needImage' checked={inputValue.needImage} type="checkbox" name='needImage' />
          </div>
        </div>

        <div className='mt-5 flex justify-center gap-3 items-center'>
          <Button color='primary' type='submit'>Guardar</Button>
          <Button color='secondary' onClick={closeModal}>Cerrar</Button>
        </div>
      </form>
    </div>
  )
}

export default UpdateFieldForm

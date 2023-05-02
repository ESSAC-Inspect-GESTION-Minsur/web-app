import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { FIELD_INITIAL_STATE, type Field } from '@/reports/models/field.entity'
import { type GroupFieldDto, type GroupField, GROUP_FIELD_INITIAL_STATE } from '@/reports/models/group-field.interface'
import { FieldsService } from '@/reports/services/field.service'
import { GroupsService } from '@/reports/services/group.service'
import { type Group } from '@/reports/models/group.interface'
import { ReportTypesService } from '@/reports/services/report-type.service'

import Button from '@/shared/ui/components/Button'
import { ReportToastContext } from '../../pages/ReportsView'
import { PRIORITY } from '@/reports/models/enums/priority.enum'
import { useSelector } from 'react-redux'
import { getCurrentUser } from '@/shared/config/store/features/auth-slice'

interface AssignFieldFormProps {
  group: Group
  groupFields: GroupField[]
  onFinishSubmit: (reportTypeField: GroupField) => void
  close: () => void
}

const AssignFieldForm = ({ group, groupFields, onFinishSubmit, close }: AssignFieldFormProps): ReactElement => {
  const reportToastContext = useContext(ReportToastContext)
  const groupsService = new GroupsService()
  const navigate = useNavigate()
  const currentUser = useSelector(getCurrentUser)

  const fieldsService = new FieldsService()
  const reportTypesService = new ReportTypesService()
  const [fields, setFields] = useState<Field[]>([])
  const [selectedField, setSelectedField] = useState<Field>(FIELD_INITIAL_STATE)
  const [hasMaxLength, setHasMaxLength] = useState<boolean>(false)

  const priorities = Object.values(PRIORITY)

  const [inputValue, setInputValue] = useState<GroupFieldDto>(GROUP_FIELD_INITIAL_STATE)
  useEffect(() => {
    void fieldsService.findAll()
      .then(response => {
        const actualFields = groupFields.map(groupField => groupField.fieldId)

        void reportTypesService.findAllGroupFields(group.reportTypeId)
          .then(groupFields => {
            const existingGroupFields = groupFields.map(groupField => groupField.fieldId)
            const filteredFields = response.filter(field => (!actualFields.includes(field.id) && !existingGroupFields.includes(field.id)) && field.active)
            filteredFields.sort((a, b) => a.id > b.id ? 1 : -1)
            setFields(filteredFields)
          })
      })
  }, [])

  useEffect(() => {
    if (fields.length > 0) setSelectedField(fields[0])
  }, [fields])

  useEffect(() => {
    if (selectedField.type !== 'text') { inputValue.maxLength = 0 }
    setHasMaxLength(selectedField.type === 'text')
  }, [selectedField])

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.target
    const field = fields.find(field => field.id === value)
    setSelectedField(field ?? FIELD_INITIAL_STATE)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    void groupsService.assignField(group.id, selectedField.id, inputValue)
      .then((response) => {
        onFinishSubmit(response)
        toast('Campo asignado correctamente', { toastId: reportToastContext.id, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId: reportToastContext.id, type: 'error' })
      })
      .finally(() => {
      })
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, checked, type } = event.target

    setInputValue({
      ...inputValue,
      [name]: type === 'checkbox' ? checked : parseInt(value),
      priority: name === 'isCritical' ? checked ? PRIORITY.CRITICAL : PRIORITY.LOW : inputValue.priority
    })
  }

  const handleSelectPrioritySelect = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.target

    setInputValue({
      ...inputValue,
      priority: value as PRIORITY,
      isCritical: value === PRIORITY.CRITICAL
    })
  }

  const modal = (): ReactElement => (
    <>
      <h2 className='text-center font-bold uppercase text-xl'>Asignar campo</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label className='font-medium'>Campo</label>
          <select
            className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none capitalize'
            onChange={handleSelectChange} value={selectedField.id}>
            {fields?.map(field => (
              <option key={field.id} value={field.id}>{field.name}</option>
            ))}
          </select>
        </div>
        {hasMaxLength && (
          <div className='mb-3'>
            <label className='font-medium'>Max cantidad de caractéres</label>
            <input
              className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none capitalize'
              onChange={handleChange} type="number" name='maxLength' placeholder='max length' min={0} value={inputValue.maxLength} />
          </div>
        )}
        <div className='grid grid-cols-2 place-items-center'>
          <div className='flex items-center gap-5'>
            <label htmlFor='isCritical'>Es crítico</label>
            <input onChange={handleChange} id='isCritical' checked={inputValue.isCritical} type="checkbox" name='isCritical' />
          </div>
          <div className='flex items-center gap-5'>
            <label htmlFor='needImage'>Imagen</label>
            <input onChange={handleChange} id='needImage' checked={inputValue.needImage} type="checkbox" name='needImage' />
          </div>
        </div>

        {currentUser.company !== 'MARCOBRE' && (
          <div className='mt-2'>
            <p className='font-bold text-sm'>Selecciona la prioridad</p>
            <select
              className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none capitalize'
              name="type" value={inputValue.priority} onChange={handleSelectPrioritySelect}>
              {
                priorities.map(priority => {
                  return (
                    <option key={priority} value={priority} className='capitalize'>{priority}</option>
                  )
                })
              }
            </select>
          </div>
        )}

        <div className='mt-5 flex justify-center gap-3 items-center'>
          <Button color='primary' type='submit'>Añadir</Button>
          <Button color='secondary' onClick={close} >Cancelar</Button>
        </div>
      </form>
    </>
  )

  const addFieldMessage = (): ReactElement => (
    <>
      <p className='text-center mb-3 text-lg'>Todos los campos están asignados, crea o activa algún campo si es que quieres asignar más</p>

      <div className='flex justify-center gap-3 items-center'>
        <Button color='primary' onClick={() => { navigate('/admin/campos') }}>Añadir campos</Button>
      </div>
    </>
  )

  return (
    fields.length > 0 ? modal() : addFieldMessage()
  )
}

export default AssignFieldForm

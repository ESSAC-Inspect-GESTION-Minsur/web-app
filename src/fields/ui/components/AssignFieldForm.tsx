import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { type GroupFieldDto, type GroupField, GROUP_FIELD_DTO_INITIAL_STATE } from '@/fields/models/group-field.interface'
import { type Group } from '@/fields/models/group.interface'
import { ReportTypeContext } from '../../../reports/ui/contexts/ReportTypeContext'
import { FieldsService } from '@/fields/services/fields.service'
import { ReportTypesService } from '@/reports/services/report-types.service'
import { useDataForm } from '@/shared/hooks/useDataForm'
import Button from '@/shared/ui/components/Button'
import { GroupsService } from '@/reports/services/groups.service'
import SelectInput from '@/shared/ui/components/SelectInput'
import Input from '@/shared/ui/components/Input'
import { type Field } from '@/fields/models/field.interface'
import { PRIORITY } from '@/fields/models/enums/priority.enum'

interface AssignFieldFormProps {
  group: Group
  groupFields: GroupField[]
  onSuccess: (reportTypeField: GroupField) => void
  close: () => void
}

const AssignFieldForm = ({ group, groupFields, onSuccess, close }: AssignFieldFormProps): ReactElement => {
  const { toastId } = useContext(ReportTypeContext)
  const navigate = useNavigate()

  const [fields, setFields] = useState<Field[]>([])
  const [groupField, setGroupFieldValue, setGroupField] = useDataForm<GroupFieldDto>(GROUP_FIELD_DTO_INITIAL_STATE)
  const [selectedField, setSelectedField] = useState<Field | null>(null)

  const [hasMaxLength, setHasMaxLength] = useState<boolean>(false)

  useEffect(() => {
    const fieldsService = new FieldsService()
    const reportTypesService = new ReportTypesService()

    void fieldsService.findAll()
      .then(response => {
        const actualFields = groupFields.map(groupField => groupField.fieldId)

        void reportTypesService.findAllGroupFields(group.reportTypeId)
          .then(groupFields => {
            const existingGroupFields = groupFields.map(groupField => groupField.fieldId)
            const filteredFields = response.filter(field => (!actualFields.includes(field.id) && !existingGroupFields.includes(field.id)) && field.active)
            filteredFields.sort((a, b) => a.name.localeCompare(b.name))
            setFields(filteredFields)
          })
      })
  }, [])

  useEffect(() => {
    if (fields.length > 0) {
      setSelectedField(fields[0])
      setGroupFieldValue('fieldId', fields[0].id)
    }
  }, [fields])

  useEffect(() => {
    const field = fields.find(field => field.id === groupField.fieldId)
    setSelectedField(field ?? null)

    if (field) {
      if (field.type !== 'text') { setGroupFieldValue('maxLength', 0) }
      setHasMaxLength(field.type === 'text')
    }
  }, [groupField.fieldId])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const groupsService = new GroupsService()
    const fieldId = selectedField?.id ?? ''

    void groupsService.assignField(group.id, fieldId, groupField)
      .then((response) => {
        onSuccess(response)
        close()
        toast('Campo asignado correctamente', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  const modal = (): ReactElement => (
    <>
      <h2 className='text-center font-bold uppercase text-xl'>Asignar campo</h2>
      <form onSubmit={handleSubmit}>
        <SelectInput<Field>
          label='Campo'
          name='fieldId'
          objects={fields}
          setValue={setGroupFieldValue}
          value={groupField.fieldId}
          optionKey='name'
          valueKey='id'
        />
        {hasMaxLength && (
          <Input
            label='Max cantidad de caracteres'
            name='maxLength'
            placeholder='Max caracteres'
            setValue={setGroupFieldValue}
            type='number'
            value={groupField.maxLength.toString()}
          />
        )}
        <div className='grid grid-cols-2 place-items-center'>
          <Input
            label='Es crítico'
            name='isCritical'
            placeholder='Es crítico'
            setValue={(name, value) => {
              setGroupField({
                ...groupField,
                isCritical: Boolean(value),
                priority: value ? PRIORITY.CRITICAL : PRIORITY.LOW
              })
            }}
            type='checkbox'
            value={groupField.isCritical.toString()}
          />
          <Input
            label='Imagen'
            name='needImage'
            placeholder='Imagen'
            setValue={setGroupFieldValue}
            type='checkbox'
            value={groupField.needImage.toString()}
          />
        </div>
        <SelectInput<string>
          label='Prioridad'
          name='priority'
          objects={Object.values(PRIORITY)}
          setValue={(name, value) => {
            setGroupField({
              ...groupField,
              priority: value as PRIORITY,
              isCritical: value === PRIORITY.CRITICAL
            })
          }}
          value={groupField.priority}
        />
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

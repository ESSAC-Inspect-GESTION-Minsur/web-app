import { type Group } from '@/reports/models/group.interface'
import { type ReportType } from '@/reports/models/report-type.interface'
import { GroupsService } from '@/reports/services/group.service'
import { ReportTypesService } from '@/reports/services/report-type.service'
import Button from '@/shared/ui/components/Button'
import Input from '@/shared/ui/components/Input'
import Modal from '@/shared/ui/components/Modal'
import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { ReportToastContext } from '../../pages/ReportsView'

type FormAction = 'add' | 'update'

interface CreateGroupProps {
  reportType: ReportType
  group: Group | null
  formAction: FormAction
  close: () => void
  update: (group: Group) => void
  reset: () => void
}

const INITIAL_STATE = {
  name: ''
}

const getInitialState = (group: Group | null): Pick<Group, 'name'> => {
  if (group === null) return INITIAL_STATE
  const { createdAt, updatedAt, id, reportTypeId, fieldsGroups, active, ...groupDto } = group
  return groupDto
}

const GroupForm = ({ group, reportType, formAction, close, update, reset }: CreateGroupProps): ReactElement => {
  const reportToastContext = useContext(ReportToastContext)
  const reportTypesService = new ReportTypesService()
  const groupsService = new GroupsService()

  const [inputValue, setInputValue] = useState<Pick<Group, 'name'>>(getInitialState(group))
  const [canSubmit, setCanSubmit] = useState<boolean>(false)
  const [validInputs, setValidInputs] = useState({
    name: false
  })

  useEffect(() => {
    setCanSubmit(Object.values(validInputs).every(v => v))
  }, [validInputs])

  const setIsValidInput = (name: string, valid: boolean): void => {
    // setCanSubmit(valid)
    setValidInputs({
      ...validInputs,
      [name]: valid
    })
  }

  const setValueInputValue = (name: string, value: string): void => {
    setInputValue({
      ...inputValue,
      [name]: value
    })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    const action = formAction === 'update' ? groupsService.update : reportTypesService.createGroup
    const actionId = formAction === 'update' ? group?.id ?? '' : reportType.id

    void action(actionId, inputValue)
      .then((response) => {
        update(response)
        toast('Sección guardada correctamente', { toastId: reportToastContext.id, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId: reportToastContext.id, type: 'error' })
      })
      .finally(() => {
        reset()
        close()
      })
  }

  return (
    <Modal>
      <div className='w-full min-w-[300px] sm:min-w-[600px] p-3'>
        <h2 className='uppercase font-bold text-xl'>{formAction === 'add' ? 'Agregar sección al' : 'Editar sección del'} <span className='text-red'>checklist {reportType.name}</span></h2>
        <form onSubmit={handleSubmit}>
          <div className='mt-2'>
            <label className='font-medium' htmlFor='name'>Nombre de la sección</label>
            <Input
              value={inputValue.name}
              name='nombre' placeholder='Nombre' type='text'
              setValid={(valid) => { setIsValidInput('name', valid) }}
              setValue={(value) => { setValueInputValue('name', value) }}></Input>
          </div>

          <div className='mt-5 flex justify-center gap-3 items-center'>
            <Button color='primary' type='submit' disabled={!canSubmit}>{formAction === 'add' ? 'Añadir' : 'Guardar'}</Button>
            <Button color='secondary' onClick={close}>Cerrar</Button>
          </div>
        </form>
      </div>
    </Modal>

  )
}

export default GroupForm

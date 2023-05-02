import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import Button from '@/shared/ui/components/Button'
import Input from '@/shared/ui/components/Input'
import { REPORT_TYPE_GROUP_DTO_INITIAL_STATE, type ReportTypeGroup, type ReportTypeGroupDto } from '@/reports/models/report-type-group.interface'
import { ReportTypeGroupContext } from '../context'
import { ReportTypeGroupService } from '@/reports/services/report-type-group.service'

type FormAction = 'add' | 'update'

interface ReportTypeGroupFormProps {
  formAction: FormAction
  reset: () => void
}
const getInitialState = (reportTypeGroup: ReportTypeGroup | null): ReportTypeGroupDto => {
  if (reportTypeGroup === null) return REPORT_TYPE_GROUP_DTO_INITIAL_STATE
  const { name } = reportTypeGroup
  return { name }
}

const ReportTypeGroupForm = ({ formAction, reset }: ReportTypeGroupFormProps): ReactElement => {
  const {
    reportTypeGroupForm,
    setReportTypeGroupForm,
    setSelectedReportTypeGroup,
    toastId,
    update,
    add
  } = useContext(ReportTypeGroupContext)

  const [inputValue, setInputValue] = useState<ReportTypeGroupDto>(getInitialState(reportTypeGroupForm))

  const [canSubmit, setCanSubmit] = useState<boolean>(false)
  const [resetInputs, setResetInputs] = useState<boolean>(false)

  useEffect(() => {
    setInputValue(getInitialState(reportTypeGroupForm))
  }, [reportTypeGroupForm])

  const resetForm = (): void => {
    reset()
    setResetInputs(!resetInputs)
    setInputValue(getInitialState(null))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const reportTypeGroupsService = new ReportTypeGroupService()

    const submitFunction = formAction === 'add' ? reportTypeGroupsService.create : reportTypeGroupsService.update
    const onFinishSubmit = formAction === 'add' ? add : update

    const id = reportTypeGroupForm ? reportTypeGroupForm.id : ''

    void submitFunction(inputValue, id)
      .then(response => {
        resetForm()
        onFinishSubmit(response)
        setSelectedReportTypeGroup(response)
        setReportTypeGroupForm(null)
        toast(`Grupo ${formAction === 'add' ? 'agregado' : 'actualizado'} correctamente`, { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  const setIsValidInput = (valid: boolean): void => {
    setCanSubmit(valid)
  }

  const setValueInputValue = (name: string, value: string | boolean): void => {
    setInputValue({
      ...inputValue,
      [name]: value
    })
  }

  return (
    <div className='mt-2'>
      <h2 className='uppercase font-bold'>{formAction === 'add' ? 'Añadir' : 'Editar'} Grupo de Checklist</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <Input
            value={inputValue.name}
            name='name' placeholder='Nombre del tipo de vehículo' type='text'
            setValid={setIsValidInput}
            reset={resetInputs}
            setValue={(value) => { setValueInputValue('name', value) }}></Input>
        </div>

        <div className='mt-5 flex gap-2'>
          <Button color='primary' type='submit' disabled={!canSubmit}>{formAction === 'add' ? 'Añadir' : 'Editar'}</Button>
          <Button color='secondary' onClick={resetForm}>Cancelar</Button>
        </div>
      </form>
    </div>
  )
}

export default ReportTypeGroupForm

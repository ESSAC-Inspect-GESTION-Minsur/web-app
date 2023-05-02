import { type ReportType } from '@/reports/models/report-type.interface'
import { ReportTypesService } from '@/reports/services/report-type.service'
import Button from '@/shared/ui/components/Button'
import Input from '@/shared/ui/components/Input'
import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { ReportToastContext } from '../../pages/ReportsView'

type FormAction = 'add' | 'update'

interface ReportTypeFormProps {
  reportType: ReportType
  formAction: FormAction
  reset: () => void
  onFinishSubmit: (reportType: ReportType) => void
}

const ReportTypeForm = ({ reportType, formAction, reset, onFinishSubmit }: ReportTypeFormProps): ReactElement => {
  const reportToastContext = useContext(ReportToastContext)
  const reportTypesService = new ReportTypesService()
  const [inputValue, setInputValue] = useState<ReportType>(reportType)

  const [canSubmit, setCanSubmit] = useState<boolean>(false)
  const [resetInputs, setResetInputs] = useState<boolean>(false)

  useEffect(() => {
    setInputValue(reportType)
  }, [reportType])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const { id, createdAt, updatedAt, vehicleTypes, active, reportTypeGroup, company, ...newField } = inputValue

    if (formAction === 'update') {
      void reportTypesService.update(id, newField)
        .then(response => {
          resetForm()
          onFinishSubmit(response)
          toast('Tipo de checklist actualizado correctamente', { toastId: reportToastContext.id, type: 'success' })
        })
        .catch((error) => {
          console.log(error)
          const { message } = error.data
          toast(message, { toastId: reportToastContext.id, type: 'error' })
        })
      return
    }

    void reportTypesService.create(newField)
      .then(response => {
        resetForm()
        onFinishSubmit(response)
        toast('Tipo de checklist creado correctamente', { toastId: reportToastContext.id, type: 'success' })
      })
      .catch((error) => {
        console.log(error)
        const { message } = error.data
        toast(message, { toastId: reportToastContext.id, type: 'error' })
      })
  }

  const resetForm = (): void => {
    reset()
    setResetInputs(!resetInputs)
    setInputValue(reportType)
  }

  const setIsValidInput = (valid: boolean): void => {
    setCanSubmit(valid)
  }

  return (
    <div>
      <h2 className='font-bold uppercase'>{formAction === 'add' ? 'Añadir' : 'Editar'} Tipo de checklist</h2>
      <form onSubmit={handleSubmit}>
        <Input
          value={inputValue.name}
          name='name' placeholder='Nombre checklist' type='text'
          setValid={setIsValidInput}
          reset={resetInputs}
          setValue={(value) => { setInputValue({ ...inputValue, name: value }) }}></Input>

        <div className='mt-3 flex items-center gap-3'>
          <Button className='py-1' color='primary' type='submit' disabled={!canSubmit}>{formAction === 'add' ? 'Añadir' : 'Guardar'}</Button>
          <Button className='py-1' color='secondary' onClick={resetForm} >Cancelar</Button>
        </div>
      </form>
    </div>
  )
}

export default ReportTypeForm

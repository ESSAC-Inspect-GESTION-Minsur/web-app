import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@/shared/ui/components/Button'
import Input from '@/shared/ui/components/Input'
import { useDataForm } from '@/shared/hooks/useDataForm'
import { type FormAction } from '@/shared/types'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import { type ReportTypeDto, REPORT_TYPE_DTO_INITIAL_STATE } from '@/reports/models/report-type.interface'
import { ReportTypesService } from '@/reports/services/report-types.service'
import { ReportTypeContext } from '../contexts/ReportTypeContext'

const ReportTypeForm = (): ReactElement => {
  const { toastId, reportTypeForm, setReportTypeForm, addReportType, updateReportType } = useContext(ReportTypeContext)

  const [reportType, setReportTypeValue, setReportType, reset] = useDataForm<ReportTypeDto>(REPORT_TYPE_DTO_INITIAL_STATE)

  const [formAction, setFormAction] = useState<FormAction>('add')

  const [isSubmitting, toggleIsSubmitting, setIsSubmitting] = useBooleanState()

  useEffect(() => {
    setIsSubmitting(false)
    if (reportTypeForm === null) {
      setFormAction('add')
      reset()
      return
    }

    const { name } = reportTypeForm
    setFormAction('update')

    setReportType({
      name
    })
  }, [reportTypeForm])

  const handleCancel = (): void => {
    setReportTypeForm(null)
    reset()
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    toggleIsSubmitting()
    const reportTypesService = new ReportTypesService()

    const submitAction = formAction === 'add' ? reportTypesService.create : reportTypesService.update
    const onSuccess = formAction === 'add' ? addReportType : updateReportType
    const id = reportTypeForm?.id ?? ''

    void submitAction(reportType, id)
      .then((response) => {
        setReportTypeForm(null)
        onSuccess(response)
        reset()

        toast(`Area ${formAction === 'add' ? 'añadida' : 'guardada'} correctamente`, { toastId, type: 'success' })
      })
      .catch(error => {
        const { message } = error.data
        toast(message, { toastId, type: 'success' })
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <div>
      <h2 className='font-bold uppercase'>{formAction === 'add' ? 'Añadir' : 'Editar'} Tipo de checklist</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label='Nombre'
          value={reportType.name}
          name='name' placeholder='Nombre checklist' type='text'
          setValue={setReportTypeValue}></Input>

        <div className='mt-3 flex items-center gap-3'>
          <Button className='py-1' color='primary' type='submit' isLoading={isSubmitting}>{formAction === 'add' ? 'Añadir' : 'Guardar'}</Button>
          <Button className='py-1' color='secondary' onClick={handleCancel} >Cancelar</Button>
        </div>
      </form>
    </div>
  )
}

export default ReportTypeForm

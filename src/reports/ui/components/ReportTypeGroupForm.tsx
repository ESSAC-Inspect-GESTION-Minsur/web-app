import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import Button from '@/shared/ui/components/Button'
import Input from '@/shared/ui/components/Input'
import { REPORT_TYPE_GROUP_DTO_INITIAL_STATE, type ReportTypeGroupDto } from '@/reports/models/report-type-group.interface'
import { ReportTypeGroupService } from '@/reports/services/report-type-group.service'
import { useDataForm } from '@/shared/hooks/useDataForm'
import { type FormAction } from '@/shared/types'
import { ReportTypeGroupContext } from '../contexts/ReportTypeGroupContext'

const ReportTypeGroupForm = (): ReactElement => {
  const {
    reportTypeGroupForm,
    selectedReportTypeGroup,
    setReportTypeGroupForm,
    setSelectedReportTypeGroup,
    toastId,
    updateReportTypeGroup,
    addReportTypeGroup
  } = useContext(ReportTypeGroupContext)

  const [reportTypeGroup, setReportTypeGroupValue, setReportTypeGroup, reset] = useDataForm<ReportTypeGroupDto>(REPORT_TYPE_GROUP_DTO_INITIAL_STATE)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [formAction, setFormAction] = useState<FormAction>('add')

  useEffect(() => {
    if (reportTypeGroupForm === null) {
      setFormAction('add')
      return
    }

    const { name } = reportTypeGroupForm
    setFormAction('update')

    setReportTypeGroup({
      name
    })
  }, [reportTypeGroupForm, selectedReportTypeGroup])

  const handleCancel = (): void => {
    setReportTypeGroupForm(null)
    reset()
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setIsSubmitting(true)
    const reportTypeGroupsService = new ReportTypeGroupService()

    const submitFunction = formAction === 'add' ? reportTypeGroupsService.create : reportTypeGroupsService.update
    const onFinishSubmit = formAction === 'add' ? addReportTypeGroup : updateReportTypeGroup

    const id = reportTypeGroupForm ? reportTypeGroupForm.id : ''

    void submitFunction(reportTypeGroup, id)
      .then(response => {
        onFinishSubmit(response)
        setSelectedReportTypeGroup(response)
        setReportTypeGroupForm(null)
        reset()
        toast(`Grupo ${formAction === 'add' ? 'agregado' : 'actualizado'} correctamente`, { toastId, type: 'success' })
      })
      .catch((error) => {
        console.log(error)
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <div className='mt-2'>
      <h2 className='uppercase font-bold'>{formAction === 'add' ? 'Añadir' : 'Editar'} Grupo de Checklist</h2>
      <form onSubmit={handleSubmit}>
          <Input
            label='Nombre'
            value={reportTypeGroup.name}
            name='name' placeholder='Nombre del grupo' type='text'
            setValue={setReportTypeGroupValue}></Input>

        <div className='mt-5 flex gap-2'>
          <Button color='primary' type='submit' isLoading={isSubmitting}>{formAction === 'add' ? 'Añadir' : 'Editar'}</Button>
          <Button color='secondary' onClick={handleCancel}>Cancelar</Button>
        </div>
      </form>
    </div>
  )
}

export default ReportTypeGroupForm

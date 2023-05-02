import React, { type ReactElement, useContext, useState, Fragment } from 'react'
import { toast } from 'react-toastify'

import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'

import { ReportTypeGroupContext } from '../context'
import { type ReportTypeGroup } from '@/reports/models/report-type-group.interface'
import { ReportTypeGroupService } from '@/reports/services/report-type-group.service'
import ReportTypeGroupForm from './ReportTypeGroupForm'

type FormAction = 'add' | 'update'

const ReportTypeGroupComponent = (): ReactElement => {
  const {
    reportTypeGroups,
    selectedReportTypeGroup,
    setSelectedReportTypeGroup,
    setReportTypeGroupForm,
    toastId,
    remove
  } = useContext(ReportTypeGroupContext)

  const [formAction, setFormAction] = useState<FormAction>('add')

  const reset = (): void => {
    setReportTypeGroupForm(null)
    setFormAction('add')
  }

  const updateReportTypeGroup = (reportTypeGroup: ReportTypeGroup): void => {
    setReportTypeGroupForm(reportTypeGroup)
    setFormAction('update')
  }

  const removeReportTypeGroup = (reportTypeGroup: ReportTypeGroup): void => {
    const reportTypeGroupsService = new ReportTypeGroupService()
    const result = confirm(`Estás seguro que quieres eliminar el grupo de checklist: ${reportTypeGroup.name}`)
    if (!result) return

    const id = reportTypeGroup.id
    void reportTypeGroupsService.remove(id)
      .then(() => {
        remove(id)
        setSelectedReportTypeGroup(null)
        toast('Grupo eliminado correctamente', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  const reportTypeGroupDetail = (reportTypeGroup: ReportTypeGroup): ReactElement => {
    return (
      <div key={reportTypeGroup.id}
        onClick={() => { setSelectedReportTypeGroup(reportTypeGroup) }}
        className={`cursor-pointer w-full flex justify-between items-center py-2 border-b-2  rounded-r-xl ${reportTypeGroup.id === selectedReportTypeGroup?.id ? 'bg-blue text-white' : ''}`}>
        <p className='px-2'>{reportTypeGroup.name}</p>
        <div className='flex gap-3 px-2'>
          <EditIcon className='cursor-pointer w-5 h-5' onClick={() => { updateReportTypeGroup(reportTypeGroup) }} />
          <DeleteIcon className='cursor-pointer w-5 h-5 ' onClick={() => { removeReportTypeGroup(reportTypeGroup) }} />
        </div>
      </div>
    )
  }

  return (
    <Fragment>
      <section>
        {
          reportTypeGroups.map(reportTypeGroup => reportTypeGroupDetail(reportTypeGroup))
        }
      </section>
      {reportTypeGroups.length <= 0 && (<p>No hay tipo de vehículos</p>)}
      <section>
        <ReportTypeGroupForm formAction={formAction} reset={reset} />
      </section>
    </Fragment>

  )
}

export default ReportTypeGroupComponent

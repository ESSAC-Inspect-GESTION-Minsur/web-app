import React, { useContext, type ReactElement } from 'react'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import { type ReportTypeGroup } from '@/reports/models/report-type-group.interface'
import { ReportTypeGroupService } from '@/reports/services/report-type-group.service'
import { toast } from 'react-toastify'
import { ProjectContext } from '../../contexts/ProjectContext'

interface ReportTypeGroupsDetailProps {
  reportTypeGroups: ReportTypeGroup[]
  handleRemove: (id: string) => void
}

const ReportTypeGroupsDetail = ({ reportTypeGroups, handleRemove }: ReportTypeGroupsDetailProps): ReactElement => {
  const { toastId } = useContext(ProjectContext)

  const onHandleRemove = (id: string): void => {
    const confirm = window.confirm('¿Está seguro de desasignar el grupo de checklist?')

    if (!confirm) return

    const reportTypeGroupService = new ReportTypeGroupService()

    void reportTypeGroupService.removeProject(id)
      .then(() => {
        handleRemove(id)
        toast('Grupo de checklist desasignado correctamente', { type: 'success', toastId })
      })
  }

  return (
    <div className='flex gap-2'>
      {
        reportTypeGroups.map(reportTypeGroup => (
          <div key={reportTypeGroup.id}
            className='flex flex-col gap-2 bg-black text-white px-6 py-4 rounded-lg text-center items-center justify-center'>
            <p className='px-2 uppercase'>{reportTypeGroup.name}</p>
            <div className='flex gap-3 px-2'>
              <DeleteIcon className='cursor-pointer w-5 h-5' onClick={() => { onHandleRemove(reportTypeGroup.id) }} />
            </div>
          </div>
        ))
      }
      {reportTypeGroups.length <= 0 && (<p>No hay grupo de checklist asignados</p>)}
    </div>

  )
}

export default ReportTypeGroupsDetail

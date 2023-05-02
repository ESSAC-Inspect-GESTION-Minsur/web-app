import React, { type ReactElement, useContext, useMemo } from 'react'
import Button from '@/shared/ui/components/Button'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import { ReportTypeGroupContext } from '../context'
import AssignReportType from './AssignReportType'
import { type ReportType } from '@/reports/models/report-type.interface'
import { ReportTypeGroupService } from '@/reports/services/report-type-group.service'
import { toast } from 'react-toastify'

const ReportTypeGroupChecklists = (): ReactElement => {
  const {
    selectedReportTypeGroup: reportTypeGroup,
    setSelectedReportTypeGroup: setReportTypeGroup,
    update,
    toastId
  } = useContext(ReportTypeGroupContext)
  const [showAssignReportType, setShowAssignReportType] = React.useState(false)

  const reportTypes = useMemo(
    () => reportTypeGroup?.reportTypes ?? []
    , [reportTypeGroup])

  const removeChild = (reportType: ReportType): void => {
    const result = confirm(`Estás seguro que quieres desaginar la carreta: ${reportType.name ?? ''}`)
    if (!result) return
    const reportTypeGroupService = new ReportTypeGroupService()
    void reportTypeGroupService.removeReportType(reportTypeGroup?.id ?? '', reportType.id ?? '')
      .then(response => {
        setReportTypeGroup(response)
        update(response)
        toast('Checklist desasignado correctamente', { toastId, type: 'success' })
      })
      .catch(error => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  const body = (): React.ReactElement => {
    return (
      <section>
        <div className='flex justify-between items-center mb-3 gap-4'>
          <h2 className='uppercase font-bold text-lg'>Checklists asignados al <span className='text-red'>grupo {reportTypeGroup?.name}</span></h2>
          <Button color='primary' onClick={() => { setShowAssignReportType(true) }}>Asignar Checklist</Button>
        </div>
        {
          reportTypes.length > 0
            ? (
              <div className='flex gap-4 flex-wrap'>
                {
                  reportTypes.map(reportType => (
                    <div key={reportType.id} className='max-w-[220px] p-7 bg-black text-white rounded-lg flex flex-col justify-between items-center gap-2'>
                      <p className='uppercase'>{reportType.name}</p>
                      <DeleteIcon className='w-6 h-6 cursor-pointer text-red' onClick={() => { removeChild(reportType) }} />
                    </div>
                  ))
                }
              </div>
              )
            : (
              <p>{'El tipo de vehiculo no tiene ningún tipo de checklists asignado'}</p>
              )
        }
        {showAssignReportType && <AssignReportType close={() => { setShowAssignReportType(false) }} />}
      </section>
    )
  }

  return (
    <>
      {
        reportTypeGroup !== null && body()
      }
    </>
  )
}

export default ReportTypeGroupChecklists

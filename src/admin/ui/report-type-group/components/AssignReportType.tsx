import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'
import { ReportTypeGroupContext } from '../context'
import { REPORT_TYPE_INITIAL_STATE, type ReportType } from '@/reports/models/report-type.interface'
import { ReportTypesService } from '@/reports/services/report-type.service'
import { ReportTypeGroupService } from '@/reports/services/report-type-group.service'

interface AssignReportTypeProps {
  close: () => void
}

const AssignReportType = ({ close }: AssignReportTypeProps): ReactElement => {
  const {
    selectedReportTypeGroup: reportTypeGroup,
    setSelectedReportTypeGroup: setReportTypeGroup,
    toastId,
    update
  } = useContext(ReportTypeGroupContext)

  const [reportTypes, setReportTypes] = useState<ReportType[]>([])
  const [selectedReportType, setSelectedReportType] = useState<ReportType>(REPORT_TYPE_INITIAL_STATE)

  useEffect(() => {
    const reportTypeService = new ReportTypesService()
    void reportTypeService.findAll()
      .then(response => {
        const actualReportTypes = reportTypeGroup?.reportTypes ?? []
        const actualReportTypeIds = actualReportTypes.map(reportType => reportType.id)
        setReportTypes(response.filter(reportType => !actualReportTypeIds?.includes(reportType.id) && reportType.reportTypeGroup === null))
      })
  }, [reportTypeGroup])

  useEffect(() => {
    if (reportTypes.length > 0) setSelectedReportType(reportTypes[0])
  }, [reportTypes])

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.target
    const reportType = reportTypes.find(reportType => reportType.id === value)
    setSelectedReportType(reportType ?? REPORT_TYPE_INITIAL_STATE)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const reportTypeGroupService = new ReportTypeGroupService()
    void reportTypeGroupService.assignReportType(reportTypeGroup?.id ?? '', selectedReportType.id ?? '')
      .then(response => {
        setReportTypeGroup(response)
        update(response)
        close()
        toast('Checklist asignado correctamente', { toastId, type: 'success' })
      })
      .catch(error => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  const modal = (): React.ReactElement => {
    return (
      <form onSubmit={handleSubmit}>
        <label className='font-medium'>Checklists</label>
        <select
          className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none capitalize'
          onChange={handleSelectChange} value={selectedReportType.id}>
          {reportTypes.map(reportType => (
            <option key={reportType.id} value={reportType.id}>{reportType.name}</option>
          ))}
        </select>
        <div className='mt-4'>
          <Button color='primary' type='submit'>Asignar</Button>
        </div>
      </form>
    )
  }

  const addReportTypeMessage = (): React.ReactElement => {
    return (
      <div>
        <p className='text-center mb-3 text-lg'>Todos los checklists están asignados, crea algún tipo de checklist si deseas asignar más</p>

        <div className='flex justify-center gap-3 items-center'>
          <Button color='primary' onClick={close}>Añadir tipo de checklist</Button>
        </div>
      </div>
    )
  }

  return (
    <Modal>
      <div className='min-w-[300px] sm:min-w-[600px] p-6'>
        <div className='flex justify-between items-center gap-4'>
          <h2 className='uppercase font-bold'>Asignar checklist al grupo { reportTypeGroup?.name }</h2>
          <Button color='secondary' onClick={close}>Cerrar</Button>
        </div>
        {
          reportTypes.length > 0 ? modal() : addReportTypeMessage()
        }
      </div>

    </Modal >
  )
}

export default AssignReportType

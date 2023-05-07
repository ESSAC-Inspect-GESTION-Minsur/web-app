import React, { Fragment, useContext, type ReactElement } from 'react'
import { toast } from 'react-toastify'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import ToggleOnIcon from '@/shared/ui/assets/icons/ToggleOnIcon'
import ToggleOffIcon from '@/shared/ui/assets/icons/ToggleOfIcon'
import { ReportTypesService } from '@/reports/services/report-types.service'
import { type ReportType } from '@/reports/models/report-type.interface'
import { ReportTypeContext } from '../contexts/ReportTypeContext'

const ReportTypesDetail = (): ReactElement => {
  const { reportTypes, updateReportType, selectedReportType, setSelectedReportType, setReportTypeForm, toastId } = useContext(ReportTypeContext)

  const handleToggleReportTypeActive = (reportType: ReportType): void => {
    const reportTypesService = new ReportTypesService()
    void reportTypesService.toggleActive(reportType.id)
      .then((reportType) => {
        updateReportType(reportType)
        toast('Tipo de checklist actualizado correctamente', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  const handleOnReportTypeClick = (reportType: ReportType): void => {
    setSelectedReportType(reportType)
  }

  const handleUpdate = (reportType: ReportType): void => {
    setReportTypeForm(reportType)
  }

  return (
    <Fragment>
      {
        reportTypes.length > 0
          ? (

              reportTypes.map(reportType =>
                (
              <div key={reportType.id}
                onClick={() => { handleOnReportTypeClick(reportType) }}
                className={`w-full flex justify-between items-center py-2 rounded-r-xl cursor-pointer ${selectedReportType?.id === reportType.id ? 'bg-blue text-white' : ''}`}>
                <p className='px-2'>{reportType.name}</p>
                <div className='flex gap-3 px-2'>
                  <EditIcon className='cursor-pointer w-5 h-5' onClick={() => { handleUpdate(reportType) }} />
                  <div onClick={() => { handleToggleReportTypeActive(reportType) }}>
                    {
                      reportType.active
                        ? (<ToggleOnIcon className='w-6 h-6 cursor-pointer text-success' />)
                        : (<ToggleOffIcon className='w-6 h-6 cursor-pointer' />)
                    }
                  </div>
                </div>
              </div>
                ))

            )
          : (<p>No hay tipo de reportes</p>)
      }
    </Fragment>
  )
}

export default ReportTypesDetail

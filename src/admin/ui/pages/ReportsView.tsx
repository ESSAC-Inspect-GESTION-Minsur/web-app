import React, { type ReactElement, useEffect, useState } from 'react'
import { type ReportType } from '@/reports/models/report-type.interface'
import { ReportTypesService } from '@/reports/services/report-type.service'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import ReportTypeForm from '../components/report-types/ReportTypeForm'
import GroupsComponent from '../components/groups/GroupsComponent'
import Toast from '@/shared/ui/components/Toast'
import VehicleTypeList from '../components/report-types/VehicleTypeList'
import { toast } from 'react-toastify'
import ToggleOnIcon from '@/shared/ui/assets/icons/ToogleOnIcon'
import ToggleOffIcon from '@/shared/ui/assets/icons/ToggleOfIcon'
import { REPORT_TYPE_GROUP_INITIAL_STATE } from '@/reports/models/report-type-group.interface'

const INITIAL_STATE: ReportType = {
  createdAt: '',
  updatedAt: '',
  id: '',
  name: '',
  active: true,
  company: '',
  vehicleTypes: [],
  reportTypeGroup: REPORT_TYPE_GROUP_INITIAL_STATE
}

type FormAction = 'add' | 'update'

const TOAST_ID = 'reports'

export const ReportToastContext = React.createContext({ id: '' })

const ReportsView = (): ReactElement => {
  const reportTypesService = new ReportTypesService()
  const [reportTypes, setReportTypes] = useState<ReportType[]>([])
  const [selectedReportType, setSelectedReportType] = useState<ReportType>(INITIAL_STATE)

  const [reportTypeForm, setReportTypeForm] = useState<ReportType>(INITIAL_STATE)
  const [formAction, setFormAction] = useState<FormAction>('add')

  useEffect(() => {
    void reportTypesService.findAll()
      .then(response => {
        response.sort((a, b) => a.id > b.id ? 1 : -1)
        setReportTypes(response)
      })
  }, [])

  useEffect(() => {
    if (reportTypes.length > 0 && selectedReportType === INITIAL_STATE) setSelectedReportType(reportTypes[0])
  }, [reportTypes])

  useEffect(() => {
    reset()
  }, [selectedReportType])

  const handleUpdate = (reportType: ReportType): void => {
    setReportTypeForm(reportType)
    setFormAction('update')
  }

  const reset = (): void => {
    setReportTypeForm(INITIAL_STATE)
    setFormAction('add')
  }

  const onFinishSubmit = (newReportType: ReportType): void => {
    reset()
    updateReportTypeList(newReportType, newReportType.id)
  }

  const updateReportTypeList = (newReportType: ReportType, id: string, remove: boolean = false): void => {
    const index = reportTypes.findIndex(reportType => reportType.id === id)

    if (index === -1) {
      setReportTypes([...reportTypes, newReportType])
      return
    }
    if (remove) {
      setReportTypes(reportTypes.filter(reportType => reportType.id !== id))
      return
    }

    const reportTypeList = [...reportTypes.slice(0, index), newReportType, ...reportTypes.slice(index + 1, reportTypes.length)]
    setReportTypes(reportTypeList)
  }

  const handleToggleRerportTypeActive = (reportType: ReportType): void => {
    void reportTypesService.toggleActive(reportType.id)
      .then((response) => {
        updateReportTypeList(response, response.id)
        toast('Tipo de checklist actualizado correctamente', { toastId: TOAST_ID, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId: TOAST_ID, type: 'error' })
      })
  }

  return (
    <ReportToastContext.Provider value={{ id: TOAST_ID }}>
      <div className='container-page'>
        <h1 className='text-3xl mb-4 after:h-px after:w-52 after:bg-light-gray after:block after:mt-1'>Tipo de Checklist</h1>
        <div className='sm:grid sm:grid-cols-table sm:gap-12'>
          <main className='mb-4'>
            <div className='mb-4'>
              <h2 className='uppercase font-bold mt-2'>Tipo de Checklist</h2>
              {
                reportTypes.length > 0
                  ? (

                      reportTypes.map(reportType =>
                        (
                      <div key={reportType.id}
                        onClick={() => { setSelectedReportType(reportType) }}
                        className={`w-full flex justify-between items-center py-2 rounded-r-xl cursor-pointer
                                      ${selectedReportType.id === reportType.id ? 'bg-blue text-white' : ''}`}>
                        <p className='px-2'>{reportType.name}</p>
                        <div className='flex gap-3 px-2'>
                          <EditIcon className='cursor-pointer w-5 h-5' onClick={() => { handleUpdate(reportType) }} />
                          <div onClick={() => { handleToggleRerportTypeActive(reportType) }}>
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
            </div>
            <div className='w-full border-t border-solid border-gray-light my-3'></div>
            <ReportTypeForm reportType={reportTypeForm} reset={reset} formAction={formAction} onFinishSubmit={onFinishSubmit} />

          </main>

          <div className='w-full 1order-t border-solid border-gray-light my-3 sm:hidden'></div>
          <div>
            <GroupsComponent reportType={selectedReportType} />
            <div className='mt-10'>
              <VehicleTypeList reportType={selectedReportType} />
            </div>
          </div>
        </div>

        <Toast id={TOAST_ID}></Toast>
      </div>
    </ReportToastContext.Provider>
  )
}

export default ReportsView

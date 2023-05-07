import React, { type ReactElement, useEffect, useState } from 'react'
import { useArrayReducer } from '@/shared/hooks/useArrayReducer'
import Toast from '@/shared/ui/components/Toast'
import { type ReportType } from '@/reports/models/report-type.interface'
import { ReportTypesService } from '@/reports/services/report-types.service'
import { ReportTypeContext } from '../contexts/ReportTypeContext'
import ReportTypesDetail from '../components/ReportTypesDetail'
import ReportTypeForm from '../components/ReportTypeForm'
import GroupsComponent from '../components/GroupComponent'
import Divider from '@/shared/ui/components/Divider'
import VehicleTypeComponent from '../components/VehicleTypeComponent'

const TOAST_ID = 'reports'

const ReportTypesView = (): ReactElement => {
  const [reportTypes, setReportTypes, addReportType, updateReportType] = useArrayReducer<ReportType>([])

  const [selectedReportType, setSelectedReportType] = useState<ReportType | null>(null)
  const [reportTypeForm, setReportTypeForm] = useState<ReportType | null>(null)

  useEffect(() => {
    const reportTypesService = new ReportTypesService()
    void reportTypesService.findAll()
      .then(response => {
        response.sort((a, b) => a.id > b.id ? 1 : -1)
        setReportTypes(response)
      })
  }, [])

  useEffect(() => {
    if (reportTypes.length > 0 && selectedReportType === null) { setSelectedReportType(reportTypes[0]) }
  }, [reportTypes])

  useEffect(() => {
    setReportTypeForm(null)
  }, [selectedReportType])

  return (
    <ReportTypeContext.Provider value={{
      reportTypes,
      selectedReportType,
      setSelectedReportType,
      reportTypeForm,
      setReportTypeForm,
      addReportType,
      updateReportType,
      toastId: TOAST_ID
    }}>

      <h1 className='text-2xl uppercase font-semibold'>Tipo de Checklist</h1>
      <Divider></Divider>
      <div className='sm:grid sm:grid-cols-table sm:gap-12'>
        <main className='mb-4'>
          <div className='mb-4'>
            <h2 className='uppercase font-bold mt-2'>Tipo de Checklist</h2>
            <ReportTypesDetail />
          </div>
          <div className='w-full border-t border-solid border-gray-light my-3'></div>
          <ReportTypeForm />
        </main>

        <div className='w-full border-t border-solid border-gray-light my-3 sm:hidden'></div>
        <div>
          <GroupsComponent />
          <div className='mt-10'>
            <VehicleTypeComponent />
          </div>
        </div>
      </div>

      <Toast id={TOAST_ID}></Toast>

    </ReportTypeContext.Provider>
  )
}

export default ReportTypesView

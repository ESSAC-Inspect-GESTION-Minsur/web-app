import { type ReportTypeGroup } from '@/reports/models/report-type-group.interface'
import { useArrayReducer } from '@/shared/hooks/useArrayReducer'
import React, { useEffect, useState, type ReactElement } from 'react'
import { ReportTypeGroupContext } from './context'
import { ReportTypeGroupService } from '@/reports/services/report-type-group.service'
import ReportTypeGroupComponent from './components/ReportTypeGroupComponent'
import Toast from '@/shared/ui/components/Toast'
import ReportTypeGroupChecklists from './components/ReportTypeGroupChecklists'

const TOAST_ID = 'report-type-groups'

const ReportTypeGroupView = (): ReactElement => {
  const [reportTypeGroups, set, add, update, remove] = useArrayReducer<ReportTypeGroup>([])
  const [selectedReportTypeGroup, setSelectedReportTypeGroup] = useState<ReportTypeGroup | null>(null)
  const [reportTypeGroupForm, setReportTypeGroupForm] = useState<ReportTypeGroup | null>(null)

  useEffect(() => {
    const reportTypeGroupsService = new ReportTypeGroupService()
    void reportTypeGroupsService.findAll()
      .then(response => {
        response.sort((a, b) => a.name.localeCompare(b.name))
        set(response)
      })
  }, [])

  useEffect(() => {
    if (reportTypeGroups.length > 0 && selectedReportTypeGroup === null) setSelectedReportTypeGroup(reportTypeGroups[0])
  }, [reportTypeGroups])

  return (
    <ReportTypeGroupContext.Provider
      value={{
        toastId: TOAST_ID,
        reportTypeGroups,
        add,
        update,
        remove,
        selectedReportTypeGroup,
        setSelectedReportTypeGroup,
        reportTypeGroupForm,
        setReportTypeGroupForm
      }}>

      <div className='container-page'>
        <div className='flex justify-between items-center'>
          <h1
            className='text-3xl mb-4 after:h-px after:w-52 after:bg-gray-light after:block after:mt-1'
          >
            Grupo de Checklists
          </h1>

        </div>

        <div className='md:grid md:grid-cols-table md:gap-12'>
          <div className='mb-5 sm:mb-0'>
            <ReportTypeGroupComponent />
          </div>
          <div>
            <ReportTypeGroupChecklists />
          </div>
        </div>
        <Toast id={TOAST_ID}></Toast>
      </div>
    </ReportTypeGroupContext.Provider>
  )
}

export default ReportTypeGroupView

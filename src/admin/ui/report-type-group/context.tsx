import React from 'react'
import { type ReportTypeGroup } from '@/reports/models/report-type-group.interface'

interface ReportTypeGroupContextInterface {
  toastId: string

  reportTypeGroups: ReportTypeGroup[]
  add: (reportTypeGroup: ReportTypeGroup) => void
  update: (reportTypeGroup: ReportTypeGroup) => void
  remove: (id: string) => void

  selectedReportTypeGroup: ReportTypeGroup | null
  setSelectedReportTypeGroup: (reportTypeGroup: ReportTypeGroup | null) => void

  reportTypeGroupForm: ReportTypeGroup | null
  setReportTypeGroupForm: (reportTypeGroup: ReportTypeGroup | null) => void
}

export const ReportTypeGroupContext = React.createContext<ReportTypeGroupContextInterface>({
  toastId: '',
  reportTypeGroups: [],
  add: () => { },
  update: () => { },
  remove: () => { },
  selectedReportTypeGroup: null,
  setSelectedReportTypeGroup: () => { },
  reportTypeGroupForm: null,
  setReportTypeGroupForm: () => { }
})

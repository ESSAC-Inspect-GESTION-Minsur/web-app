import { type ReportType } from '@/reports/models/report-type.interface'
import React from 'react'

interface ReportTypeContextInterface {
  toastId: string

  reportTypes: ReportType[]
  addReportType: (reportType: ReportType) => void
  updateReportType: (reportType: ReportType) => void

  selectedReportType: ReportType | null
  setSelectedReportType: (reportType: ReportType | null) => void

  reportTypeForm: ReportType | null
  setReportTypeForm: (reportTypeForm: ReportType | null) => void
}

export const ReportTypeContext = React.createContext<ReportTypeContextInterface>({
  toastId: '',
  reportTypes: [],
  addReportType: () => { },
  updateReportType: () => { },
  selectedReportType: null,
  setSelectedReportType: () => { },
  reportTypeForm: null,
  setReportTypeForm: () => { }
})

import { type ReportTypeGroup } from '@/reports/models/report-type-group.interface'
import { ReportTypeGroupService } from '@/reports/services/report-type-group.service'
import { type Project } from '@/users/models/project.interface'
import { useEffect, useState } from 'react'

export const useReportTypeGroupToAssign = (project: Project | null): [
  ReportTypeGroup[]
] => {
  const [reportTypeGroups, setReportTypeGroups] = useState<ReportTypeGroup[]>([])

  useEffect(() => {
    const reportTypeGroupsService = new ReportTypeGroupService()

    void reportTypeGroupsService.findAll()
      .then((response) => {
        const aux = response.filter((reportTypeGroup) => reportTypeGroup.project === null)

        const actualReportTypeGroups = project?.reportTypeGroups ?? []

        const actualReportTypeGroupsIds = actualReportTypeGroups.map((reportTypeGroup) => reportTypeGroup.id)

        const reportTypeGroupsFiltered = aux.filter((reportTypeGroup) => !actualReportTypeGroupsIds.includes(reportTypeGroup.id))
        setReportTypeGroups(reportTypeGroupsFiltered)
      })
  }, [project])

  return [
    reportTypeGroups
  ]
}

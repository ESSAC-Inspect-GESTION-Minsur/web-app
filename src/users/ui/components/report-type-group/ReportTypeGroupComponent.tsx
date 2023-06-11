import React, { type ReactElement, useContext, useEffect } from 'react'

import { useArrayReducer } from '@/shared/hooks/useArrayReducer'

import { ProjectContext } from '../../contexts/ProjectContext'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import Button from '@/shared/ui/components/Button'
import Divider from '@/shared/ui/components/Divider'
import { type ReportTypeGroup } from '@/reports/models/report-type-group.interface'
import ReportTypeGroupsDetail from './ReportTypeGroupDetail'
import AssignReportTypeGroupModal from './AssignReportTypeGroupModal'
import { PROJECT_INITIAL_STATE } from '@/users/models/project.interface'

const ReportTypeGroupsComponent = (): ReactElement => {
  const { selectedProject, setSelectedProject } = useContext(ProjectContext)
  const [reportTypeGroups, setReportTypeGroups, addReportTypeGroup,, deleteReportTypeGroup] = useArrayReducer<ReportTypeGroup>(selectedProject?.reportTypeGroups ?? [])

  const [showForm, toggleShowForm] = useBooleanState()

  useEffect(() => {
    setReportTypeGroups(selectedProject?.reportTypeGroups ?? [])
  }, [selectedProject])

  const handleAddReportTypeGroup = (reportTypeGroup: ReportTypeGroup): void => {
    addReportTypeGroup(reportTypeGroup)

    setSelectedProject({
      ...selectedProject ?? PROJECT_INITIAL_STATE,
      reportTypeGroups: [...selectedProject?.reportTypeGroups ?? [], reportTypeGroup]
    })
  }

  const handleRemoveReportTypeGroup = (id: string): void => {
    deleteReportTypeGroup(id)

    setSelectedProject({
      ...selectedProject ?? PROJECT_INITIAL_STATE,
      reportTypeGroups: selectedProject?.reportTypeGroups?.filter((reportTypeGroup) => reportTypeGroup.id !== id) ?? []
    })
  }

  return (

    <section className='p-3'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-bold uppercase'>Grupo de checklist del proyecto {selectedProject?.name}</h2>
        <Button color='primary' onClick={toggleShowForm}>Asignar Grupo de checklist</Button>
      </div>
      <Divider></Divider>
      <ReportTypeGroupsDetail reportTypeGroups={reportTypeGroups} handleRemove={handleRemoveReportTypeGroup}/>
      <AssignReportTypeGroupModal isOpen={showForm} onClose={toggleShowForm} addReportTypeGroup={handleAddReportTypeGroup}/>
    </section>
  )
}

export default ReportTypeGroupsComponent

import React, { useContext, type ReactElement, useState, useEffect } from 'react'
import { type ReportTypeGroup } from '@/reports/models/report-type-group.interface'
import Modal from '@/shared/ui/components/Modal'
import SelectInput from '@/shared/ui/components/SelectInput'
import Button from '@/shared/ui/components/Button'
import Divider from '@/shared/ui/components/Divider'
import { ProjectContext } from '../../contexts/ProjectContext'
import { useReportTypeGroupToAssign } from '../../hooks/useReportTypeGroupToAssign'
import { ReportTypeGroupService } from '@/reports/services/report-type-group.service'
import { toast } from 'react-toastify'

interface AssignReportTypeGroupModalProps {
  isOpen: boolean
  onClose: () => void
  addReportTypeGroup: (reportTypeGroup: ReportTypeGroup) => void
}

const AssignReportTypeGroupModal = ({ isOpen, onClose, addReportTypeGroup }: AssignReportTypeGroupModalProps): ReactElement => {
  const { selectedProject, toastId } = useContext(ProjectContext)

  const [selectedReportTypeGroup, setSelectedReportTypeGroup] = useState<ReportTypeGroup | null>(null)
  const [reportTypeGroups] = useReportTypeGroupToAssign(selectedProject)

  useEffect(() => {
    setSelectedReportTypeGroup(reportTypeGroups[0] ?? null)
  }, [reportTypeGroups])

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    if (selectedReportTypeGroup === null || selectedProject === null) {
      onClose()
      return
    }

    const reportTypeGroupService = new ReportTypeGroupService()

    void reportTypeGroupService.assignProject(selectedReportTypeGroup.id, selectedProject.id)
      .then((reportTypeGroup) => {
        addReportTypeGroup(reportTypeGroup)
        toast('Grupo de checklist asignado correctamente', { type: 'success', toastId })
        onClose()
      })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <p className='text-xl font-bold text-center'>Asignar grupo de checklist al proyecto {selectedProject?.name}</p>

      <Divider className='mt-2' />

      { reportTypeGroups.length === 0 && <p className='text-center'>No hay grupos de checklist disponibles para asignar</p>}
      <form onSubmit={onSubmit}>
        {
          reportTypeGroups.length > 0 && (<SelectInput<ReportTypeGroup>
            label='Grupos de checklist'
            objects={reportTypeGroups}
            name='reportTypeGroup'
            value={selectedReportTypeGroup?.id ?? ''}
            setValue={(_, value) => {
              const reportTypeGroup = reportTypeGroups.find((reportTypeGroup) => reportTypeGroup.id === value)
              setSelectedReportTypeGroup(reportTypeGroup ?? null)
            }}
            optionKey='name'
            valueKey='id'
          />)
        }

        <div className='flex gap-3 mt-5'>
          { reportTypeGroups.length > 0 && <Button color='primary' type='submit'>Asignar</Button>}
          <Button color='secondary' onClick={onClose}>Cancelar</Button>
        </div>
      </form>
    </Modal>
  )
}

export default AssignReportTypeGroupModal

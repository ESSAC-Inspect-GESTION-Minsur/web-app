import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { ReportTypeContext } from '../contexts/ReportTypeContext'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import { type Group } from '@/fields/models/group.interface'
import { useArrayReducer } from '@/shared/hooks/useArrayReducer'
import { ReportTypesService } from '@/reports/services/report-types.service'
import Button from '@/shared/ui/components/Button'
import GroupsDetail from './GroupsDetail'
import GroupFormModal from './GroupFormModal'
import { GroupContext } from '@/fields/ui/contexts/GroupContext'
import GroupDetail from '@/fields/ui/components/GroupDetail'

const GroupsComponent = (): ReactElement => {
  const { selectedReportType } = useContext(ReportTypeContext)

  const [groups, setGroups, addGroup, updateGroup, removeGroup] = useArrayReducer<Group>([])

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [groupForm, setGroupForm] = useState<Group | null>(null)

  const [showGroupDetail, toggleShowGroupDetail] = useBooleanState()
  const [showGroupFormModal, toggleShowGroupFormModal] = useBooleanState()
  // const [reportTypeFieldForm, setReportTypeFieldForm] = useState<Group | null>(null)

  useEffect(() => {
    if (selectedReportType === null) return

    const reportTypesService = new ReportTypesService()
    void reportTypesService.findAllGroups(selectedReportType.id)
      .then((response) => {
        const groupsSorted = Array.from(response)
        groupsSorted.sort((a, b) => a.name.localeCompare(b.name))
        setGroups(groupsSorted)
      })
  }, [selectedReportType])

  const handleAddGroup = (): void => {
    toggleShowGroupFormModal()
    setGroupForm(null)
  }

  return (
    <GroupContext.Provider value={{
      groups,
      addGroup,
      updateGroup,
      removeGroup,
      selectedGroup,
      setSelectedGroup,
      groupForm,
      setGroupForm,
      toggleShowGroupDetail,
      toggleShowGroupFormModal
    }}>
      <section>
        <div className='flex justify-between items-center mb-3'>
          <h2 className='uppercase font-bold text-lg'>Secciones del <span className='text-red'>checklist {selectedReportType?.name}</span></h2>
          <Button color='primary' onClick={handleAddGroup} className='mb-2'>Agregar sección</Button>
        </div>
        <GroupsDetail />

        <GroupFormModal isOpen={showGroupFormModal} onClose={toggleShowGroupFormModal}/>
        <GroupDetail isOpen={showGroupDetail} onClose={toggleShowGroupDetail}/>
      </section>
    </GroupContext.Provider>

  )
}

export default GroupsComponent

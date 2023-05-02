import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { type ReportType } from '@/reports/models/report-type.interface'
import { ReportTypesService } from '@/reports/services/report-type.service'
import Button from '@/shared/ui/components/Button'
import { type Group } from '@/reports/models/group.interface'
import GroupForm from './GroupForm'
import GroupDetail from './GroupDetail'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import EyeIcon from '@/shared/ui/assets/icons/EyeIcon'
import { GroupsService } from '@/reports/services/group.service'
import { toast } from 'react-toastify'
import { ReportToastContext } from '../../pages/ReportsView'

type FormAction = 'add' | 'update'

interface GroupsComponentProps {
  reportType: ReportType
}

const GROUP_STATE: Group = {
  id: '',
  name: '',
  createdAt: '',
  fieldsGroups: [],
  reportTypeId: '',
  updatedAt: '',
  active: true
}

const GroupsComponent = ({ reportType }: GroupsComponentProps): ReactElement => {
  const reportToastContext = useContext(ReportToastContext)
  const reportTypesService = new ReportTypesService()
  const groupsService = new GroupsService()

  const [showGroupModal, setShowGroupModal] = useState<boolean>(false)
  const [groups, setGroups] = useState<Group[]>([])
  const [formAction, setFormAction] = useState<FormAction>('add')

  const [groupForm, setGroupForm] = useState<Group | null>(null)

  const [selectedGroup, setSelectedGroup] = useState<Group>(GROUP_STATE)
  const [showGroupDetail, setShowGroupDetail] = useState<boolean>(false)
  // const [reportTypeFieldForm, setReportTypeFieldForm] = useState<Group | null>(null)

  useEffect(() => {
    if (reportType.id.trim().length > 0) {
      void reportTypesService.findAllGroups(reportType.id)
        .then(setGroups)
    }
  }, [reportType])

  const updateGroupList = (newGroup: Group): void => {
    const index = groups.findIndex(group => group.id === newGroup.id)

    if (index === -1) {
      setGroups([...groups, newGroup])
      return
    }

    const fieldList = [...groups.slice(0, index), newGroup, ...groups.slice(index + 1, groups.length)]
    setGroups(fieldList)
  }

  const reset = (): void => {
    setGroupForm(null)
    setFormAction('add')
  }

  const add = (): void => {
    setFormAction('add')
    setShowGroupModal(true)
    setGroupForm(null)
  }
  const showDetail = (group: Group): void => {
    setSelectedGroup(group)
    setShowGroupDetail(!showGroupDetail)
  }

  const update = (group: Group): void => {
    setFormAction('update')
    setShowGroupModal(true)
    setGroupForm(group)
  }

  const remove = (groupDeleted: Group): void => {
    const result = confirm(`Estás seguro que quieres elimminar la sección ${groupDeleted.name}`)
    if (!result) return

    void groupsService.remove(groupDeleted.id)
      .then((response) => {
        setGroups(groups.filter(group => group.id !== groupDeleted.id))
        toast('Sección eliminado correctamente', { toastId: reportToastContext.id, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId: reportToastContext.id, type: 'error' })
      })
  }

  return (
    <section>
      {reportType.id.trim().length > 0 &&
        (
          <div className='flex justify-between items-center mb-3'>
            <h2 className='uppercase font-bold text-lg'>Secciones del <span className='text-red'>checklist {reportType.name}</span></h2>
            <Button color='primary' onClick={add} className='mb-2'>Agregar sección</Button>
          </div>
        )
      }
      {
        groups.length > 0
          ? (
            <div className='flex gap-4 flex-wrap'>
              {
                groups.sort((a, b) => a.id > b.id ? 1 : -1).map(group => (
                  <div key={group.id} className='max-w-[220px] p-7 bg-black text-white rounded-lg flex flex-col justify-between gap-2'>
                    <p className='uppercase'>{group.name}</p>

                    <div className='flex justify-between gap-2 mt-3'>
                      <EyeIcon className='w-6 h-6 cursor-pointer hover:text-red' onClick={() => { showDetail(group) }}></EyeIcon>
                      <EditIcon className='w-6 h-6 cursor-pointer' onClick={() => { update(group) }} />
                      <DeleteIcon className='w-6 h-6 cursor-pointer text-red' onClick={() => { remove(group) }} />
                    </div>
                  </div>
                ))
              }
            </div>
            )
          : (
            <p>{reportType.id.trim().length > 0 ? 'El tipo de checklist no tiene ninguna sección creada' : 'Seleccionar tipo de checklist'}</p>
            )
      }
      {showGroupModal && <GroupForm close={() => { setShowGroupModal(!showGroupModal) }} update={updateGroupList} reportType={reportType} group={groupForm} formAction={formAction} reset={reset}/>}
      {showGroupDetail && <GroupDetail group={selectedGroup} close={() => { setShowGroupDetail(!showGroupDetail) }} />}
    </section>
  )
}

export default GroupsComponent

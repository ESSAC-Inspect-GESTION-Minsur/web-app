import React, { Fragment, useContext, type ReactElement } from 'react'
import { GroupContext } from '../../../fields/ui/contexts/GroupContext'
import EyeIcon from '@/shared/ui/assets/icons/EyeIcon'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import { ReportTypeContext } from '../contexts/ReportTypeContext'
import { type Group } from '@/fields/models/group.interface'
import { GroupsService } from '@/reports/services/groups.service'
import { toast } from 'react-toastify'

const GroupsDetail = (): ReactElement => {
  const { toastId, selectedReportType } = useContext(ReportTypeContext)
  const { groups, removeGroup, setSelectedGroup, toggleShowGroupDetail, setGroupForm, toggleShowGroupFormModal } = useContext(GroupContext)

  const handleShowDetail = (group: Group): void => {
    setSelectedGroup(group)
    toggleShowGroupDetail()
  }

  const handleUpdate = (group: Group): void => {
    setGroupForm(group)
    toggleShowGroupFormModal()
  }

  const handleRemove = (group: Group): void => {
    const result = confirm(`Estás seguro que quieres eliminar la sección ${group.name}`)
    if (!result) return

    const groupsService = new GroupsService()

    void groupsService.remove(group.id)
      .then(() => {
        removeGroup(group.id)
        toast('Sección eliminado correctamente', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  return (
    <Fragment>
      {
        groups.length > 0
          ? (
            <div className='flex gap-4 flex-wrap'>
              {
                groups.map(group => (
                  <div key={group.id}
                    className='max-w-[220px] p-7 bg-black text-white rounded-lg flex flex-col justify-between gap-2'>
                    <p className='uppercase'>{group.name}</p>

                    <div className='flex justify-between gap-2 mt-3'>
                      <EyeIcon className='w-6 h-6 cursor-pointer hover:text-red' onClick={() => { handleShowDetail(group) } }></EyeIcon>
                      <EditIcon className='w-6 h-6 cursor-pointer' onClick={() => { handleUpdate(group) }} />
                      <DeleteIcon className='w-6 h-6 cursor-pointer text-red' onClick={() => { handleRemove(group) }} />
                    </div>
                  </div>
                ))
              }
            </div>
            )
          : (
            <p>{selectedReportType !== null ? 'El tipo de checklist no tiene ninguna sección creada' : 'Seleccionar tipo de checklist'}</p>
            )
      }
    </Fragment>
  )
}

export default GroupsDetail

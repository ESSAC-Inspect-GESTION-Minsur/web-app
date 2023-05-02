import { type GroupField } from '@/reports/models/group-field.interface'
import { type Group } from '@/reports/models/group.interface'
import { GroupsService } from '@/reports/services/group.service'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'
import Table, { type Action, type Column } from '@/shared/ui/components/table/Table'
import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { ReportToastContext } from '../../pages/ReportsView'
import AssignFieldForm from '../report-types/AssignFieldForm'
import UpdateFieldForm from '../report-types/UpdateFieldForm'

interface GroupDetailProps {
  group: Group
  close: () => void
}

const GroupDetail = ({ group, close }: GroupDetailProps): ReactElement => {
  const reportToastContext = useContext(ReportToastContext)
  const groupsService = new GroupsService()

  const [groupFields, setGroupFields] = useState<GroupField[]>([])
  const [selectedGroupField, setSelectedGroupField] = useState<GroupField | null>(null)

  const [showAssignField, setShowAssignField] = useState<boolean>(false)
  const [showUpdateField, setShowUpdateField] = useState<boolean>(false)

  useEffect(() => {
    if (group.id !== '') {
      void groupsService.findAllFields(group.id)
        .then(setGroupFields)
    }
  }, [group])

  const onFinishSubmit = (newGroupField: GroupField): void => {
    updateGroupList(newGroupField, newGroupField.fieldId, false)
    setShowUpdateField(false)
    setShowAssignField(false)
  }

  const handleRemove = (groupField: GroupField): void => {
    const result = confirm(`Estás seguro que quieres desasignar el campo ${groupField.field.name}`)
    if (!result) return

    void groupsService.deleteField(group.id, groupField.fieldId)
      .then((response) => {
        updateGroupList(response, groupField.fieldId, true)
        toast('Campo desasignado correctamente', { toastId: reportToastContext.id, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId: reportToastContext.id, type: 'error' })
      })
      .finally(() => {
      })
  }

  const updateGroupList = (newGroupField: GroupField, fieldId: string, remove: boolean): void => {
    if (remove) {
      setGroupFields(groupFields.filter(groupField => groupField.fieldId !== fieldId))
      return
    }

    const index = groupFields.findIndex(groupField => groupField.fieldId === newGroupField.fieldId)
    if (index === -1) {
      setGroupFields([...groupFields, newGroupField])
      return
    }

    const fieldList = [...groupFields.slice(0, index), newGroupField, ...groupFields.slice(index + 1, groupFields.length)]
    setGroupFields(fieldList)
  }

  const handleUpdate = (groupField: GroupField): void => {
    setShowUpdateField(!showUpdateField)
    setShowAssignField(false)
    setSelectedGroupField(groupField)
  }

  const toggleAssignField = (): void => {
    setShowAssignField(!showAssignField)
    setShowUpdateField(false)
  }

  const closeUpdateModal = (): void => {
    setShowUpdateField(!showUpdateField)
    setSelectedGroupField(null)
  }

  const GROUP_FIELDS_COLUMNS: Array<Column<GroupField>> = [
    {
      id: 'name',
      columnName: 'Campo',
      filterFunc: (groupField) => groupField.field.name,
      render: (groupField) => groupField.field.name,
      sortFunc: (a, b) => a.field.name > b.field.name ? 1 : -1
    },
    {
      id: 'priority',
      columnName: 'Prioridad',
      filterFunc: (groupField) => groupField.priority,
      render: (groupField) => groupField.priority,
      sortFunc: (a, b) => a.priority > b.priority ? 1 : -1
    },
    {
      id: 'active',
      columnName: 'Activo',
      filterFunc: (groupField) => groupField.field.active ? 'activo' : 'no activo',
      render: (groupField) => groupField.field.active ? 'activo' : 'no activo',
      sortFunc: (a, b) => {
        const activeA = a.field.active ? 'activo' : 'no activo'
        const activeB = b.field.active ? 'activo' : 'no activo'

        return activeA > activeB ? 1 : -1
      }
    },
    {
      id: 'maxLength',
      columnName: 'Max caractéres',
      filterFunc: (groupField) => groupField.maxLength.toString(),
      render: (groupField) => groupField.maxLength.toString(),
      sortFunc: (a, b) => a.maxLength - b.maxLength
    },
    {
      id: 'isCritical',
      columnName: 'Crítico',
      filterFunc: (groupField) => groupField.isCritical ? 'Si' : 'No',
      render: (groupField) => groupField.isCritical ? 'Si' : 'No',
      sortFunc: (a, b) => {
        const isCriticalA = a.isCritical ? 'Si' : 'No'
        const isCriticalB = b.isCritical ? 'Si' : 'No'

        return isCriticalA > isCriticalB ? 1 : -1
      }
    },
    {
      id: 'needImage',
      columnName: 'Imagen',
      filterFunc: (groupField) => groupField.needImage ? 'Si' : 'No',
      render: (groupField) => groupField.needImage ? 'Si' : 'No',
      sortFunc: (a, b) => {
        const needImageA = a.needImage ? 'Si' : 'No'
        const needImageB = b.needImage ? 'Si' : 'No'

        return needImageA > needImageB ? 1 : -1
      }
    }
  ]

  const GROUP_FIELDS_ACTIONS: Array<Action<GroupField>> = [
    {
      icon: () => (<EditIcon className='w-6 h-6 cursor-pointer'/>),
      actionFunc: handleUpdate
    },
    {
      icon: () => (<DeleteIcon className = 'w-6 h-6 cursor-pointer text-red' />),
      actionFunc: handleRemove
    }
  ]

  return (
  <Modal>
    <div className='w-full min-w-[600px] sm:min-w-[1000px] p-3'>
      <div className='flex justify-between items-center mb-4 gap-4'>
        <h2 className='text-center text-2xl uppercase'>{group.name}</h2>

        <div className='flex gap-2'>
          <Button color='secondary' onClick={close}>Cerrar</Button>
          <Button color='primary' onClick={toggleAssignField}>Añadir Campo</Button>
        </div>
      </div>
      <div className='border-b-2 mb-3'></div>
      <div className='mb-4'>
        {showAssignField && <AssignFieldForm group={group} groupFields={groupFields} onFinishSubmit={onFinishSubmit} close={() => { setShowAssignField(false) }} />}
        {showUpdateField && <UpdateFieldForm group={group} groupField={selectedGroupField} onFinishSubmit={onFinishSubmit} closeModal={closeUpdateModal} />}
      </div>

      {
        groupFields.length > 0
          ? (<Table columns={GROUP_FIELDS_COLUMNS} data={groupFields} actions={GROUP_FIELDS_ACTIONS} showFilter={false} />)
          : (
            <p>{group.id !== '' ? 'No hay campos asignados al tipo de reporte' : 'Seleccionar tipo de reporte'}</p>
            )
      }
    </div>
  </Modal>
  )
}

export default GroupDetail

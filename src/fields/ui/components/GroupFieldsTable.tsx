import { type GroupField } from '@/fields/models/group-field.interface'
import React, { Fragment, useContext, type ReactElement } from 'react'
import { GroupContext } from '../contexts/GroupContext'
import Table, { type Action, type Column } from '@/shared/ui/components/table/Table'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import { GroupsService } from '@/reports/services/groups.service'
import { toast } from 'react-toastify'
import { ReportTypeContext } from '../../../reports/ui/contexts/ReportTypeContext'

interface GroupFieldsTableProps {
  groupFields: GroupField[]
  toggleFieldForm: () => void
  setSelectedGroupField: (groupField: GroupField) => void
  removeGroupField: (id: string) => void
}

const GroupFieldsTable = ({ groupFields, toggleFieldForm, setSelectedGroupField, removeGroupField }: GroupFieldsTableProps): ReactElement => {
  const { toastId } = useContext(ReportTypeContext)
  const { selectedGroup } = useContext(GroupContext)

  const handleRemove = (groupField: GroupField): void => {
    if (selectedGroup === null) return

    const result = confirm(`Estás seguro que quieres desasignar el campo ${groupField.field.name}`)
    if (!result) return

    const groupsService = new GroupsService()
    void groupsService.deleteField(selectedGroup.id, groupField.fieldId)
      .then(() => {
        removeGroupField(groupField.id)
        toast('Campo desasignado correctamente', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
      .finally(() => {
      })
  }

  const handleUpdate = (groupField: GroupField): void => {
    toggleFieldForm()
    setSelectedGroupField(groupField)
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
      columnName: 'Max caracteres',
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
    <Fragment>
      {
        groupFields.length > 0
          ? (
            <Table
              columns={GROUP_FIELDS_COLUMNS}
              data={groupFields}
              actions={GROUP_FIELDS_ACTIONS}
              showFilter={false} />
            )
          : (
            <p>{selectedGroup !== null ? 'No hay campos asignados al tipo de reporte' : 'Seleccionar tipo de reporte'}</p>
            )
      }
    </Fragment>

  )
}

export default GroupFieldsTable

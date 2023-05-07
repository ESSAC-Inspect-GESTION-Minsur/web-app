import React, { useContext, type ReactElement } from 'react'
import { FieldContext } from '../contexts/FieldContext'
import Table, { type Action, type Column } from '@/shared/ui/components/table/Table'
import { type Field } from '@/fields/models/field.interface'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import ToggleOnIcon from '@/shared/ui/assets/icons/ToggleOnIcon'
import ToggleOffIcon from '@/shared/ui/assets/icons/ToggleOfIcon'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import { FieldsService } from '@/fields/services/fields.service'
import { toast } from 'react-toastify'

const FieldsTable = (): ReactElement => {
  const { toastId, fields, setFieldForm, removeField, updateField } = useContext(FieldContext)

  const handleUpdate = (field: Field): void => {
    setFieldForm(field)
  }

  const handleRemove = (field: Field): void => {
    const confirmRemove = confirm('Are you sure to delete field?')
    if (!confirmRemove) return

    const fieldsService = new FieldsService()

    const id = field.id
    void fieldsService.remove(id)
      .then(() => {
        removeField(id)
        toast('Campo eliminado correctamente', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  const handleToggle = (fieldToToggle: Field): void => {
    const fieldsService = new FieldsService()
    void fieldsService.toggleActive(fieldToToggle.id)
      .then(field => {
        updateField(field)
        toast('Campo actualizado correctamente', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  const FIELD_COLUMNS: Array<Column<Field>> = [
    {
      id: 'name',
      columnName: 'Nombre',
      filterFunc: (field) => field.name,
      render: (field) => field.name,
      sortFunc: (a, b) => a.name > b.name ? 1 : -1
    },
    {
      id: 'placeholder',
      columnName: 'Placeholder',
      filterFunc: (field) => field.placeholder ? field.placeholder.trim().length > 0 ? field.placeholder : '-' : '-',
      render: (field) => field.placeholder ? field.placeholder.trim().length > 0 ? field.placeholder : '-' : '-',
      sortFunc: (a, b) => {
        const placeholderA = a.placeholder ? a.placeholder.trim().length > 0 ? a.placeholder : '-' : '-'
        const placeholderB = b.placeholder ? b.placeholder.trim().length > 0 ? b.placeholder : '-' : '-'

        return placeholderA > placeholderB ? 1 : -1
      }
    },
    {
      id: 'active',
      columnName: 'Activo',
      filterFunc: (field) => field.active ? 'Activo' : 'No activo',
      render: (field) => field.active ? 'Activo' : 'No activo',
      sortFunc: (a, b) => {
        const activeA = a.active ? 'Activo' : 'No activo'
        const activeB = b.active ? 'Activo' : 'No activo'

        return activeA > activeB ? 1 : -1
      }
    },
    {
      id: 'fielType',
      columnName: 'Tipo',
      filterFunc: (field) => field.type,
      render: (field) => field.type,
      sortFunc: (a, b) => a.type > b.type ? 1 : -1
    }
  ]

  const PAGINATION = [5, 10, 20]

  const FIELD_ACTIONS: Array<Action<Field>> = [
    {
      icon: () => (<DeleteIcon className='w-6 h-6 cursor-pointer text-red' />),
      actionFunc: handleRemove
    },
    {
      icon: () => (<EditIcon className='w-6 h-6 cursor-pointer' />),
      actionFunc: handleUpdate
    },
    {
      icon: (field: Field) => (
        <div className='cursor-pointer'>
          {
            field.active
              ? (<ToggleOnIcon className='w-6 h-6 cursor-pointer text-success' />)
              : (<ToggleOffIcon className='w-6 h-6 cursor-pointer' />)
          }
        </div>
      ),
      actionFunc: handleToggle
    }
  ]

  return (
    <section>
      {
        fields.length > 0
          ? (
            <Table
              columns={FIELD_COLUMNS}
              data={fields}
              actions={FIELD_ACTIONS}
              pagination={PAGINATION} />
            )
          : (<p>Todavía no hay campos registrados</p>)
      }

    </section>
  )
}

export default FieldsTable

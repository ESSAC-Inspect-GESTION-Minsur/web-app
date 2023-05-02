import React, { type ReactElement, useEffect, useState } from 'react'
import { FieldType } from '@/reports/models/enums/field-type.enum'
import { type Field } from '@/reports/models/field.entity'
import { FieldsService } from '@/reports/services/field.service'
import FieldForm from '../components/fields/FieldForm'
import Toast from '@/shared/ui/components/Toast'
import Table, { type Action, type Column } from '@/shared/ui/components/table/Table'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import { toast } from 'react-toastify'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import ToggleOnIcon from '@/shared/ui/assets/icons/ToogleOnIcon'
import ToggleOffIcon from '@/shared/ui/assets/icons/ToggleOfIcon'

const INITIAL_STATE: Field = {
  id: '',
  name: '',
  placeholder: '',
  createdAt: '',
  updatedAt: '',
  type: FieldType.TEXT,
  active: true,
  values: []
}

type FormAction = 'add' | 'update'

const TOAST_ID = 'field'

const FieldsView = (): ReactElement => {
  const fieldsService = new FieldsService()
  const fieldTypes = Object.values(FieldType)

  const [fields, setFields] = useState<Field[]>([])

  const [fieldForm, setFieldForm] = useState<Field>(INITIAL_STATE)
  const [formAction, setFormAction] = useState<FormAction>('add')

  useEffect(() => {
    void fieldsService.findAll()
      .then(response => {
        response.sort((a, b) => a.id > b.id ? 1 : -1)
        setFields(response)
      })
  }, [])

  const reset = (): void => {
    setFieldForm(INITIAL_STATE)
    setFormAction('add')
  }

  const handleUpdate = (field: Field): void => {
    setFieldForm(field)
    setFormAction('update')
  }

  const onFinishSubmit = (newField: Field): void => {
    reset()
    updateFieldList(newField, newField.id)
  }
  const updateFieldList = (newField: Field, id: string, remove: boolean = false): void => {
    const index = fields.findIndex(field => field.id === id)

    if (index === -1) {
      setFields([...fields, newField])
      return
    }
    if (remove) {
      setFields(fields.filter(field => field.id !== id))
      return
    }

    const fieldList = [...fields.slice(0, index), newField, ...fields.slice(index + 1, fields.length)]
    setFields(fieldList)
  }

  const handleRemove = (field: Field): void => {
    const confirmRemove = confirm('Are you sure to delete field?')
    if (!confirmRemove) return

    const id = field.id
    void fieldsService.remove(id)
      .then(response => {
        updateFieldList(response, id, true)
        toast('Campo eliminado correctamente', { toastId: TOAST_ID, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId: TOAST_ID, type: 'error' })
      })
  }

  const handleToggle = (fieldToToggle: Field): void => {
    void fieldsService.toggleActive(fieldToToggle.id)
      .then(response => {
        updateFieldList(response, response.id)
        toast('Campo actualizado correctamente', { toastId: TOAST_ID, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId: TOAST_ID, type: 'error' })
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
    <div className='container-page'>
      <h1 className='text-3xl mb-4 after:h-px after:w-60 after:bg-gray-light after:block after:mt-1 uppercase font-semibold'>Tipo de Checklists - Campos</h1>
      <div className='md:grid md:grid-cols-table md:gap-4'>
        <div className='mb-5 md:mb-0'>
          <aside className='pr-28 mb-5 md:mb-0'>
            <h2 className='font-bold uppercase '>Tipo de campos</h2>
            {
              fieldTypes.map(fieldType => {
                return (
                  <p className='capitalize border-b last-of-type:border-b-0 px-3' key={fieldType}>{fieldType}</p>
                )
              })
            }
          </aside>
          <FieldForm toastId={TOAST_ID} field={fieldForm} formAction={formAction} onFinishSubmit={onFinishSubmit} reset={reset} />
        </div>
        <section>
          {
            fields.length > 0
              ? (
                <Table columns={FIELD_COLUMNS} data={fields} actions={FIELD_ACTIONS} pagination={PAGINATION}></Table>
                )
              : (<p>Todavía no hay campos registrados</p>)
          }

        </section>
      </div>

      <Toast id={TOAST_ID}></Toast>
    </div>
  )
}

export default FieldsView

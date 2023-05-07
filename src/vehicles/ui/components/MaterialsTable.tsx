import React, { useContext, type ReactElement } from 'react'
import { MaterialContext } from '../contexts/MaterialContext'
import Table, { type Action, type Column } from '@/shared/ui/components/table/Table'
import { type Material } from '@/vehicles/models/material.interface'
import { capitalize } from '@/shared/utils'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import { MaterialsService } from '@/vehicles/services/materials.service'
import { toast } from 'react-toastify'

const MaterialsTable = (): ReactElement => {
  const { toastId, materials, setMaterialForm, removeMaterial, setSelectedMaterial } = useContext(MaterialContext)

  const handleRemove = (material: Material): void => {
    const materialsService = new MaterialsService()
    const result = confirm(`Estás seguro que quieres eliminar el tipo de material: ${material.name}`)
    if (!result) return

    const id = material.id
    void materialsService.remove(id)
      .then(() => {
        removeMaterial(id)
        setSelectedMaterial(null)
        setMaterialForm(null)
        toast('Tipo de vehículo eliminado correctamente', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  const handleUpdate = (material: Material): void => {
    setMaterialForm(material)
  }

  const AREAS_COLUMNS: Array<Column<Material>> = [
    {
      id: 'name',
      columnName: 'Nombre del material',
      filterFunc: (material) => material.name,
      render: (material) => capitalize(material.name),
      sortFunc: (a, b) => a.name > b.name ? 1 : -1
    },
    {
      id: 'status',
      columnName: 'Estado',
      filterFunc: (material) => material.active ? 'ACTIVO' : 'NO ACTIVO',
      render: (material) => material.active ? 'Activo' : 'No Activo',
      sortFunc: (a, b) => {
        const statusA = a.active ? 'ACTIVO' : 'NO ACTIVO'
        const statusB = b.active ? 'ACTIVO' : 'NO ACTIVO'

        return statusA > statusB ? 1 : -1
      }
    }
  ]

  const PAGINATION = [5, 10, 15, 20]

  const FIELD_ACTIONS: Array<Action<Material>> = [
    {
      icon: () => (<DeleteIcon className='w-6 h-6 cursor-pointer text-red' />),
      actionFunc: handleRemove
    },
    {
      icon: () => (<EditIcon className='w-6 h-6 cursor-pointer' />),
      actionFunc: handleUpdate
    }
  ]

  return (
    <main>
      {
        materials.length > 0
          ? (
            <Table
              data={materials}
              columns={AREAS_COLUMNS}
              pagination={PAGINATION}
              actions={FIELD_ACTIONS}
              showFilter={false}
            />
            )
          : <p>No hay materiales registrados</p>
      }

    </main>
  )
}

export default MaterialsTable

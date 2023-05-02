import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import Table, { type Action, type Column } from '@/shared/ui/components/table/Table'
import { type Material } from '@/routes/models/material.interface'
import { MaterialsService } from '@/routes/services/materials.service'
import { MaterialToastContext } from '../../pages/MaterialsView'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import Button from '@/shared/ui/components/Button'
import MaterialForm from './MaterialForm'
import { toast } from 'react-toastify'

type FormAction = 'add' | 'update'

const MaterialsComponent = (): ReactElement => {
  const materialToastContext = useContext(MaterialToastContext)
  const materialsService = new MaterialsService()
  const [materials, setMaterials] = useState<Material[]>([])

  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [formAction, setFormAction] = useState<FormAction>('add')

  const [showFormModal, setShowFormModal] = useState<boolean>(false)

  useEffect(() => {
    void materialsService.findAll()
      .then(setMaterials)
  }, [])

  const onFinishSubmit = (material: Material): void => {
    updateMaterialList(material, material.id)
  }

  const updateMaterialList = (material: Material, id: string, remove: boolean = false): void => {
    const index = materials.findIndex(material => material.id === id)

    if (index === -1) {
      setMaterials([...materials, material])
      return
    }

    if (remove) {
      setMaterials(materials.filter(material => material.id !== id))
      return
    }

    const materialList = [...materials.slice(0, index), material, ...materials.slice(index + 1, materials.length)]
    setMaterials(materialList)
  }

  const update = (material: Material): void => {
    setSelectedMaterial(material)
    setFormAction('update')
    setShowFormModal(true)
  }

  const add = (): void => {
    setSelectedMaterial(null)
    setFormAction('add')
    setShowFormModal(true)
  }

  const remove = (material: Material): void => {
    const result = confirm(`Estas seguro que quieres eliminar el tipo de material ${material.name}`)
    if (!result) return

    const id = material.id
    void materialsService.remove(id)
      .then(response => {
        updateMaterialList(response, id, true)
        toast('Tipo de material eliminado correctamente', { toastId: materialToastContext.id, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId: materialToastContext.id, type: 'error' })
      })
  }

  const MATERIAL_COLUMNS: Array<Column<Material>> = [
    {
      id: 'name',
      columnName: 'Nombre',
      filterFunc: (material) => material.name,
      render: (material) => material.name,
      sortFunc: (a, b) => a.name > b.name ? 1 : -1
    },
    {
      id: 'createdAt',
      columnName: 'Fecha de Creación',
      filterFunc: (material) => new Date(material.createdAt).toDateString(),
      render: (material) => new Date(material.createdAt).toDateString(),
      sortFunc: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }
  ]

  const PAGINATION = [5, 10, 20]

  const MATERIAL_ACTIONS: Array<Action<Material>> = [
    {
      icon: () => (<EditIcon className='cursor-pointer w-5 h-5' />),
      actionFunc: update
    },
    {
      icon: () => (<DeleteIcon className='cursor-pointer w-5 h-5 text-red' />),
      actionFunc: remove
    }
  ]

  return (
    <div className=''>
      <div className='flex justify-between items-center mb-5'>
        <div className='flex flex-col sm:flex-row gap-2 sm:justify-center'>
          <Button color='primary' onClick={add}>Añadir Tipo de Material</Button>
        </div>
      </div>
      {
        materials.length > 0
          ? <Table columns={MATERIAL_COLUMNS} data={materials} pagination={PAGINATION} actions={MATERIAL_ACTIONS} />
          : (<p>No hay vehiculos registrados</p>)
      }
      { showFormModal && <MaterialForm close={() => { setShowFormModal(false) }} formAction={formAction} material={selectedMaterial} onFinishSubmit={onFinishSubmit}/>}
    </div>
  )
}

export default MaterialsComponent

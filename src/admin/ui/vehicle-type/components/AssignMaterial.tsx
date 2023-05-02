import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'

import { type Material } from '@/routes/models/material.interface'
import { type VehicleType } from '@/routes/models/vehicle-type.interface'
import { MaterialsService } from '@/routes/services/materials.service'
import { VehicleTypesService } from '@/routes/services/vehicle-type.service'

import { VehicleTypeContext } from '@/admin/ui/vehicle-type/context'

interface AssingMaterialProps {
  vehicleTypeMaterials: Material[]
  vehicleType: VehicleType | null
  update: (materials: Material[]) => void
  close: () => void
}

const MATERIAL_INITIAL_STATE: Material = {
  id: '',
  name: '',
  createdAt: '',
  updatedAt: '',
  active: true
}

const AssignMaterial = ({ vehicleTypeMaterials, vehicleType, update, close }: AssingMaterialProps): ReactElement => {
  const vehicleTypeContext = useContext(VehicleTypeContext)

  const navigate = useNavigate()

  const [materials, setMaterials] = useState<Material[]>([])
  const [selectedMaterial, setSelectedMaterial] = useState<Material>(MATERIAL_INITIAL_STATE)

  useEffect(() => {
    const materialsService = new MaterialsService()

    void materialsService.findAll()
      .then(response => {
        const actualMaterialIds = vehicleTypeMaterials.map(material => material.id)
        setMaterials(response.filter(material => !actualMaterialIds.includes(material.id)))
      })
  }, [vehicleTypeMaterials])

  useEffect(() => {
    if (materials.length > 0) setSelectedMaterial(materials[0])
  }, [materials])

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.target
    const material = materials.find(material => material.id === value)
    setSelectedMaterial(material ?? MATERIAL_INITIAL_STATE)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    const vehicleTypeService = new VehicleTypesService()
    event.preventDefault()

    void vehicleTypeService.assignMaterial(vehicleType?.id ?? '', selectedMaterial.id)
      .then(response => {
        update(response.materials)
        close()
        toast('Tipo de material asignado correctamente', { toastId: vehicleTypeContext.toastId, type: 'success' })
      })
      .catch(error => {
        const { message } = error.data
        toast(message, { toastId: vehicleTypeContext.toastId, type: 'error' })
      })
  }

  const modal = (): React.ReactElement => {
    return (
      <form onSubmit={handleSubmit}>
        <label className='font-medium'>Tipo de materiales</label>
        <select
          className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none capitalize'
          onChange={handleSelectChange} value={selectedMaterial.id}>
          {materials.map(material => (
            <option key={material.id} value={material.id}>{material.name}</option>
          ))}
        </select>
        <div className='mt-4'>
          <Button color='primary' type='submit'>Asignar</Button>
        </div>
      </form>
    )
  }

  const addMaterialMessage = (): React.ReactElement => {
    return (
      <div>
        <p className='text-center mb-3 text-lg'>Todos los tipos de materiales están asignados, crea algún tipo de material si deseas asignar más</p>

        <div className='flex justify-center gap-3 items-center'>
          <Button color='primary' onClick={() => { navigate('/admin/materials') }}>Añadir tipo de material</Button>
        </div>
      </div>
    )
  }

  return (
    <Modal>
      <div className='min-w-[300px] sm:min-w-[600px] p-6'>
        <div className='flex justify-between items-center gap-4'>
          <h2 className='uppercase font-bold'>Asignar tipo de material al tipo de vehiculo { vehicleType?.name }</h2>
          <Button color='secondary' onClick={close}>Cerrar</Button>
        </div>
        {
          materials.length > 0 ? modal() : addMaterialMessage()
        }
      </div>

    </Modal >
  )
}

export default AssignMaterial

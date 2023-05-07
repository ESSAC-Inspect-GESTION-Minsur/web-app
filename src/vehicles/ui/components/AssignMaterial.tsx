import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'

import { MATERIAL_INITIAL_STATE, type Material } from '@/vehicles/models/material.interface'
import { VehicleTypeContext } from '../contexts/VehicleTypeContext'
import { MaterialsService } from '@/vehicles/services/materials.service'
import { VehicleTypesService } from '@/vehicles/services/vehicle-types.service'
import Divider from '@/shared/ui/components/Divider'

interface AssignMaterialProps {
  isOpen: boolean
  actualMaterials: Material[]
  update: (materials: Material[]) => void
  onClose: () => void
}

const AssignMaterial = ({ isOpen, actualMaterials, update, onClose }: AssignMaterialProps): ReactElement => {
  const { toastId, selectedVehicleType } = useContext(VehicleTypeContext)

  const navigate = useNavigate()

  const [materials, setMaterials] = useState<Material[]>([])
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const materialsService = new MaterialsService()

    void materialsService.findAll()
      .then(response => {
        const actualMaterialIds = actualMaterials.map(material => material.id)
        setMaterials(response.filter(material => !actualMaterialIds.includes(material.id)))
      })
  }, [selectedVehicleType, isOpen])

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
    const id = selectedVehicleType?.id ?? ''
    const materialId = selectedMaterial?.id ?? ''

    void vehicleTypeService.assignMaterial(id, materialId)
      .then(response => {
        update(response.materials)
        onClose()
        toast('Tipo de material asignado correctamente', { toastId, type: 'success' })
      })
      .catch(error => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  const modal = (): React.ReactElement => {
    return (
      <form onSubmit={handleSubmit}>
        <label className='font-medium'>Tipo de materiales</label>
        <select
          className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none capitalize'
          onChange={handleSelectChange} value={selectedMaterial?.id}>
          {materials.map(material => (
            <option key={material.id} value={material.id}>{material.name}</option>
          ))}
        </select>
        <div className='mt-4 flex gap-2'>
          <Button color='primary' type='submit'>Asignar</Button>
          <Button color='secondary' onClick={onClose}>Cancelar</Button>
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
    <Modal isOpen={isOpen} onClose={onClose} className='min-w-[300px] sm:min-w-[600px]'>
      <div className='p-2'>
        <h2 className='uppercase font-bold text-center text-lg'>Asignar tipo de material al tipo de vehículo {selectedVehicleType?.name}</h2>
        <Divider></Divider>
        {
          materials.length > 0 ? modal() : addMaterialMessage()
        }
      </div>

    </Modal >
  )
}

export default AssignMaterial

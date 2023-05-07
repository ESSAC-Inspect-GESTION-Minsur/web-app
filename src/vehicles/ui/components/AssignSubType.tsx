import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'
import { VehicleTypeContext } from '../contexts/VehicleTypeContext'
import { type VehicleType } from '@/vehicles/models/vehicle-type.interface'
import { VehicleTypesService } from '@/vehicles/services/vehicle-types.service'
import Divider from '@/shared/ui/components/Divider'

interface AssignSubtypeProps {
  isOpen: boolean
  onClose: () => void
}

const AssignSubtype = ({ isOpen, onClose }: AssignSubtypeProps): ReactElement => {
  const {
    selectedVehicleType: vehicleType,
    setSelectedVehicleType: setVehicleType,
    toastId,
    updateVehicleType
  } = useContext(VehicleTypeContext)

  const [subtypes, setSubtypes] = useState<VehicleType[]>([])
  const [selectedSubtype, setSelectedSubtype] = useState<VehicleType | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const vehicleTypeService = new VehicleTypesService()
    void vehicleTypeService.findAll()
      .then(response => {
        const actualSubtypes = vehicleType?.children.map(vehicleType => vehicleType.id)
        setSubtypes(response.filter(subtype => !actualSubtypes?.includes(subtype.id) && subtype.isCart && subtype.parent === null))
      })
  }, [vehicleType, isOpen])

  useEffect(() => {
    if (subtypes.length > 0) setSelectedSubtype(subtypes[0])
  }, [subtypes])

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.target
    const subtype = subtypes.find(subtype => subtype.id === value)
    setSelectedSubtype(subtype ?? null)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const vehicleTypeService = new VehicleTypesService()

    const vehicleTypeId = vehicleType?.id ?? ''
    const subtypeId = selectedSubtype?.id ?? ''

    void vehicleTypeService.assignChild(vehicleTypeId, subtypeId)
      .then(response => {
        setVehicleType(response)
        updateVehicleType(response)
        onClose()
        toast('Subtipo asignado correctamente', { toastId, type: 'success' })
      })
      .catch(error => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  const modal = (): React.ReactElement => {
    return (
      <form onSubmit={handleSubmit}>
        <label className='font-medium'>Subtipos</label>
        <select
          className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none capitalize'
          onChange={handleSelectChange} value={selectedSubtype?.id ?? ''}>
          {subtypes.map(subtype => (
            <option key={subtype.id} value={subtype.id}>{subtype.name}</option>
          ))}
        </select>
        <div className='mt-4 flex gap-3'>
          <Button color='primary' type='submit'>Asignar</Button>
          <Button color='secondary' onClick={onClose}>Cerrar</Button>
        </div>
      </form>
    )
  }

  const addMaterialMessage = (): React.ReactElement => {
    return (
      <div>
        <p className='text-center mb-3 text-lg'>Todos los subtipos están asignados, crea alguna carreta si deseas asignar más</p>

        <div className='flex justify-center gap-3 items-center'>
          <Button color='primary' onClick={onClose}>Añadir Carreta</Button>
        </div>
      </div>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className='min-w-[300px] sm:min-w-[600px]'>
      <div className='p-3'>
        <h2 className='uppercase font-bold text-center text-lg'>Asignar subtipos al tipo de vehículo {vehicleType?.name}</h2>
        <Divider className='mt-0'></Divider>
        {
          subtypes.length > 0 ? modal() : addMaterialMessage()
        }
      </div>

    </Modal >
  )
}

export default AssignSubtype

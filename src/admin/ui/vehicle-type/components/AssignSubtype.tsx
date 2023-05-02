import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'

import { VEHICLE_TYPE_INITIAL_STATE, type VehicleType } from '@/routes/models/vehicle-type.interface'
import { VehicleTypesService } from '@/routes/services/vehicle-type.service'

import { VehicleTypeContext } from '@/admin/ui/vehicle-type/context'

interface AssignSubtypeProps {
  close: () => void
}

const AssignSubtype = ({ close }: AssignSubtypeProps): ReactElement => {
  const {
    selectedVehicleType: vehicleType,
    setSelectedVehicleType: setVehicleType,
    toastId,
    update
  } = useContext(VehicleTypeContext)

  const [subtypes, setSubtypes] = useState<VehicleType[]>([])
  const [selectedSubtype, setSelectedSubtype] = useState<VehicleType>(VEHICLE_TYPE_INITIAL_STATE)

  useEffect(() => {
    const vehicleTypeService = new VehicleTypesService()
    void vehicleTypeService.findAll()
      .then(response => {
        const actualSubtypes = vehicleType?.children.map(vehicleType => vehicleType.id)
        setSubtypes(response.filter(subtype => !actualSubtypes?.includes(subtype.id) && subtype.isCart && subtype.parent === null))
      })
  }, [vehicleType])

  useEffect(() => {
    if (subtypes.length > 0) setSelectedSubtype(subtypes[0])
  }, [subtypes])

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.target
    const subtype = subtypes.find(subtype => subtype.id === value)
    setSelectedSubtype(subtype ?? VEHICLE_TYPE_INITIAL_STATE)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const vehicleTypeService = new VehicleTypesService()
    void vehicleTypeService.assingChild(vehicleType?.id ?? '', selectedSubtype.id ?? '')
      .then(response => {
        setVehicleType(response)
        update(response)
        close()
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
          onChange={handleSelectChange} value={selectedSubtype.id}>
          {subtypes.map(subtype => (
            <option key={subtype.id} value={subtype.id}>{subtype.name}</option>
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
        <p className='text-center mb-3 text-lg'>Todos los subtipos están asignados, crea algún tipo de vehículo si deseas asignar más</p>

        <div className='flex justify-center gap-3 items-center'>
          <Button color='primary' onClick={close}>Añadir tipo de vehículos</Button>
        </div>
      </div>
    )
  }

  return (
    <Modal>
      <div className='min-w-[300px] sm:min-w-[600px] p-6'>
        <div className='flex justify-between items-center gap-4'>
          <h2 className='uppercase font-bold'>Asignar subtipos al tipo de vehiculo { vehicleType?.name }</h2>
          <Button color='secondary' onClick={close}>Cerrar</Button>
        </div>
        {
          subtypes.length > 0 ? modal() : addMaterialMessage()
        }
      </div>

    </Modal >
  )
}

export default AssignSubtype

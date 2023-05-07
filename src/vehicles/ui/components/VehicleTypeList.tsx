import React, { useContext, type ReactElement } from 'react'
import { toast } from 'react-toastify'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import VehicleIcon from '@/shared/ui/assets/icons/VehicleIcon'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import { type VehicleType } from '@/vehicles/models/vehicle-type.interface'
import { VehicleTypesService } from '@/vehicles/services/vehicle-types.service'
import { VehicleTypeContext } from '../contexts/VehicleTypeContext'

interface VehicleTypeListProps {
  name: string
  vehicleTypes: VehicleType[]
}

const VehicleTypeList = ({ name, vehicleTypes }: VehicleTypeListProps): ReactElement => {
  const { toastId, selectedVehicleType, setSelectedVehicleType, removeVehicleType, setVehicleTypeForm } = useContext(VehicleTypeContext)

  const handleUpdate = (vehicleType: VehicleType): void => {
    setVehicleTypeForm(vehicleType)
  }

  const handleRemove = (vehicleType: VehicleType): void => {
    const vehicleTypesService = new VehicleTypesService()
    const result = confirm(`Estás seguro que quieres eliminar el tipo de vehículo: ${vehicleType.name}`)
    if (!result) return

    const id = vehicleType.id
    void vehicleTypesService.remove(id)
      .then(() => {
        removeVehicleType(id)
        setSelectedVehicleType(null)
        toast('Tipo de vehículo eliminado correctamente', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  return (
    <section>
      <h3 className='uppercase font-semibold text-lg'>{name}</h3>
      {vehicleTypes.length === 0 && <p>No hay tipos de vehículos</p>}
      {
        vehicleTypes.map(vehicleType => (
          <div key={vehicleType.id}
            onClick={() => { setSelectedVehicleType(vehicleType) }}
            className={`uppercase cursor-pointer w-full flex justify-between items-center py-2 border-b-2  rounded-r-xl ${vehicleType.id === selectedVehicleType?.id ? 'bg-blue text-white' : ''}`}>
            <p className='px-2'>{vehicleType.name}</p>
            <div className='flex gap-3 px-2'>
              {vehicleType.isCart && <VehicleIcon className='w-5 h-5 ' />}
              <EditIcon className='cursor-pointer w-5 h-5' onClick={() => { handleUpdate(vehicleType) }} />
              <DeleteIcon className='cursor-pointer w-5 h-5 ' onClick={() => { handleRemove(vehicleType) }} />
            </div>
          </div>
        ))
      }
    </section>

  )
}

export default VehicleTypeList

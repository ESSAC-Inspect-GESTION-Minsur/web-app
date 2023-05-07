import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import { type VehicleType } from '@/vehicles/models/vehicle-type.interface'
import { VehicleTypesService } from '@/vehicles/services/vehicle-types.service'
import React, { Fragment, useContext, type ReactElement } from 'react'
import { VehicleTypeContext } from '../contexts/VehicleTypeContext'
import { toast } from 'react-toastify'

interface SubTypesListProps {
  subTypes: VehicleType[]
}

const SubTypesList = ({ subTypes }: SubTypesListProps): ReactElement => {
  const { toastId, selectedVehicleType, setSelectedVehicleType, updateVehicleType } = useContext(VehicleTypeContext)

  const handleRemoveChild = (subtype: VehicleType): void => {
    const result = confirm(`Estás seguro que quieres desasignar la carreta: ${subtype.name ?? ''}`)
    if (!result) return

    const vehicleTypeService = new VehicleTypesService()

    void vehicleTypeService.removeChild(selectedVehicleType?.id ?? '', subtype.id ?? '')
      .then(response => {
        setSelectedVehicleType(response)
        updateVehicleType(response)
        toast('Carreta desasignada correctamente', { toastId, type: 'success' })
      })
      .catch(error => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  return (
    <Fragment>
      {
        subTypes.length > 0
          ? (
            <div className='flex gap-4 flex-wrap'>
              {
                subTypes.map(subType => (
                  <div key={subType.id} className='max-w-[220px] p-7 bg-black text-white rounded-lg flex flex-col justify-between items-center gap-2'>
                    <p className='uppercase'>{subType.name}</p>
                    <DeleteIcon className='w-6 h-6 cursor-pointer text-red' onClick={() => { handleRemoveChild(subType) }} />
                  </div>
                ))
              }
            </div>
            )
          : (
            <p>{'El tipo de vehículo no tiene ningún tipo de material asignado'}</p>
            )
      }
    </Fragment>
  )
}

export default SubTypesList

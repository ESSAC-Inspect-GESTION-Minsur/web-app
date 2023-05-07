import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import { type Material } from '@/vehicles/models/material.interface'
import { VehicleTypesService } from '@/vehicles/services/vehicle-types.service'
import React, { useContext, type ReactElement, Fragment } from 'react'
import { VehicleTypeContext } from '../contexts/VehicleTypeContext'
import { toast } from 'react-toastify'

interface MaterialsListProps {
  materials: Material[]
  setMaterials: (materials: Material[]) => void
}

const MaterialsList = ({ materials, setMaterials }: MaterialsListProps): ReactElement => {
  const {
    selectedVehicleType: vehicleType,
    toastId
  } = useContext(VehicleTypeContext)

  const handleRemove = (materialDeleted: Material): void => {
    const vehicleTypesService = new VehicleTypesService()
    const result = confirm(`Estás seguro que quieres desasingar el tipo de material ${materialDeleted.name}`)
    if (!result) return

    void vehicleTypesService.removeMaterial(vehicleType?.id ?? '', materialDeleted.id)
      .then((response) => {
        setMaterials(response.materials)
        toast('Tipo de material desasignado correctamente', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  return (
    <Fragment>
      {
          materials.length > 0
            ? (
              <section className='flex gap-4 flex-wrap'>
                {
                  materials.map(material => (
                    <div key={material.id} className='max-w-[220px] p-7 bg-black text-white rounded-lg flex flex-col justify-between items-center gap-2'>
                      <p className='uppercase'>{material.name}</p>
                      <DeleteIcon className='w-6 h-6 cursor-pointer text-red' onClick={() => { handleRemove(material) } } />
                    </div>
                  ))
                }
              </section>
              )
            : (
              <p>{'El tipo de vehículo no tiene ningún tipo de material asignado'}</p>
              )
        }
    </Fragment>
  )
}

export default MaterialsList

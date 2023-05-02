import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import Button from '@/shared/ui/components/Button'

import { type Material } from '@/routes/models/material.interface'
import { VehicleTypesService } from '@/routes/services/vehicle-type.service'

import { VehicleTypeContext } from '@/admin/ui/vehicle-type/context'
import AssignMaterial from './AssignMaterial'

const VehicleTypeMaterialsComponent = (): ReactElement => {
  const {
    selectedVehicleType: vehicleType,
    toastId
  } = useContext(VehicleTypeContext)

  const [materials, setMaterials] = useState<Material[]>([])

  const [showAssignMaterialModal, setShowAssignMaterialModal] = useState<boolean>(false)

  useEffect(() => {
    const vehicleTypesService = new VehicleTypesService()
    if (vehicleType !== null) {
      void vehicleTypesService.findAllMaterials(vehicleType.id)
        .then(setMaterials)
    }
  }, [vehicleType])

  const update = (materials: Material[]): void => {
    setMaterials(materials)
  }

  const remove = (materialDeleted: Material): void => {
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

  const body = (): React.ReactElement => {
    return (
      <section>
        <div className='flex justify-between items-center mb-3 gap-4'>
          <h2 className='uppercase font-bold text-lg'>Tipos de materiales asignados al <span className='text-red'>tipo de vehiculo {vehicleType?.name}</span></h2>
          <Button color='primary' onClick={() => { setShowAssignMaterialModal(true) }}>Asignar Tipo de Material</Button>
        </div>
        {
          materials.length > 0
            ? (
              <div className='flex gap-4 flex-wrap'>
                {
                  materials.map(material => (
                    <div key={material.id} className='max-w-[220px] p-7 bg-black text-white rounded-lg flex flex-col justify-between items-center gap-2'>
                      <p className='uppercase'>{material.name}</p>
                      <DeleteIcon className='w-6 h-6 cursor-pointer text-red' onClick={() => { remove(material) } } />
                    </div>
                  ))
                }
              </div>
              )
            : (
              <p>{'El tipo de vehiculo no tiene ningún tipo de material asignado'}</p>
              )
        }
        {showAssignMaterialModal && <AssignMaterial close={() => { setShowAssignMaterialModal(false) }} vehicleType={vehicleType} vehicleTypeMaterials={materials} update={update} />}
      </section>
    )
  }

  const noVehicleTypeSelectedMessage = (): React.ReactElement => {
    return (
      <p>Por favor selecciona un tipo de vehiculo</p>
    )
  }

  return (
    <div>
      {
        vehicleType === null ? noVehicleTypeSelectedMessage() : body()
      }
    </div>
  )
}

export default VehicleTypeMaterialsComponent

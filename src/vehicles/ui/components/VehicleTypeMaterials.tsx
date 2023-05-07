import React, { type ReactElement, useContext, useEffect, useState } from 'react'

import Button from '@/shared/ui/components/Button'
import { type Material } from '@/vehicles/models/material.interface'
import { VehicleTypesService } from '@/vehicles/services/vehicle-types.service'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import { VehicleTypeContext } from '../contexts/VehicleTypeContext'
import MaterialsList from './MaterialsList'
import AssignMaterial from './AssignMaterial'

const VehicleTypeMaterials = (): ReactElement => {
  const {
    selectedVehicleType: vehicleType
  } = useContext(VehicleTypeContext)

  const [materials, setMaterials] = useState<Material[]>([])

  const [showAssignMaterialModal, toggleShowAssignMaterialModal] = useBooleanState()

  useEffect(() => {
    if (vehicleType === null) return

    const vehicleTypesService = new VehicleTypesService()
    void vehicleTypesService.findAllMaterials(vehicleType.id)
      .then(setMaterials)
  }, [vehicleType])

  const update = (materials: Material[]): void => {
    setMaterials(materials)
  }

  const body = (): React.ReactElement => {
    return (
      <div>
        <div className='flex justify-between items-center mb-3 gap-4'>
          <h2 className='uppercase font-bold text-lg'>Tipos de materiales asignados al <span className='text-red'>tipo de vehículo {vehicleType?.name}</span></h2>
          <Button color='primary' onClick={toggleShowAssignMaterialModal}>Asignar Tipo de Material</Button>
        </div>
        <MaterialsList materials={materials} setMaterials={setMaterials} />
        <AssignMaterial isOpen={showAssignMaterialModal} onClose={toggleShowAssignMaterialModal} update={update} actualMaterials={materials}/>
      </div>
    )
  }

  const noVehicleTypeSelectedMessage = (): React.ReactElement => {
    return (
      <p>Por favor selecciona un tipo de vehículo</p>
    )
  }

  return (
    <section>
      {
        vehicleType === null ? noVehicleTypeSelectedMessage() : body()
      }
    </section>
  )
}

export default VehicleTypeMaterials

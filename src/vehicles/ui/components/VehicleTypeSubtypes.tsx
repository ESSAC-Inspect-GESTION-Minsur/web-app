import React, { type ReactElement, useContext, useMemo } from 'react'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import Button from '@/shared/ui/components/Button'
import { VehicleTypeContext } from '../contexts/VehicleTypeContext'
import SubTypesList from './SubtypesList'
import AssignSubtype from './AssignSubType'

const VehicleTypeSubTypes = (): ReactElement => {
  const {
    selectedVehicleType: vehicleType
  } = useContext(VehicleTypeContext)

  const [showAssignSubtype, toggleShowAssignSubtype] = useBooleanState()

  const subTypes = useMemo(
    () => vehicleType?.children ?? []
    , [vehicleType])

  const body = (): React.ReactElement => {
    return (
      <section>
        <div className='flex justify-between items-center mb-3 gap-4'>
          <h2 className='uppercase font-bold text-lg'>Carretas asignadas al <span className='text-red'>tipo de vehículo {vehicleType?.name}</span></h2>
          <Button color='primary' onClick={toggleShowAssignSubtype}>Agregar Carreta</Button>
        </div>
        <SubTypesList subTypes={subTypes}/>
        <AssignSubtype isOpen={showAssignSubtype} onClose={toggleShowAssignSubtype} />
      </section>
    )
  }

  return (
    <>
      {
        vehicleType !== null && body()
      }
    </>
  )
}

export default VehicleTypeSubTypes

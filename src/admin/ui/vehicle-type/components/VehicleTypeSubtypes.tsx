import React, { type ReactElement, useContext, useMemo } from 'react'
import Button from '@/shared/ui/components/Button'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'

import { VehicleTypeContext } from '@/admin/ui/vehicle-type/context'
import AssignSubtype from './AssignSubtype'
import { type VehicleType } from '@/routes/models/vehicle-type.interface'
import { VehicleTypesService } from '@/routes/services/vehicle-type.service'
import { toast } from 'react-toastify'

const VehicleTypeSubTypes = (): ReactElement => {
  const {
    selectedVehicleType: vehicleType,
    setSelectedVehicleType: setVehicleType,
    update,
    toastId
  } = useContext(VehicleTypeContext)
  const [showAssignSubtype, setShowAssignSubtype] = React.useState(false)

  const subTypes = useMemo(
    () => vehicleType?.children ?? []
    , [vehicleType])

  const removeChild = (subtype: VehicleType): void => {
    const result = confirm(`Estás seguro que quieres desaginar la carreta: ${subtype.name ?? ''}`)
    if (!result) return
    const vehicleTypeService = new VehicleTypesService()
    void vehicleTypeService.removeChild(vehicleType?.id ?? '', subtype.id ?? '')
      .then(response => {
        setVehicleType(response)
        update(response)
        toast('Carreta desasignada correctamente', { toastId, type: 'success' })
      })
      .catch(error => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  const body = (): React.ReactElement => {
    return (
      <section>
        <div className='flex justify-between items-center mb-3 gap-4'>
          <h2 className='uppercase font-bold text-lg'>Carretas asignadas al <span className='text-red'>tipo de vehiculo {vehicleType?.name}</span></h2>
          <Button color='primary' onClick={() => { setShowAssignSubtype(true) }}>Agregar Carreta</Button>
        </div>
        {
          subTypes.length > 0
            ? (
              <div className='flex gap-4 flex-wrap'>
                {
                  subTypes.map(subtType => (
                    <div key={subtType.id} className='max-w-[220px] p-7 bg-black text-white rounded-lg flex flex-col justify-between items-center gap-2'>
                      <p className='uppercase'>{subtType.name}</p>
                      <DeleteIcon className='w-6 h-6 cursor-pointer text-red' onClick={() => { removeChild(subtType) }} />
                    </div>
                  ))
                }
              </div>
              )
            : (
              <p>{'El tipo de vehiculo no tiene ningún tipo de material asignado'}</p>
              )
        }
        {showAssignSubtype && <AssignSubtype close={() => { setShowAssignSubtype(false) }} />}
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

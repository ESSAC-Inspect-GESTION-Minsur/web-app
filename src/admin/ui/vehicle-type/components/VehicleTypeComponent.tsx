import React, { type ReactElement, useContext, useState, useMemo, Fragment } from 'react'
import { toast } from 'react-toastify'

import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'

import { type VehicleType } from '@/routes/models/vehicle-type.interface'
import { VehicleTypesService } from '@/routes/services/vehicle-type.service'

import { VehicleTypeContext } from '@/admin/ui/vehicle-type/context'
import VehicleTypeForm from './VehicleTypeForm'
import VehicleIcon from '@/shared/ui/assets/icons/VehicleIcon'

type FormAction = 'add' | 'update'

const VehicleTypeComponent = (): ReactElement => {
  const {
    vehicleTypes,
    selectedVehicleType,
    setSelectedVehicleType,
    setVehicleTypeForm,
    toastId,
    remove
  } = useContext(VehicleTypeContext)

  const [formAction, setFormAction] = useState<FormAction>('add')

  const vehicleTypesNoCart = useMemo(() => vehicleTypes.filter(vehicleType => !vehicleType.isCart), [vehicleTypes])
  const vehicleTypesCart = useMemo(() => vehicleTypes.filter(vehicleType => vehicleType.isCart), [vehicleTypes])

  const reset = (): void => {
    setVehicleTypeForm(null)
    setFormAction('add')
  }

  const updateVehicleType = (vehicleType: VehicleType): void => {
    setVehicleTypeForm(vehicleType)
    setFormAction('update')
  }

  const removeVehicleType = (vehicleType: VehicleType): void => {
    console.log('removeVehicleType')
    const vehicleTypesService = new VehicleTypesService()
    const result = confirm(`Estás seguro que quieres eliminar el tipo de vehículo: ${vehicleType.name}`)
    if (!result) return

    const id = vehicleType.id
    void vehicleTypesService.remove(id)
      .then(() => {
        remove(id)
        setSelectedVehicleType(null)
        toast('Tipo de vehículo eliminado correctamente', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  const vehicleTypeDetail = (vehicleType: VehicleType): ReactElement => {
    return (
      <div key={vehicleType.id}
        onClick={() => { setSelectedVehicleType(vehicleType) }}
        className={`cursor-pointer w-full flex justify-between items-center py-2 border-b-2  rounded-r-xl ${vehicleType.id === selectedVehicleType?.id ? 'bg-blue text-white' : ''}`}>
        <p className='px-2'>{vehicleType.name}</p>
        <div className='flex gap-3 px-2'>
          {vehicleType.isCart && <VehicleIcon className='w-5 h-5 ' />}
          <EditIcon className='cursor-pointer w-5 h-5' onClick={() => { updateVehicleType(vehicleType) }} />
          <DeleteIcon className='cursor-pointer w-5 h-5 ' onClick={() => { removeVehicleType(vehicleType) }} />
        </div>
      </div>
    )
  }

  return (
    <Fragment>
      <section>
      <h3 className='uppercase font-semibold text-lg'>Vehículos</h3>
        {
          vehicleTypesNoCart.map(vehicleType => vehicleTypeDetail(vehicleType))
        }
      </section>
      <section className='mt-2'>
        <h3 className='uppercase font-semibold text-lg'>Carretas</h3>
        {
          vehicleTypesCart.map(vehicleType => vehicleTypeDetail(vehicleType))
        }
      </section>
      {vehicleTypes.length <= 0 && (<p>No hay tipo de vehículos</p>)}
      <section>
        <VehicleTypeForm formAction={formAction} reset={reset} />
      </section>
    </Fragment>

  )
}

export default VehicleTypeComponent

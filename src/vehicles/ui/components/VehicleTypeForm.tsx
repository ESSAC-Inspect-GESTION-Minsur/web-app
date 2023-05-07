import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import Button from '@/shared/ui/components/Button'
import Input from '@/shared/ui/components/Input'
import { VehicleTypeContext } from '../contexts/VehicleTypeContext'
import { useDataForm } from '@/shared/hooks/useDataForm'
import { VEHICLE_TYPE_DTO_INITIAL_STATE, type VehicleTypeDto } from '@/vehicles/models/vehicle-type.interface'
import { VehicleTypesService } from '@/vehicles/services/vehicle-types.service'
import { type FormAction } from '@/shared/types'

const VehicleTypeForm = (): ReactElement => {
  const {
    toastId,
    vehicleTypeForm,
    setVehicleTypeForm,
    setSelectedVehicleType,
    updateVehicleType,
    addVehicleType
  } = useContext(VehicleTypeContext)

  const [vehicleType, setVehicleTypeValue, setVehicleType, reset] = useDataForm<VehicleTypeDto>(VEHICLE_TYPE_DTO_INITIAL_STATE)
  const [formAction, setFormAction] = useState<FormAction>('add')

  useEffect(() => {
    if (vehicleTypeForm === null) {
      setFormAction('add')
      return
    }

    const { name, isCart } = vehicleTypeForm
    setFormAction('update')

    setVehicleType({
      name,
      isCart
    })
  }, [vehicleTypeForm])

  const handleCancel = (): void => {
    setVehicleTypeForm(null)
    reset()
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const vehicleTypesService = new VehicleTypesService()

    const submitFunction = formAction === 'add' ? vehicleTypesService.create : vehicleTypesService.update
    const onSuccess = formAction === 'add' ? addVehicleType : updateVehicleType

    const id = vehicleTypeForm?.id ?? ''

    void submitFunction(vehicleType, id)
      .then(response => {
        onSuccess(response)
        setSelectedVehicleType(response)
        setVehicleTypeForm(null)
        reset()

        toast(`Tipo de vehículo ${formAction === 'add' ? 'agregado' : 'actualizado'} correctamente`, { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  return (
    <div className='mt-2'>
      <h2 className='uppercase font-bold'>{formAction === 'add' ? 'Añadir' : 'Editar'} Tipo de Vehículo</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <Input
            label='Nombre'
            value={vehicleType.name}
            name='name' placeholder='Nombre del tipo de vehículo' type='text'
            setValue={setVehicleTypeValue}></Input>
        </div>

        <Input
          label='¿Es carreta?'
          value={vehicleType.isCart ? 'true' : 'false'}
          name='isCart' placeholder='¿Es carreta?' type='checkbox'
          setValue={setVehicleTypeValue}></Input>

        <div className='mt-5 flex gap-2'>
          <Button color='primary' type='submit'>{formAction === 'add' ? 'Añadir' : 'Editar'}</Button>
          <Button color='secondary' onClick={handleCancel}>Cancelar</Button>
        </div>
      </form>
    </div>
  )
}

export default VehicleTypeForm

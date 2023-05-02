import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import Button from '@/shared/ui/components/Button'
import Input from '@/shared/ui/components/Input'

import { VEHICLE_TYPE_DTO_INITIAL_STATE, type VehicleTypeDto, type VehicleType } from '@/routes/models/vehicle-type.interface'
import { VehicleTypesService } from '@/routes/services/vehicle-type.service'

import { VehicleTypeContext } from '@/admin/ui/vehicle-type/context'

type FormAction = 'add' | 'update'

interface VehicleTypeFormProps {
  formAction: FormAction
  reset: () => void
}
const getInitialState = (vehicleType: VehicleType | null): VehicleTypeDto => {
  if (vehicleType === null) return VEHICLE_TYPE_DTO_INITIAL_STATE
  const { name, isCart } = vehicleType
  return { name, isCart }
}

const VehicleTypeForm = ({ formAction, reset }: VehicleTypeFormProps): ReactElement => {
  const {
    vehicleTypeForm,
    setVehicleTypeForm,
    setSelectedVehicleType,
    toastId,
    update,
    add
  } = useContext(VehicleTypeContext)

  const [inputValue, setInputValue] = useState<VehicleTypeDto>(getInitialState(vehicleTypeForm))

  const [canSubmit, setCanSubmit] = useState<boolean>(false)
  const [resetInputs, setResetInputs] = useState<boolean>(false)

  useEffect(() => {
    setInputValue(getInitialState(vehicleTypeForm))
  }, [vehicleTypeForm])

  const resetForm = (): void => {
    reset()
    setResetInputs(!resetInputs)
    setInputValue(getInitialState(null))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const vehicleTypesService = new VehicleTypesService()

    const submitFunction = formAction === 'add' ? vehicleTypesService.create : vehicleTypesService.update
    const onFinishSubmit = formAction === 'add' ? add : update

    const id = vehicleTypeForm ? vehicleTypeForm.id : ''

    void submitFunction(inputValue, id)
      .then(response => {
        resetForm()
        onFinishSubmit(response)
        setSelectedVehicleType(response)
        setVehicleTypeForm(null)
        toast(`Tipo de vehículo ${formAction === 'add' ? 'agregado' : 'actualizado'} correctamente`, { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  const setIsValidInput = (valid: boolean): void => {
    setCanSubmit(valid)
  }

  const setValueInputValue = (name: string, value: string | boolean): void => {
    setInputValue({
      ...inputValue,
      [name]: value
    })
  }

  return (
    <div className='mt-2'>
      <h2 className='uppercase font-bold'>{formAction === 'add' ? 'Añadir' : 'Editar'} Tipo de Vehículo</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <Input
            value={inputValue.name}
            name='name' placeholder='Nombre del tipo de vehículo' type='text'
            setValid={setIsValidInput}
            reset={resetInputs}
            setValue={(value) => { setValueInputValue('name', value) }}></Input>
        </div>

        <Input
          value={inputValue.isCart ? 'true' : 'false'}
          name='isCart' placeholder='¿Es carreta?' type='checkbox'
          reset={resetInputs}
          setValue={(value) => { setValueInputValue('isCart', value === 'true') }}></Input>

        <div className='mt-5 flex gap-2'>
          <Button color='primary' type='submit' disabled={!canSubmit}>{formAction === 'add' ? 'Añadir' : 'Editar'}</Button>
          <Button color='secondary' onClick={resetForm}>Cancelar</Button>
        </div>
      </form>
    </div>
  )
}

export default VehicleTypeForm

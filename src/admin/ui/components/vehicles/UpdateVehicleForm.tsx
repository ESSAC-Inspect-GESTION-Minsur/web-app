import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { type VehicleDto } from '@/routes/models/interface/vehicle-dto.interface'
import { type Vehicle } from '@/routes/models/vehicle.interface'
import { VehiclesService } from '@/routes/services/vehicle.service'
import Modal from '@/shared/ui/components/Modal'
import { toast } from 'react-toastify'
import Button from '@/shared/ui/components/Button'
import Input from '@/shared/ui/components/Input'
import { VehicleToastContext } from '../../pages/VehiclesView'

interface UpdateVehicleFormProps {
  vehicle: Vehicle | null
  closeModal: () => void
  onFinishSubmit: (vehicle: Vehicle) => void
}

const INITIAL_STATE: VehicleDto = {
  licensePlate: '',
  provider: '',
  company: '',
  imei: '',
  model: '',
  brand: '',
  lastMaintenance: new Date().toISOString(),
  soatExpiration: new Date().toISOString(),
  technicalReviewExpiration: new Date().toISOString()
}

const getInitialState = (vehicle: Vehicle | null): VehicleDto => {
  if (vehicle === null) return INITIAL_STATE
  const { createdAt, updatedAt, vehicleType, active, ...vehicleDto } = vehicle

  return vehicleDto
}

const UpdateVehicleForm = ({ vehicle, closeModal, onFinishSubmit }: UpdateVehicleFormProps): ReactElement => {
  const toastContext = useContext(VehicleToastContext)
  const vehiclesService = new VehiclesService()

  const [inputValue, setInputValue] = useState<VehicleDto>(getInitialState(vehicle))

  const [canSubmit, setCanSubmit] = useState<boolean>(false)
  const [validInputs, setValidInputs] = useState({
    licensePlate: true,
    provider: true,
    company: true,
    imei: true,
    model: true,
    brand: true,
    lastMaintenance: true,
    soatExpiration: true,
    technicalReviewExpiration: true
  })

  useEffect(() => {
    setInputValue(getInitialState(vehicle))
  }, [vehicle])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    void vehiclesService.update(inputValue.licensePlate, inputValue)
      .then((response) => {
        onFinishSubmit(response)
        toast('Vehículo actualizado correctamente', { toastId: toastContext.id, type: 'success' })
      })
      .catch((error) => {
        console.log(error)
        const { message } = error.data
        toast(message, { toastId: toastContext.id, type: 'error' })
      })
      .finally(() => {
        closeModal()
      })
  }

  useEffect(() => {
    setCanSubmit(Object.values(validInputs).every(v => v))
  }, [validInputs])

  const setIsValidInput = (name: string, valid: boolean): void => {
    setValidInputs({
      ...validInputs,
      [name]: valid
    })
  }

  const setValueInputValue = (name: string, value: string): void => {
    setInputValue({
      ...inputValue,
      [name]: value
    })
  }

  return (
    <Modal>
      <div className='w-full min-w-[300px] sm:min-w-[600px] p-3'>
        <h2 className='text-center font-bold uppercase text-xl'>Editar Vehículo</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Tipo de vehículo</label>
            <p>{vehicle?.vehicleType.name}</p>
          </div>
          <div>
            <label htmlFor='licensePlate'>Placa</label>
            <Input
              disabled={true}
              value={inputValue.licensePlate}
              name='license plate' placeholder='Placa' type='text'
              setValid={(valid) => { setIsValidInput('licensePlate', valid) }}
              setValue={(value) => { setValueInputValue('licensePlate', value) }}></Input>
            {/* <input disabled id='licensePlate' value={inputValue.licensePlate} type="text" name='licensePlate' /> */}
          </div>
          <div className='mt-2'>
          <label className='font-medium' htmlFor='provider'>Proveedor</label>
          <Input
            value={inputValue.provider}
            name='provider' placeholder='Proveedor' type='text'
            setValid={(valid) => { setIsValidInput('provider', valid) }}
            setValue={(value) => { setValueInputValue('provider', value) }}></Input>
          {/* <input onChange={handleChange} id='provider' value={inputValue.provider} type="text" name='provider' /> */}
        </div>
        <div className='mt-2'>
          <label className='font-medium' htmlFor='company'>Empresa</label>
          <Input
            value={inputValue.company}
            name='company' placeholder='Empresa' type='text'
            setValid={(valid) => { setIsValidInput('company', valid) }}
            setValue={(value) => { setValueInputValue('company', value) }}></Input>
          {/* <input onChange={handleChange} id='carrier' value={inputValue.carrier} type="text" name='carrier' /> */}
        </div>
        <div className='mt-2'>
          <label className='font-medium' htmlFor='imei'>Imei</label>
          <Input
            value={inputValue.imei}
            name='imei' placeholder='Imei' type='text'
            setValid={(valid) => { setIsValidInput('imei', valid) }}
            setValue={(value) => { setValueInputValue('imei', value) }}></Input>
          {/* <input onChange={handleChange} id='imei' value={inputValue.imei} type="text" name='imei' /> */}
        </div>
        <div className='mt-2'>
          <label className='font-medium' htmlFor='model'>Model</label>
          <Input
            value={inputValue.model}
            name='model' placeholder='Modelo' type='text'
            setValid={(valid) => { setIsValidInput('model', valid) }}
            setValue={(value) => { setValueInputValue('model', value) }}></Input>
          {/* <input onChange={handleChange} id='imei' value={inputValue.imei} type="text" name='imei' /> */}
        </div>
        <div className='mt-2'>
          <label className='font-medium' htmlFor='brand'>Marca</label>
          <Input
            value={inputValue.brand}
            name='brand' placeholder='Marca' type='text'
            setValid={(valid) => { setIsValidInput('brand', valid) }}
            setValue={(value) => { setValueInputValue('brand', value) }}></Input>
          {/* <input onChange={handleChange} id='imei' value={inputValue.imei} type="text" name='imei' /> */}
        </div>
        <div className='mt-2'>
          <label className='font-medium' htmlFor="soatExpiration">Fecha Vencimiento Soat</label>
          <Input
            value={new Date(inputValue.soatExpiration).toISOString().substring(0, 10)}
            name='soatExpiration' placeholder='' type='date'
            setValid={(valid) => { setIsValidInput('soatExpiration', valid) }}
            setValue={(value) => { setValueInputValue('soatExpiration', value) }}></Input>
        </div>
        <div className='mt-2'>
          <label className='font-medium' htmlFor="technicalReviewExpiration">Fecha Vencimiento Revisión Técnica</label>
          <Input
            value={new Date(inputValue.technicalReviewExpiration).toISOString().substring(0, 10)}
            name='technicalReviewExpiration' placeholder='' type='date'
            setValid={(valid) => { setIsValidInput('technicalReviewExpiration', valid) }}
            setValue={(value) => { setValueInputValue('technicalReviewExpiration', value) }}></Input>
        </div>
        <div className='mt-2'>
          <label className='font-medium' htmlFor="lastMaintenance">Último Mantenimiento</label>
          <Input
            value={new Date(inputValue.lastMaintenance).toISOString().substring(0, 10)}
            name='lastMaintenance' placeholder='' type='date'
            setValid={(valid) => { setIsValidInput('lastMaintenance', valid) }}
            setValue={(value) => { setValueInputValue('lastMaintenance', value) }}></Input>
        </div>
          <div className='flex justify-center gap-3 items-center'>
            <Button color='primary' type='submit' disabled={!canSubmit}>Guardar</Button>
            <Button color='secondary' onClick={closeModal}>Cerrar</Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default UpdateVehicleForm

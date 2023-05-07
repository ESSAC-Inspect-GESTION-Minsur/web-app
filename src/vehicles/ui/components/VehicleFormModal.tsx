import React, { useContext, type ReactElement, useEffect, useState } from 'react'
import Modal from '@/shared/ui/components/Modal'
import { VehicleContext } from '../contexts/VehicleContext'
import { useDataForm } from '@/shared/hooks/useDataForm'
import { VEHICLE_DTO_INITIAL_STATE, type VehicleDto } from '@/vehicles/models/vehicle.interface'
import { type FormAction } from '@/shared/types'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import { VehiclesService } from '@/vehicles/services/vehicles.service'
import { toast } from 'react-toastify'
import Input from '@/shared/ui/components/Input'
import Button from '@/shared/ui/components/Button'
import { type VehicleType } from '@/vehicles/models/vehicle-type.interface'
import { VehicleTypesService } from '@/vehicles/services/vehicle-types.service'
import SelectInput from '@/shared/ui/components/SelectInput'
import { useNavigate } from 'react-router-dom'
import Divider from '@/shared/ui/components/Divider'

interface VehicleFormModalProps {
  isCart: boolean
  isOpen: boolean
  onClose: () => void
}

const VehicleFormModal = ({ isOpen, isCart, onClose }: VehicleFormModalProps): ReactElement => {
  const navigate = useNavigate()
  const { toastId, vehicleForm, setVehicleForm, addVehicle, updateVehicle } = useContext(VehicleContext)

  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])

  const [vehicle, setVehicleValue, setVehicle, reset] = useDataForm<VehicleDto>(VEHICLE_DTO_INITIAL_STATE)
  const [formAction, setFormAction] = useState<FormAction>('add')

  const [isSubmitting, , setIsSubmitting] = useBooleanState()

  useEffect(() => {
    const vehicleTypesService = new VehicleTypesService()

    void vehicleTypesService.findAll()
      .then((vehicleTypes) => {
        const filteredVehicleTypes = vehicleTypes.filter(vehicleType => vehicleType.isCart === isCart)
        setVehicleTypes(filteredVehicleTypes)
      })
  }, [isCart])

  useEffect(() => {
    if (vehicleForm === null) {
      setFormAction('add')
      reset()
      return
    }

    const { licensePlate, brand, company, imei, lastMaintenance, model, provider, soatExpiration, technicalReviewExpiration } = vehicleForm
    setFormAction('update')

    setVehicle({
      licensePlate,
      vehicleTypeId: '',
      brand,
      company,
      imei,
      lastMaintenance,
      model,
      provider,
      soatExpiration,
      technicalReviewExpiration
    })
  }, [vehicleForm])

  useEffect(() => {
    if (vehicleTypes.length === 0) return

    setVehicleValue('vehicleTypeId', vehicleTypes[0].id)
  }, [vehicleTypes])

  const handleCancel = (): void => {
    setVehicleForm(null)
    reset()
    onClose()
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setIsSubmitting(true)
    const vehiclesService = new VehiclesService()

    const submitAction = formAction === 'add' ? vehiclesService.create : vehiclesService.update
    const onSuccess = formAction === 'add' ? addVehicle : updateVehicle
    const id = formAction === 'add' ? vehicle.vehicleTypeId : vehicle.licensePlate

    vehicle.provider = vehicle.provider === '' ? null : vehicle.provider
    vehicle.imei = vehicle.imei === '' ? null : vehicle.imei

    void submitAction(vehicle, id)
      .then((vehicle) => {
        setVehicleForm(null)
        reset()
        onSuccess(vehicle)
        onClose()

        toast(`Vehículo ${formAction === 'add' ? 'añadido' : 'guardado'} correctamente`, { toastId, type: 'success' })
      })
      .catch(error => {
        console.log(error)
        const { message } = error.data
        toast(message, { toastId, type: 'success' })
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} onTop={true} className='w-full min-w-[300px] sm:min-w-[600px]'>
      {
        vehicleTypes.length === 0
          ? (
            <div className='flex flex-col gap-3 items-center'>
              <p className='text-center'>No hay tipo de vehículos registrados, por favor ingresa algunos registros</p>
              <Button color='primary' onClick={() => { navigate('/admin/tipo-vehiculos') }}>Ir a tipo de vehículos</Button>
            </div>
            )
          : (
            <div className='p-3'>
              <h2 className='uppercase text-lg font-semibold text-center mb-2'>Agregar un {!isCart ? 'vehiculo' : 'semirremolque'}</h2>
              <Divider className='mt-0'></Divider>
              <form onSubmit={handleSubmit}>

                <SelectInput<VehicleType>
                  label='Tipo de vehículos'
                  name='vehicleTypeId'
                  objects={vehicleTypes}
                  setValue={setVehicleValue}
                  value={vehicle.vehicleTypeId}
                  optionKey='name'
                  valueKey='id'
                  disabled={formAction === 'update'}
                />

                <Input
                  label='Placa'
                  value={vehicle.licensePlate}
                  name='licensePlate' placeholder='Placa' type='text'
                  disabled={formAction === 'update'}
                  setValue={setVehicleValue}></Input>

                { vehicle.provider !== null && <Input
                  label='Proveedor'
                  value={vehicle.provider}
                  name='provider' placeholder='Proveedor' type='text'
                  required={false}
                  setValue={setVehicleValue}></Input>}

                <Input
                  label='Empresa'
                  value={vehicle.company}
                  name='company' placeholder='Empresa' type='text'
                  setValue={setVehicleValue}></Input>

                { vehicle.imei !== null && <Input
                  label='Imei'
                  value={vehicle.imei}
                  name='imei' placeholder='Imei' type='text'
                  required={false}
                  setValue={setVehicleValue}></Input>}

                { vehicle.model !== null && <Input
                  label='Modelo'
                  value={vehicle.model}
                  name='model' placeholder='Modelo' type='text'
                  setValue={setVehicleValue}></Input>}

                { vehicle.brand !== null && <Input
                  label='Marca'
                  value={vehicle.brand}
                  name='brand' placeholder='Marca' type='text'
                  setValue={setVehicleValue}></Input>}

                { vehicle.soatExpiration !== null && <Input
                  label='Fecha Vencimiento Soat'
                  value={new Date(vehicle.soatExpiration).toISOString().substring(0, 10)}
                  required={false}
                  name='soatExpiration' placeholder='' type='date'
                  setValue={setVehicleValue}></Input>}

                { vehicle.technicalReviewExpiration !== null && <Input
                  label='Fecha Vencimiento Revisión Técnica'
                  value={new Date(vehicle.technicalReviewExpiration).toISOString().substring(0, 10)}
                  required={false}
                  name='technicalReviewExpiration' placeholder='' type='date'
                  setValue={setVehicleValue}></Input>}

                { vehicle.lastMaintenance !== null && <Input
                  label='Último Mantenimiento'
                  value={new Date(vehicle.lastMaintenance).toISOString().substring(0, 10)}
                  required={false}
                  name='lastMaintenance' placeholder='' type='date'
                  setValue={setVehicleValue}></Input>}

                <div className='mt-4 flex justify-center gap-3 items-center'>
                  <Button color='primary' type='submit' isLoading={isSubmitting}>{formAction === 'add' ? 'Añadir' : 'Guardar'}</Button>
                  <Button color='secondary' onClick={handleCancel}>Cerrar</Button>
                </div>
              </form>
            </div>
            )
      }

    </Modal>
  )
}

export default VehicleFormModal

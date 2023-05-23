import React, { useContext, type ReactElement, useState, useEffect } from 'react'
import { VEHICLE_INITIAL_STATE, type Vehicle } from '@/vehicles/models/vehicle.interface'
import Modal from '@/shared/ui/components/Modal'
import Button from '@/shared/ui/components/Button'
import Divider from '@/shared/ui/components/Divider'
import { VehicleContext } from '../contexts/VehicleContext'

interface UpdateVehicleFormProps {
  isOpen: boolean
  onClose: () => void
}

const VehicleDetailModal = ({ isOpen, onClose }: UpdateVehicleFormProps): ReactElement => {
  const { selectedVehicle } = useContext(VehicleContext)

  const [vehicle, setVehicle] = useState<Vehicle>(VEHICLE_INITIAL_STATE)

  useEffect(() => {
    if (!isOpen) {
      setVehicle(VEHICLE_INITIAL_STATE)
    }
    if (selectedVehicle === null) return

    setVehicle(selectedVehicle)
  }, [selectedVehicle, isOpen])

  const handleClose = (): void => {
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className='w-full min-w-[300px] sm:min-w-[600px]' onTop={true}>
      <div className='p-3'>
        <h2 className='text-center font-bold uppercase text-xl'>Vehículo <span className='text-red'>{vehicle.licensePlate}</span></h2>
        <Divider className='mt-1 mb-6'></Divider>

        <div className='flex gap-3'>
          <p className='font-semibold'>Tipo de vehículo:</p>
          <p>{vehicle.vehicleType.name}</p>
        </div>

        <div className='flex gap-3'>
          <p className='font-semibold'>¿Semirremolque o vehículo?:</p>
          <p>{vehicle.vehicleType.isCart ? 'Semirremolque' : 'Vehículo'}</p>
        </div>

        <Divider className='my-[6px]'></Divider>

        {vehicle.model && (
          <div className='flex gap-3'>
            <p className='font-semibold'>Modelo:</p>
            <p>{vehicle.model}</p>
          </div>
        )}

        {vehicle.brand && (
          <div className='flex gap-3'>
            <p className='font-semibold'>Marca:</p>
            <p>{vehicle.brand}</p>
          </div>
        )}

        {vehicle.soatExpiration && (
          <div className='flex gap-3'>
            <p className='font-semibold'>Fecha de vencimiento soat:</p>
            <p>{new Date(vehicle.soatExpiration).toISOString().substring(0, 10)}</p>
          </div>
        )}

        {vehicle.technicalReviewExpiration && (
          <div className='flex gap-3'>
            <p className='font-semibold'>Fecha Vencimiento Revisión Técnica:</p>
            <p>{new Date(vehicle.technicalReviewExpiration).toISOString().substring(0, 10)}</p>
          </div>
        )}

        <Divider className='my-[6px]'></Divider>

        <h3 className='font-bold uppercase'>Empresas</h3>
        <div>
          {
            vehicle.companies.length > 0
              ? vehicle.companies.map((company, index) => (
                <div key={company.id} className='flex gap-2'>
                  <p className='font-semibold'>Empresa {index + 1}: </p>
                  <p>{company.name}</p>
                </div>))
              : <p>No tiene empresas asignadas</p>
          }
        </div>

        <Divider className='my-[6px]'></Divider>

        <h3 className='font-bold uppercase'>Sponsors</h3>
        <div>
          {
            vehicle.sponsors.length > 0
              ? vehicle.sponsors.map((sponsor, index) => (
                <div key={sponsor.id} className='flex gap-2'>
                  <p className='font-semibold'>Sponsor {index + 1}: </p>
                  <p>{sponsor.name}</p>
                </div>))
              : <p>No tiene empresas contratantes asignadas</p>
          }
        </div>

        <Button color='secondary' onClick={handleClose} className='mt-5'>Cerrar</Button>
      </div>
    </Modal>
  )
}

export default VehicleDetailModal

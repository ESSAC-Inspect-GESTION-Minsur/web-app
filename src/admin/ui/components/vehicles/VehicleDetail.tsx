import React, { type ReactElement } from 'react'
import { type Vehicle } from '@/routes/models/vehicle.interface'
import Modal from '@/shared/ui/components/Modal'
import Button from '@/shared/ui/components/Button'
import Divider from '@/shared/ui/components/Divider'
import { useSelector } from 'react-redux'
import { getCurrentUser } from '@/shared/config/store/features/auth-slice'

interface UpdateVehicleFormProps {
  vehicle: Vehicle
  closeModal: () => void
}

const VehicleDetail = ({ vehicle, closeModal }: UpdateVehicleFormProps): ReactElement => {
  const currentUser = useSelector(getCurrentUser)

  return (
    <Modal>
      <div className='w-full min-w-[300px] sm:min-w-[600px] p-3'>
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

        {vehicle.provider && (
          <div className='flex gap-3'>
            <p className='font-semibold'>Proveedor:</p>
            <p>{vehicle.provider}</p>
          </div>
        )}

        {vehicle.company && currentUser.company === 'MARCOBRE' && (
          <div className='flex gap-3'>
            <p className='font-semibold'>Empresa:</p>
            <p>{vehicle.company}</p>
          </div>
        )}

        {vehicle.imei && (
          <div className='flex gap-3'>
            <p className='font-semibold'>Imei:</p>
            <p>{vehicle.imei}</p>
          </div>
        )}

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

        {vehicle.lastMaintenance && (
          <div className='flex gap-3'>
            <p className='font-semibold'>Fecha Último Mantenimiento:</p>
            <p>{new Date(vehicle.lastMaintenance).toISOString().substring(0, 10)}</p>
          </div>
        )}

        <Divider className='my-[6px]'></Divider>
        {currentUser.company !== 'MARCOBRE' && (
          <div>
            <h3 className='font-bold text-xl'>Empresas</h3>
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
          </div>
        )}

        <Button color='secondary' onClick={closeModal} className='mt-5'>Cerrar</Button>
      </div>
    </Modal>
  )
}

export default VehicleDetail

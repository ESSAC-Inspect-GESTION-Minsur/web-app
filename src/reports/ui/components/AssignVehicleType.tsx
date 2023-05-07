import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

import Modal from '@/shared/ui/components/Modal'
import Button from '@/shared/ui/components/Button'
import { type VehicleType } from '@/vehicles/models/vehicle-type.interface'
import { ReportTypeContext } from '../contexts/ReportTypeContext'
import { VehicleTypesService } from '@/vehicles/services/vehicle-types.service'
import { ReportTypesService } from '@/reports/services/report-types.service'
import Divider from '@/shared/ui/components/Divider'

interface AssignVehicleTypeProps {
  isOpen: boolean
  reportTypeVehicleTypes: VehicleType[]
  update: (vehicleTypes: VehicleType[]) => void
  onClose: () => void
}

const AssignVehicleType = ({ isOpen, reportTypeVehicleTypes, update, onClose }: AssignVehicleTypeProps): ReactElement => {
  const { toastId, selectedReportType } = useContext(ReportTypeContext)
  const navigate = useNavigate()

  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const vehicleTypesService = new VehicleTypesService()
    void vehicleTypesService.findAll()
      .then(response => {
        const actualVehicleTypeIds = reportTypeVehicleTypes.map(vehicleType => vehicleType.id)
        setVehicleTypes(response.filter(vehicleType => !actualVehicleTypeIds.includes(vehicleType.id) && !vehicleType.isCart))
      })
  }, [reportTypeVehicleTypes, isOpen])

  useEffect(() => {
    if (vehicleTypes.length > 0) setSelectedVehicleType(vehicleTypes[0])
  }, [vehicleTypes])

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.target
    const vehicleType = vehicleTypes.find(vehicleType => vehicleType.id === value)
    setSelectedVehicleType(vehicleType ?? null)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const reportTypesService = new ReportTypesService()

    const reportTypeId = selectedReportType?.id ?? ''
    const vehicleTypeId = selectedVehicleType?.id ?? ''

    void reportTypesService.assignVehicleType(reportTypeId, vehicleTypeId)
      .then(response => {
        update(response.vehicleTypes)
        onClose()
        toast('Tipo de vehículo asignado correctamente', { toastId, type: 'success' })
      })
      .catch(error => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className='min-w-[300px] sm:min-w-[600px]'>
      <div className='p-6'>
        <h2 className='uppercase font-bold text-center text-lg'>Asignar tipo de vehículo al checklist {selectedReportType?.name}</h2>
        <Divider></Divider>
        {
          vehicleTypes.length > 0
            ? (
              <form onSubmit={handleSubmit}>
                <label className='font-medium'>Tipo de vehículos</label>
                <select
                  className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none capitalize'
                  onChange={handleSelectChange} value={selectedVehicleType?.id ?? ''}>
                  {vehicleTypes.map(vehicleType => (
                    <option key={vehicleType.id} value={vehicleType.id}>{vehicleType.name}</option>
                  ))}
                </select>
                <div className='flex gap-2 mt-4'>
                  <Button color='primary' type='submit'>Asignar</Button>
                  <Button color='secondary' onClick={onClose}>Cancelar</Button>
                </div>
              </form>
              )
            : (
              <div className='flex flex-col items-center'>
                <p className='text-center mb-3 text-lg'>Todos los tipos de vehículo están asignados, crea algún tipo de vehículo si deseas asignar más</p>
                <Button color='primary' onClick={() => { navigate('/admin/tipo-vehiculos') }}>Añadir tipo de vehículos</Button>
              </div>
              )
        }
      </div>

    </Modal >
  )
}

export default AssignVehicleType

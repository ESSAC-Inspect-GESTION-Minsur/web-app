import React, { useState, type ReactElement, useEffect } from 'react'
import { useArrayReducer } from '@/shared/hooks/useArrayReducer'
import { type Vehicle } from '@/vehicles/models/vehicle.interface'
import Divider from '@/shared/ui/components/Divider'
import Toast from '@/shared/ui/components/Toast'
import { VehiclesService } from '@/vehicles/services/vehicles.service'
import { VehicleContext } from '../contexts/VehicleContext'
import VehiclesTable from '../components/VehiclesTable'
import Button from '@/shared/ui/components/Button'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import VehicleFormModal from '../components/VehicleFormModal'
import ImportModal from '@/admin/ui/components/ImportModal'
import VehicleDetailModal from '../components/VehicleDetailModal'
import AssignCompany from '../components/AssignCompany'

interface VehicleViewProps {
  areCarts: boolean
}

const TOAST_ID = 'vehicles-view'

const VehiclesView = ({ areCarts }: VehicleViewProps): ReactElement => {
  const [vehicles, setVehicles, addVehicle, updateVehicle, removeVehicle] = useArrayReducer<Vehicle>([])

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [vehicleForm, setVehicleForm] = useState<Vehicle | null>(null)

  const [showForm, toggleShowForm] = useBooleanState()
  const [showImportModal, toggleShowImportModal] = useBooleanState()
  const [showDetailModal, toggleShowDetailModal] = useBooleanState()
  const [isImportAssignCompanyModalShown, toggleShowImportAssignCompanyModal] = useBooleanState()
  const [showAssignCompanyModal, toggleShowAssignCompanyModal] = useBooleanState()

  const [importType, setImportType] = useState<'vehicle' | 'cart'>('vehicle')

  useEffect(() => {
    const vehiclesService = new VehiclesService()
    void vehiclesService.findAll()
      .then((vehicles) => {
        const vehiclesFiltered = vehicles.filter((vehicle) => vehicle.vehicleType.isCart === areCarts)
        setVehicles(vehiclesFiltered)
      })
  }, [areCarts])

  useEffect(() => {
    setImportType(areCarts ? 'cart' : 'vehicle')
  }, [areCarts])

  const onImportSuccess = (newVehicles: Vehicle[]): void => {
    setVehicles([...vehicles, ...newVehicles])
  }

  const refreshImportedVehiclesWithCompany = (newVehicles: Vehicle[]): void => {
    setVehicles(vehicles.map(vehicle => {
      const newVehicle = newVehicles.find(newVehicle => newVehicle.id === vehicle.id)
      return newVehicle ?? vehicle
    }))
  }

  return (
    <VehicleContext.Provider value={{
      vehicles,
      addVehicle,
      updateVehicle,
      removeVehicle,
      selectedVehicle,
      setSelectedVehicle,
      vehicleForm,
      setVehicleForm,
      toastId: TOAST_ID
    }}>
      <section className='flex justify-between items-center'>
        <h1 className='text-blue-era uppercase text-2xl font-semibold'>{ !areCarts ? 'Vehículos' : 'Semirremolques' }</h1>
        <div className='flex gap-2'>
          <Button color='secondary' onClick={toggleShowImportModal}>Importar Excel</Button>
          { !areCarts && <Button color='secondary' onClick={toggleShowImportAssignCompanyModal}>Assignar Empresas Excel</Button>}
          <Button color='primary' onClick={toggleShowForm}>Agregar { !areCarts ? 'Vehículo' : 'Semirremolque' }</Button>
        </div>
      </section>
      <Divider></Divider>

      <VehiclesTable toggleShowForm={toggleShowForm} areCarts={areCarts} toggleShowDetail={toggleShowDetailModal} toggleAssignCompany={toggleShowAssignCompanyModal}/>

      <VehicleFormModal isOpen={showForm} onClose={toggleShowForm} isCart={areCarts}/>
      <ImportModal isOpen={showImportModal} onClose={toggleShowImportModal} onSuccess={onImportSuccess} toastId={TOAST_ID} type={importType}/>
      <VehicleDetailModal isOpen={showDetailModal} onClose={toggleShowDetailModal}/>
      <AssignCompany isOpen={showAssignCompanyModal} onClose={toggleShowAssignCompanyModal}/>
      { !areCarts && <ImportModal isOpen={isImportAssignCompanyModalShown} onClose={toggleShowImportAssignCompanyModal} onSuccess={refreshImportedVehiclesWithCompany} toastId={TOAST_ID} type='assign-vehicle-company' />}

      <Toast id={TOAST_ID} />

    </VehicleContext.Provider>
  )
}

export default VehiclesView

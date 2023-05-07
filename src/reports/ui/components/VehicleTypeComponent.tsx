import React, { type ReactElement, useContext, useEffect } from 'react'
import Button from '@/shared/ui/components/Button'
import { useArrayReducer } from '@/shared/hooks/useArrayReducer'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import { type VehicleType } from '@/vehicles/models/vehicle-type.interface'
import { ReportTypesService } from '@/reports/services/report-types.service'
import { ReportTypeContext } from '../contexts/ReportTypeContext'
import VehicleTypesDetail from './VehicleTypesDetail'
import AssignVehicleType from './AssignVehicleType'

const VehicleTypeComponent = (): ReactElement => {
  const { selectedReportType: reportType } = useContext(ReportTypeContext)

  const [vehicleTypes, setVehicleTypes] = useArrayReducer<VehicleType>([])
  const [showAssignVehicleTypeModal, toggleShowAssignVehicleTypeModal] = useBooleanState()

  useEffect(() => {
    if (reportType === null) return

    const reportTypesService = new ReportTypesService()
    void reportTypesService.findAllVehicleTypes(reportType.id)
      .then(setVehicleTypes)
  }, [reportType])

  const update = (vehicleTypes: VehicleType[]): void => {
    setVehicleTypes(vehicleTypes)
  }

  return (
    <section>
      <div className='flex justify-between items-center mb-3'>
        <h2 className='uppercase font-bold text-lg'>Tipos de vehículos asignados al <span className='text-red'>checklist {reportType?.name}</span></h2>
        <Button color='primary' className='mb-2' onClick={toggleShowAssignVehicleTypeModal}>Asignar Tipo de vehículo</Button>
      </div>
      <VehicleTypesDetail vehicleTypes={vehicleTypes} update={update}/>
      <AssignVehicleType isOpen={showAssignVehicleTypeModal} onClose={toggleShowAssignVehicleTypeModal} reportTypeVehicleTypes={vehicleTypes} update={update} />
    </section>

  )
}

export default VehicleTypeComponent

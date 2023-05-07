import React, { Fragment, useContext, type ReactElement } from 'react'
import { toast } from 'react-toastify'
import { type VehicleType } from '@/vehicles/models/vehicle-type.interface'
import { ReportTypeContext } from '../contexts/ReportTypeContext'
import { ReportTypesService } from '@/reports/services/report-types.service'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'

interface VehicleTypesDetailProps {
  vehicleTypes: VehicleType[]
  update: (vehicleTypes: VehicleType[]) => void
}

const VehicleTypesDetail = ({ vehicleTypes, update }: VehicleTypesDetailProps): ReactElement => {
  const { toastId, selectedReportType } = useContext(ReportTypeContext)

  const handleRemove = (vehicleTypeDeleted: VehicleType): void => {
    const result = confirm(`Estás seguro que quieres desasingar el tipo de vehículo ${vehicleTypeDeleted.name}`)
    if (!result) return

    const reportTypesService = new ReportTypesService()
    const id = selectedReportType?.id ?? ''

    void reportTypesService.removeVehicleType(id, vehicleTypeDeleted.id)
      .then((response) => {
        update(response.vehicleTypes)
        toast('Tipo de vehículo desasignado correctamente', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  return (
    <Fragment>
      {
        vehicleTypes.length > 0
          ? (
            <div className='flex gap-4 flex-wrap'>
              {
                vehicleTypes.map(vehicleType => (
                  <div key={vehicleType.id} className='max-w-[220px] p-7 bg-black text-white rounded-lg flex flex-col justify-between gap-2'>
                    <div className='flex gap-3'>
                      <p className='uppercase'>{vehicleType.name}</p>
                      <DeleteIcon className='w-6 h-6 cursor-pointer text-red' onClick={() => { handleRemove(vehicleType) }} />
                    </div>
                  </div>
                ))
              }
            </div>
            )
          : (
            <p>{selectedReportType !== null ? 'El tipo de checklist no tiene ningún tipo de vehículo asignado' : 'Seleccionar tipo de checklist'}</p>
            )
      }
    </Fragment>
  )
}

export default VehicleTypesDetail

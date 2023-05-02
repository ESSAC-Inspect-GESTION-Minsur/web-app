import { type ReportType } from '@/reports/models/report-type.interface'
import { ReportTypesService } from '@/reports/services/report-type.service'
import { type VehicleType } from '@/routes/models/vehicle-type.interface'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import Button from '@/shared/ui/components/Button'
import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { ReportToastContext } from '../../pages/ReportsView'
import AssingVehicleType from './AssignVehicleType'

interface VehicleTypeListProps {
  reportType: ReportType
}

const VehicleTypeList = ({ reportType }: VehicleTypeListProps): ReactElement => {
  const reportToastContext = useContext(ReportToastContext)
  const reportTypesService = new ReportTypesService()
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
  const [showAssignVehicleTypeModal, setShowAssignVehicleTypeModal] = useState<boolean>(false)

  useEffect(() => {
    if (reportType.id !== '') {
      void reportTypesService.findAllVehicleTypes(reportType.id)
        .then(setVehicleTypes)
    }
  }, [reportType])

  const update = (vehicleTypes: VehicleType[]): void => {
    setVehicleTypes(vehicleTypes)
  }

  const remove = (vehicleTypeDeleted: VehicleType): void => {
    const result = confirm(`Estás seguro que quieres desasingar el tipo de vehiculo ${vehicleTypeDeleted.name}`)
    if (!result) return

    void reportTypesService.removeVehicleType(reportType.id, vehicleTypeDeleted.id)
      .then((response) => {
        setVehicleTypes(response.vehicleTypes)
        toast('Tipo de vehículo desasignado correctamente', { toastId: reportToastContext.id, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId: reportToastContext.id, type: 'error' })
      })
  }

  return (
    <section>
      {reportType.id !== '' &&
        (
          <div className='flex justify-between items-center mb-3'>
            <h2 className='uppercase font-bold text-lg'>Tipos de vehiculos asignados al <span className='text-red'>checklist {reportType.name}</span></h2>
            <Button color='primary' className='mb-2' onClick={() => { setShowAssignVehicleTypeModal(true) }}>Asignar Tipo de vehiculo</Button>
          </div>
        )
      }
      {
        vehicleTypes.length > 0
          ? (
            <div className='flex gap-4 flex-wrap'>
              {
                vehicleTypes.map(vehicleType => (
                  <div key={vehicleType.id} className='max-w-[220px] p-7 bg-black text-white rounded-lg flex flex-col justify-between gap-2'>
                    <div className='flex gap-3'>
                      <p className='uppercase'>{vehicleType.name}</p>
                      <DeleteIcon className='w-6 h-6 cursor-pointer text-red' onClick={() => { remove(vehicleType) }} />
                    </div>
                  </div>
                ))
              }
            </div>
            )
          : (
            <p>{reportType.id !== '' ? 'El tipo de checklist no tiene ningún tipo de vehículo asignado' : 'Seleccionar tipo de checklist'}</p>
            )
      }
      { showAssignVehicleTypeModal && <AssingVehicleType reportType={reportType} reportTypeVehicleTypes={vehicleTypes} close={ () => { setShowAssignVehicleTypeModal(false) } } update={update}/>}
    </section>

  )
}

export default VehicleTypeList

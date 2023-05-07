import React, { useContext, type ReactElement, useMemo } from 'react'
import { toast } from 'react-toastify'
import Table, { type Action, type Column } from '@/shared/ui/components/table/Table'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import EyeIcon from '@/shared/ui/assets/icons/EyeIcon'
import { VehiclesService } from '@/vehicles/services/vehicles.service'
import { type Vehicle } from '@/vehicles/models/vehicle.interface'
import { VehicleContext } from '../contexts/VehicleContext'
import { isDate } from '@/shared/utils'
import AdminIcon from '@/shared/ui/assets/icons/AdminIcon'

interface VehiclesTableProps {
  toggleShowForm: () => void
  toggleShowDetail: () => void
  toggleAssignCompany: () => void
  areCarts: boolean
}

const VehiclesTable = ({ areCarts, toggleShowForm, toggleShowDetail, toggleAssignCompany }: VehiclesTableProps): ReactElement => {
  const { toastId, vehicles, setVehicleForm, removeVehicle, setSelectedVehicle } = useContext(VehicleContext)

  const handleRemove = (vehicle: Vehicle): void => {
    const vehiclesService = new VehiclesService()
    const result = confirm(`Estás seguro que quieres eliminar el vehículo: ${vehicle.licensePlate}`)
    if (!result) return

    const id = vehicle.id
    void vehiclesService.remove(vehicle.licensePlate)
      .then(() => {
        removeVehicle(id)
        setSelectedVehicle(null)
        setVehicleForm(null)
        toast('Tipo de vehículo eliminado correctamente', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  const handleUpdate = (vehicle: Vehicle): void => {
    setVehicleForm(vehicle)
    toggleShowForm()
  }

  const handleView = (vehicle: Vehicle): void => {
    setSelectedVehicle(vehicle)
    toggleShowDetail()
  }

  const assignCompany = (vehicle: Vehicle): void => {
    setSelectedVehicle(vehicle)
    toggleAssignCompany()
  }

  const VEHICLE_COLUMNS: Array<Column<Vehicle>> = [
    {
      id: 'licensePlate',
      columnName: 'Placa',
      filterFunc: (vehicle) => vehicle.licensePlate,
      sortFunc: (a, b) => a.licensePlate > b.licensePlate ? 1 : -1,
      render: (vehicle) => vehicle.licensePlate
    },
    {
      id: 'provider',
      columnName: 'Proveedor',
      filterFunc: (vehicle) => vehicle.provider ?? 'No registrado',
      sortFunc: (a, b) => {
        const providerA = a.provider ?? 'no registrado'
        const providerB = b.provider ?? 'no registrado'
        return providerA > providerB ? 1 : -1
      },
      render: (vehicle) => vehicle.provider ?? 'No registrado'
    },
    {
      id: 'company',
      columnName: 'Empresa',
      filterFunc: (vehicle) => vehicle.company,
      sortFunc: (a, b) => a.company > b.company ? 1 : -1,
      render: (vehicle) => vehicle.company
    },
    {
      id: 'imei',
      columnName: 'Imei',
      filterFunc: (vehicle) => vehicle.imei ?? 'No registrado',
      sortFunc: (a, b) => {
        const imeiA = a.imei ?? 'No registrado'
        const imeiB = b.imei ?? 'No registrado'
        return imeiA > imeiB ? 1 : -1
      },
      render: (vehicle) => vehicle.imei ?? 'No registrado'
    },
    {
      id: 'lastMaintenance',
      columnName: 'Último Mantenimiento',
      filterFunc: (vehicle) => {
        if (!vehicle.lastMaintenance) {
          return 'No registrado'
        }
        return isDate(vehicle.lastMaintenance) ? new Date(vehicle.lastMaintenance).toDateString() : 'No registrado'
      },
      sortFunc: (a, b) => {
        const aLastMaintenance = a.lastMaintenance ?? 'No registrado'
        const bLastMaintenance = b.lastMaintenance ?? 'No registrado'

        if (isNaN(Date.parse(aLastMaintenance)) && isNaN(Date.parse(bLastMaintenance))) {
          return aLastMaintenance > bLastMaintenance ? 1 : -1
        }

        return new Date(aLastMaintenance).getTime() - new Date(bLastMaintenance).getTime()
      },
      render: (vehicle) => {
        if (vehicle.lastMaintenance === null || !isDate(vehicle.lastMaintenance)) {
          return 'No registrado'
        }

        return new Date(vehicle.lastMaintenance).toDateString()
      }
    },
    {
      id: 'soatExpiration',
      columnName: 'F. Venc. Soat',
      filterFunc: (vehicle) => {
        if (!vehicle.soatExpiration) {
          return 'No registrado'
        }
        return isDate(vehicle.soatExpiration) ? new Date(vehicle.soatExpiration).toDateString() : 'No registrado'
      },
      sortFunc: (a, b) => {
        const aSoatExpiration = a.soatExpiration ?? 'No registrado'
        const bSoatExpiration = b.soatExpiration ?? 'No registrado'

        if (isNaN(Date.parse(aSoatExpiration)) && isNaN(Date.parse(bSoatExpiration))) {
          return aSoatExpiration > bSoatExpiration ? 1 : -1
        }

        return new Date(aSoatExpiration).getTime() - new Date(bSoatExpiration).getTime()
      },
      render: (vehicle) => {
        if (vehicle.soatExpiration === null || !isDate(vehicle.soatExpiration)) {
          return 'No registrado'
        }

        return new Date(vehicle.soatExpiration).toDateString()
      }
    },
    {
      id: 'technicalReviewExpiration',
      columnName: 'F. Venc. Revisión Técnica',
      filterFunc: (vehicle) => {
        if (!vehicle.technicalReviewExpiration) {
          return 'No registrado'
        }
        return isDate(vehicle.technicalReviewExpiration) ? new Date(vehicle.technicalReviewExpiration).toDateString() : 'No registrado'
      },
      sortFunc: (a, b) => {
        const aTechnicalReviewExpiration = a.technicalReviewExpiration ?? 'No registrado'
        const bTechnicalReviewExpiration = b.technicalReviewExpiration ?? 'No registrado'

        if (isNaN(Date.parse(aTechnicalReviewExpiration)) && isNaN(Date.parse(bTechnicalReviewExpiration))) {
          return aTechnicalReviewExpiration > bTechnicalReviewExpiration ? 1 : -1
        }

        return new Date(aTechnicalReviewExpiration).getTime() - new Date(bTechnicalReviewExpiration).getTime()
      },
      render: (vehicle) => {
        if (vehicle.technicalReviewExpiration === null || !isDate(vehicle.technicalReviewExpiration)) {
          return 'No registrado'
        }

        return new Date(vehicle.technicalReviewExpiration).toDateString()
      }
    },
    {
      id: 'vehicleType',
      columnName: 'Tipo de vehículo',
      filterFunc: (vehicle) => vehicle.vehicleType.name,
      sortFunc: (a, b) => a.vehicleType.name > b.vehicleType.name ? 1 : -1,
      render: (vehicle) => vehicle.vehicleType.name.toUpperCase()
    },
    {
      id: 'brand',
      columnName: 'Marca',
      filterFunc: (vehicle) => vehicle.brand ?? 'No registrado',
      sortFunc: (a, b) => {
        const brandA = a.brand ?? 'No registrado'
        const brandB = b.brand ?? 'No registrado'
        return brandA > brandB ? 1 : -1
      },
      render: (vehicle) => vehicle.brand ?? 'No registrado'
    },
    {
      id: 'model',
      columnName: 'Modelo',
      filterFunc: (vehicle) => vehicle.model ?? 'No registrado',
      sortFunc: (a, b) => {
        const modelA = a.model ?? 'No registrado'
        const modelB = b.model ?? 'No registrado'
        return modelA > modelB ? 1 : -1
      },
      render: (vehicle) => vehicle.model ?? 'No registrado'
    }
  ]

  const PAGINATION = [5, 10, 20]

  const VEHICLE_ACTIONS: Array<Action<Vehicle>> = useMemo(() => {
    const actions = [
      {
        icon: () => (<EditIcon className='cursor-pointer w-5 h-5' />),
        actionFunc: handleUpdate
      },
      {
        icon: () => (<DeleteIcon className='cursor-pointer w-5 h-5 text-red' />),
        actionFunc: handleRemove
      },
      {
        icon: () => (<EyeIcon className='cursor-pointer w-5 h-5 ' />),
        actionFunc: handleView
      }
    ]

    if (!areCarts) {
      actions.push(
        {
          icon: () => (<AdminIcon className='cursor-pointer w-5 h-5 ' />),
          actionFunc: assignCompany
        })
    }

    return actions
  }, [areCarts])

  return (
    <main>
      {
        vehicles.length > 0
          ? (
            <Table
              data={vehicles}
              columns={VEHICLE_COLUMNS}
              pagination={PAGINATION}
              actions={VEHICLE_ACTIONS}
            />
            )
          : <p>No hay {areCarts ? 'carretas' : 'vehículos'} registrados</p>
      }

    </main>
  )
}

export default VehiclesTable

import React, { useContext, type ReactElement, useMemo } from 'react'
import { toast } from 'react-toastify'
import Table, { type Action, type Column } from '@/shared/ui/components/table/Table'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import AdminIcon from '@/shared/ui/assets/icons/AdminIcon'
import { VehiclesService } from '@/vehicles/services/vehicles.service'
import { type Vehicle } from '@/vehicles/models/vehicle.interface'
import { VehicleContext } from '../contexts/VehicleContext'
// import EyeIcon from '@/shared/ui/assets/icons/EyeIcon'

interface VehiclesTableProps {
  toggleShowForm: () => void
  toggleShowDetail: () => void
  toggleAssignCompany: () => void
  toggleAssignContractor: () => void
  areCarts: boolean
}

const VehiclesTable = ({ areCarts, toggleShowForm, toggleShowDetail, toggleAssignCompany, toggleAssignContractor }: VehiclesTableProps): ReactElement => {
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

  // const handleView = (vehicle: Vehicle): void => {
  //   setSelectedVehicle(vehicle)
  //   toggleShowDetail()
  // }

  const assignCompany = (vehicle: Vehicle): void => {
    setSelectedVehicle(vehicle)
    toggleAssignCompany()
  }

  const assignContractor = (vehicle: Vehicle): void => {
    setSelectedVehicle(vehicle)
    toggleAssignContractor()
  }

  const VEHICLE_COLUMNS: Array<Column<Vehicle>> = useMemo(() => {
    const columns: Array<Column<Vehicle>> = [
      {
        id: 'licensePlate',
        columnName: 'Placa',
        filterFunc: (vehicle) => vehicle.licensePlate,
        sortFunc: (a, b) => a.licensePlate > b.licensePlate ? 1 : -1,
        render: (vehicle) => vehicle.licensePlate
      },
      {
        id: 'companies',
        columnName: 'Empresas de transporte',
        filterFunc: (vehicle) => vehicle.companies.map(company => company.name).join(' '),
        render: (vehicle) => {
          const companies = vehicle.companies

          if (companies.length <= 0) {
            return 'No hay empresas asignadas'
          }

          const filteredArray = companies.filter(
            (obj, index, self) => index === self.findIndex((o) => o.id === obj.id)
          )

          return (
            <select className='block w-full h-10 px-2 rounded-t-md border-b border-solid border-blue-dark outline-none capitalize'>
              {
                ...filteredArray.map((company) => (
                  <option key={company.id}>{company.name}</option>
                ))
              }
            </select>
          )
        }
      }
    ]

    const sponsorColumn: Array<Column<Vehicle>> = [
      {
        id: 'sponsors',
        columnName: 'Sponsors',
        filterFunc: (vehicle) => vehicle.sponsors.map(company => company.name).join(' '),
        render: (vehicle) => {
          const sponsors = vehicle.sponsors

          if (sponsors.length <= 0) {
            return 'No hay empresas contratantes asignadas'
          }

          const filteredArray = sponsors.filter(
            (obj, index, self) => index === self.findIndex((o) => o.id === obj.id)
          )

          return (
            <select className='block w-full h-10 px-2 rounded-t-md border-b border-solid border-blue-dark outline-none capitalize'>
              {
                ...filteredArray.map((company) => (
                  <option key={company.id}>{company.project?.name }-{company.name}</option>
                ))
              }
            </select>
          )
        }
      }
    ]

    const restColumns: Array<Column<Vehicle>> = [
      {
        id: 'vehicleType',
        columnName: 'Tipo de unidad',
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

    return [
      ...columns,
      ...(!areCarts ? sponsorColumn : []),
      ...restColumns
    ]
  }, [areCarts])

  const PAGINATION = [5, 10, 20]

  const VEHICLE_ACTIONS: Array<Action<Vehicle>> = useMemo(() => {
    const mainActions = [
      {
        icon: () => (<EditIcon className='cursor-pointer w-5 h-5' />),
        actionFunc: handleUpdate
      },
      {
        icon: () => (<DeleteIcon className='cursor-pointer w-5 h-5 text-red' />),
        actionFunc: handleRemove
      },
      // {
      //   icon: () => (<EyeIcon className='cursor-pointer w-5 h-5 ' />),
      //   actionFunc: handleView
      // },
      {
        icon: () => (<AdminIcon className='cursor-pointer w-5 h-5 text-blue' />),
        actionFunc: assignCompany
      }
    ]

    const contractorActions = [
      {
        icon: () => (<AdminIcon className='cursor-pointer w-5 h-5 ' />),
        actionFunc: assignContractor
      }
    ]

    return [
      ...mainActions,
      ...(!areCarts ? contractorActions : [])
    ]
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

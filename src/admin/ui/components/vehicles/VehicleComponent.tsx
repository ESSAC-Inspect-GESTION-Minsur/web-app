import React, { type ReactElement, useContext, useEffect, useState, useMemo } from 'react'
import { type Vehicle } from '@/routes/models/vehicle.interface'
import { VehiclesService } from '@/routes/services/vehicle.service'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import Button from '@/shared/ui/components/Button'
import AddVehicleForm from './AddVehicleForm'
import UpdateVehicleForm from './UpdateVehicleForm'
import { toast } from 'react-toastify'
// import Table from '@/shared/ui/components/Table'
import ImportModal from '../ImportModal'
import { VehicleToastContext } from '../../pages/VehiclesView'
import Table, { type Action, type Column } from '@/shared/ui/components/table/Table'
import AdminIcon from '@/shared/ui/assets/icons/AdminIcon'
import AssignCompany from './AssignCompany'
import VehicleDetail from './VehicleDetail'
import EyeIcon from '@/shared/ui/assets/icons/EyeIcon'
import Divider from '@/shared/ui/components/Divider'

interface VehicleComponentProps {
  viewOption: number
  handleViewOption: (option: number) => void
}

const VehicleComponent = ({ viewOption, handleViewOption }: VehicleComponentProps): ReactElement => {
  const toastContext = useContext(VehicleToastContext)
  const vehiclesService = new VehiclesService()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])

  const [showAddVehicleModal, setShowAddVehicleModal] = useState<boolean>(false)
  const [showUpdateVehicleModal, setShowUpdateVehicleModal] = useState<boolean>(false)
  const [showImportModal, setShowImportModal] = useState<boolean>(false)
  const [showImportAssignCompanyModal, setShowImportAssignCompanyModal] = useState<boolean>(false)
  const [showAssignCompany, setShowAssignCompany] = useState<boolean>(false)
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false)

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  useEffect(() => {
    void vehiclesService.findAll()
      .then(setVehicles)
  }, [])

  const vehiclesFiltered = useMemo(() => {
    if (viewOption === 1) return vehicles

    if (viewOption === 2) return vehicles.filter(vehicle => !vehicle.vehicleType.isCart)

    return vehicles.filter(vehicle => vehicle.vehicleType.isCart)
  }, [vehicles, viewOption])

  const handleVehicleViewChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    handleViewOption(Number(event.target.value))
  }

  const toggleAddModal = (): void => {
    setShowAddVehicleModal(!showAddVehicleModal)
  }

  const toggleUpdateModal = (): void => {
    setShowUpdateVehicleModal(!showUpdateVehicleModal)
  }

  const toggleShowDetailModal = (): void => {
    setShowDetailModal(!showDetailModal)
  }

  const toggleAssignCompany = (): void => {
    setShowAssignCompany(!showAssignCompany)
  }

  const onFinishSubmit = (vehicle: Vehicle): void => {
    refreshList(vehicle, vehicle.licensePlate)
  }

  const refreshImportedVehicles = (newVehicles: Vehicle[]): void => {
    setVehicles(vehicles.concat(newVehicles))
  }

  const refreshImportedVehiclesWithCompany = (newVehicles: Vehicle[]): void => {
    setVehicles(vehicles.map(vehicle => {
      const newVehicle = newVehicles.find(newVehicle => newVehicle.licensePlate === vehicle.licensePlate)
      return newVehicle ?? vehicle
    }))
  }

  const refreshList = (vehicle: Vehicle, licensePlate: string, remove: boolean = false): void => {
    const index = vehicles.findIndex(vehicle => vehicle.licensePlate === licensePlate)

    if (index === -1) {
      setVehicles([...vehicles, vehicle])
      return
    }
    if (remove) {
      setVehicles(vehicles.filter(vehicle => vehicle.licensePlate !== licensePlate))
      return
    }

    const vehiclesList = [...vehicles.slice(0, index), vehicle, ...vehicles.slice(index + 1, vehicles.length)]
    setVehicles(vehiclesList)
  }

  const remove = (vehicle: Vehicle): void => {
    const result = confirm(`Estás seguro que quieres eliminar el vehículo con placa: ${vehicle.licensePlate}`)

    if (!result) return

    const { licensePlate } = vehicle
    void vehiclesService.remove(licensePlate)
      .then(response => {
        refreshList(response, licensePlate, true)
        toast('Vehículo eliminado correctamente', { toastId: toastContext.id, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId: toastContext.id, type: 'error' })
      })
  }

  const update = (vehicle: Vehicle): void => {
    setSelectedVehicle(vehicle)
    toggleUpdateModal()
  }

  const assignCompany = (vehicle: Vehicle): void => {
    setSelectedVehicle(vehicle)
    toggleAssignCompany()
  }

  const handleImportExcel = (): void => {
    setShowImportModal(true)
  }

  const show = (vehicle: Vehicle): void => {
    setSelectedVehicle(vehicle)
    toggleShowDetailModal()
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
      filterFunc: (vehicle) => vehicle.provider,
      sortFunc: (a, b) => a.provider > b.provider ? 1 : -1,
      render: (vehicle) => vehicle.provider
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
      filterFunc: (vehicle) => vehicle.imei.length > 0 ? vehicle.imei : 'Imei registrado',
      sortFunc: (a, b) => {
        const imeiA = a.imei.length > 0 ? a.imei : 'Imei registrado'
        const imeiB = b.imei.length > 0 ? b.imei : 'Imei registrado'
        return imeiA > imeiB ? 1 : -1
      },
      render: (vehicle) => vehicle.imei.length > 0 ? vehicle.imei : 'Imei registrado'
    },
    {
      id: 'lastMaintenance',
      columnName: 'Último Mantenimiento',
      filterFunc: (vehicle) => {
        if (!vehicle.lastMaintenance) {
          return 'No registrado'
        }
        return vehicle.lastMaintenance.trim().length > 0 ? new Date(vehicle.lastMaintenance).toDateString() : 'No registrado'
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
        if (vehicle.lastMaintenance === null) {
          return 'No registrado'
        }

        if (vehicle.lastMaintenance.length === 0) {
          return 'No registrado'
        }

        return new Date(vehicle.lastMaintenance).toDateString()
      }
    },
    {
      id: 'soatExpiration',
      columnName: 'F. Venc. Soat',
      filterFunc: (vehicle) => new Date(vehicle.soatExpiration).toDateString(),
      sortFunc: (a, b) => new Date(a.soatExpiration).getTime() - new Date(b.soatExpiration).getTime(),
      render: (vehicle) => new Date(vehicle.soatExpiration).toDateString()
    },
    {
      id: 'technicalReviewExpiration',
      columnName: 'F. Venc. Revisión Técnica',
      filterFunc: (vehicle) => new Date(vehicle.technicalReviewExpiration).toDateString(),
      sortFunc: (a, b) => {
        const aTime = new Date(a.technicalReviewExpiration).getTime()
        const bTime = new Date(b.technicalReviewExpiration).getTime()

        return aTime - bTime
      },
      render: (vehicle) => new Date(vehicle.technicalReviewExpiration).toDateString()
    },
    {
      id: 'vehicleType',
      columnName: 'Tipo de vehículo',
      filterFunc: (vehicle) => vehicle.vehicleType.name,
      sortFunc: (a, b) => a.vehicleType.name > b.vehicleType.name ? 1 : -1,
      render: (vehicle) => vehicle.vehicleType.name
    },
    {
      id: 'brand',
      columnName: 'Marca',
      filterFunc: (vehicle) => vehicle.brand,
      sortFunc: (a, b) => a.brand > b.brand ? 1 : -1,
      render: (vehicle) => vehicle.brand
    },
    {
      id: 'model',
      columnName: 'Modelo',
      filterFunc: (vehicle) => vehicle.model,
      sortFunc: (a, b) => a.model > b.model ? 1 : -1,
      render: (vehicle) => vehicle.model
    }
  ]

  const PAGINATION = [5, 10, 20]

  const VEHICLE_ACTIONS: Array<Action<Vehicle>> = [
    {
      icon: () => (<EditIcon className='cursor-pointer w-5 h-5' />),
      actionFunc: update
    },
    {
      icon: () => (<DeleteIcon className='cursor-pointer w-5 h-5 text-red' />),
      actionFunc: remove
    },

    {
      icon: () => (<AdminIcon className='cursor-pointer w-5 h-5 ' />),
      actionFunc: assignCompany
    },
    {
      icon: () => (<EyeIcon className='cursor-pointer w-5 h-5 ' />),
      actionFunc: show
    }
  ]

  return (
    <div className=''>
      {showAddVehicleModal && <AddVehicleForm closeModal={toggleAddModal} onFinishSubmit={onFinishSubmit} />}
      {showUpdateVehicleModal && <UpdateVehicleForm closeModal={toggleUpdateModal} vehicle={selectedVehicle} onFinishSubmit={onFinishSubmit} />}
      {showAssignCompany && selectedVehicle && <AssignCompany closeModal={toggleAssignCompany} vehicle={selectedVehicle} onFinishSubmit={onFinishSubmit} />}
      {showImportModal && <ImportModal close={() => { setShowImportModal(false) }} refreshList={refreshImportedVehicles} toastId={toastContext.id} type='vehicle' />}
      {showImportAssignCompanyModal && <ImportModal close={() => { setShowImportAssignCompanyModal(false) }} refreshList={refreshImportedVehiclesWithCompany} toastId={toastContext.id} type='assign-vehicle-company' />}
      {showDetailModal && selectedVehicle && <VehicleDetail closeModal={toggleShowDetailModal} vehicle={selectedVehicle} />}

      <div className='flex justify-between items-center mb-5'>
        <div className='flex flex-col sm:flex-row gap-2 sm:justify-center'>
          <Button color='primary' onClick={handleImportExcel}>Importar Excel</Button>
          <Button color='primary' onClick={() => { setShowImportAssignCompanyModal(true) }}>Asignar empresas Excel</Button>
          <Button color='primary' onClick={toggleAddModal}>Añadir { viewOption === 1 ? 'vehiculo o semirremolque' : viewOption === 2 ? 'vehiculo' : 'semirremolque' }</Button>
        </div>
      </div>
      <Divider></Divider>
      <div>
        <h3 className='font-semibold uppercase'>Selecciona que tipo de vehículo quieres visualizar</h3>
        <select className='block w-full h-10 px-2 border-b border-solid border-purple-900 outline-none' onChange={handleVehicleViewChange}>
          <option value="1">Todos</option>
          <option value="2">Vehículos</option>
          <option value="3">Semirremolques</option>
        </select>
      </div>

      {
        vehicles.length > 0
          ? <Table columns={VEHICLE_COLUMNS} data={vehiclesFiltered} showFilter={true} pagination={PAGINATION} actions={VEHICLE_ACTIONS} />
          : (<p>No hay vehiculos registrados</p>)

      }
    </div>
  )
}

export default VehicleComponent

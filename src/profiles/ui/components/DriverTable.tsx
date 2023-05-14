import React, { useContext, type ReactElement } from 'react'
import { DriverContext } from '../contexts/DriverContext'
import Table, { type Action, type Column } from '@/shared/ui/components/table/Table'
import { type Profile } from '@/profiles/models/profile.interface'
import { isDate } from '@/shared/utils'
import EyeIcon from '@/shared/ui/assets/icons/EyeIcon'
import { ProfilesService } from '@/profiles/services/profile.service'
import { toast } from 'react-toastify'
import ToggleOnIcon from '@/shared/ui/assets/icons/ToggleOnIcon'
import ToggleOffIcon from '@/shared/ui/assets/icons/ToggleOfIcon'

const DriverTable = (): ReactElement => {
  const { drivers, selectedDriver, toastId, setSelectedDriver, updateDriver } = useContext(DriverContext)

  const handleShowDriver = (driver: Profile): void => {
    if (selectedDriver?.id === driver.id) {
      setSelectedDriver(null)
      return
    }
    setSelectedDriver(driver)
  }

  const handleToggleActive = (driver: Profile): void => {
    const result = confirm(`Estás seguro que quieres ${driver.active ? 'desactivar' : 'activar'} el usuario '${driver.name}'`)

    if (!result) { return }

    const profilesService = new ProfilesService()
    const id = driver.id
    void profilesService.toggleActive(id)
      .then(response => {
        updateDriver(response)
        toast(`Conductor  ${driver.active ? 'desactivado' : 'activado'} correctamente`, { toastId, type: 'success' })
      })
      .catch(() => {
        toast('Hubo un error, intente nuevamente luego', { toastId, type: 'error' })
      })
  }

  const COLUMNS: Array<Column<Profile>> = [
    {
      id: 'name',
      columnName: 'Nombre',
      render: (driver: Profile) => driver.name,
      filterFunc: (driver: Profile) => driver.name,
      sortFunc: (a: Profile, b: Profile) => a.name.localeCompare(b.name)
    },
    {
      id: 'dni',
      columnName: 'DNI',
      render: (driver: Profile) => driver.dni,
      filterFunc: (driver: Profile) => driver.dni,
      sortFunc: (a: Profile, b: Profile) => a.dni.localeCompare(b.dni)
    },
    {
      id: 'license',
      columnName: 'Licencia',
      render: (driver: Profile) => driver.license ?? 'No registrado',
      filterFunc: (driver: Profile) => driver.license ?? 'No registrado',
      sortFunc: (a: Profile, b: Profile) => {
        const aLicense = a.license ?? 'No registrado'
        const bLicense = b.license ?? 'No registrado'

        return aLicense.localeCompare(bLicense)
      }
    },
    {
      id: 'licenseCategory',
      columnName: 'Categoría',
      render: (driver: Profile) => driver.licenseCategory ?? 'No registrado',
      filterFunc: (driver: Profile) => driver.licenseCategory ?? 'No registrado',
      sortFunc: (a: Profile, b: Profile) => {
        const aLicenseCategory = a.licenseCategory ?? 'No registrado'
        const bLicenseCategory = b.licenseCategory ?? 'No registrado'

        return aLicenseCategory.localeCompare(bLicenseCategory)
      }
    },
    {
      id: 'licenseExpiration',
      columnName: 'Vencimiento Licencia',
      filterFunc: (driver) => {
        if (!driver.licenseExpiration) {
          return 'No registrado'
        }
        return isDate(driver.licenseExpiration) ? new Date(driver.licenseExpiration).toDateString() : 'No registrado'
      },
      sortFunc: (a, b) => {
        const aSoatExpiration = a.licenseExpiration ?? 'No registrado'
        const bSoatExpiration = b.licenseExpiration ?? 'No registrado'

        if (isNaN(Date.parse(aSoatExpiration)) && isNaN(Date.parse(bSoatExpiration))) {
          return aSoatExpiration > bSoatExpiration ? 1 : -1
        }

        return new Date(aSoatExpiration).getTime() - new Date(bSoatExpiration).getTime()
      },
      render: (driver) => {
        if (driver.licenseExpiration === null || !isDate(driver.licenseExpiration)) {
          return 'No registrado'
        }

        return new Date(driver.licenseExpiration).toDateString()
      }
    }
  ]

  const ACTIONS: Array<Action<Profile>> = [
    {
      icon: () => (<EyeIcon className='cursor-pointer w-5 h-5'/>),
      actionFunc: handleShowDriver
    },
    {
      icon: (driver: Profile) => (
        <div className='cursor-pointer'>
          {
            driver.active
              ? (<ToggleOnIcon className='w-6 h-6 cursor-pointer text-success' />)
              : (<ToggleOffIcon className='w-6 h-6 cursor-pointer' />)
          }
        </div>
      ),
      actionFunc: handleToggleActive
    }
  ]

  return (
    <Table
      columns={COLUMNS}
      data={drivers}
      pagination={[5, 10, 20]}
      actions={ACTIONS}
    />
  )
}

export default DriverTable

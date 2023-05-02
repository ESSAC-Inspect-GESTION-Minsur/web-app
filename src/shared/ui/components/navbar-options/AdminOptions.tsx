import React, { type ReactElement, useMemo } from 'react'
import FieldIcon from '../../assets/icons/FieldIcon'
import MaterialIcon from '../../assets/icons/MaterialIcon'
import ReportIcon from '../../assets/icons/ReportIcon'
import UserIcon from '../../assets/icons/UserIcon'
import VehicleIcon from '../../assets/icons/VehicleIcon'
import DropDown from './DropDown'
import { useSelector } from 'react-redux'
import { getCurrentUser } from '@/shared/config/store/features/auth-slice'

export const DesktopAdminOptions = (): ReactElement => {
  const currentUser = useSelector(getCurrentUser)

  const adminMenu = (
    <a className='text-white pr-4'>
      Admin
    </a>
  )
  const items = useMemo(() => {
    let itemsAux = [
      { to: 'admin/usuarios', name: 'M. Usuarios', icon: <UserIcon className='w-5 h-5 mr-2'/> }
    ]

    if (currentUser?.company.toUpperCase() !== 'MARCOBRE') {
      itemsAux.push({ to: 'admin/grupos-reportes', name: 'M. Grupo Checklists', icon: <MaterialIcon className='w-5 h-5 mr-2'/> })
      itemsAux.push({ to: 'admin/empresas', name: 'Empresas', icon: <MaterialIcon className='w-5 h-5 mr-2'/> })
    }

    itemsAux = [
      ...itemsAux,
      { to: 'admin/reportes', name: 'M. Checklist', icon: <ReportIcon className='w-5 h-5 mr-2'/> },
      { to: 'admin/campos', name: 'M. Campos Checklist', icon: <FieldIcon className='w-5 h-5 mr-2'/> },
      { to: 'admin/tipo-vehiculos', name: 'M. Tipo de Vehículo', icon: <VehicleIcon className='w-5 h-5 mr-2'/> },
      { to: 'admin/vehiculos', name: 'M. Vehículo', icon: <VehicleIcon className='w-5 h-5 mr-2'/> },
      { to: 'admin/tipo-materiales', name: 'M. Tipo de Materiales', icon: <MaterialIcon className='w-5 h-5 mr-2'/> }
    ]

    return itemsAux
  }, [currentUser])

  return (
    <DropDown menu={adminMenu} items={items} logout={false}/>
  )
}

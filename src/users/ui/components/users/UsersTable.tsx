/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useContext, type ReactElement } from 'react'
import { UserContext } from '../../contexts/UserContext'
import Table, { type Action, type Column } from '@/shared/ui/components/table/Table'
import { type User } from '@/users/models/user.interface'
import { capitalize } from '@/shared/utils'
import { UsersService } from '@/users/services/user.service'
import { toast } from 'react-toastify'
import ToggleOnIcon from '@/shared/ui/assets/icons/ToggleOnIcon'
import ToggleOffIcon from '@/shared/ui/assets/icons/ToggleOfIcon'
import EyeIcon from '@/shared/ui/assets/icons/EyeIcon'
import UserIcon from '@/shared/ui/assets/icons/UserIcon'

interface UsersTableProps {
  toggleShowChangeRole: () => void
}

const UsersTable = ({ toggleShowChangeRole }: UsersTableProps): ReactElement => {
  const { users, selectedUser, toastId, setSelectedUser, updateUser } = useContext(UserContext)

  const handleToggleActive = (user: User): void => {
    const result = confirm(`Estás seguro que quieres ${user?.active ? 'desactivar' : 'activar'} el usuario '${user?.username ?? ''}'`)

    if (!result) { return }

    const usersService = new UsersService()
    const id = user?.id ?? ''
    void usersService.toggleActiveUser(id)
      .then(response => {
        updateUser(response)
        setSelectedUser(response)
        toast(`Usuario  ${user?.active ? 'desactivado' : 'activado'} correctamente`, { toastId, type: 'success' })
      })
      .catch(() => {
        toast('Hubo un error, intente nuevamente luego', { toastId, type: 'error' })
      })
  }

  const handleView = (user: User): void => {
    if (selectedUser?.id === user.id) {
      setSelectedUser(null)
      return
    }
    setSelectedUser(user)
  }

  const handleChangeRole = (user: User): void => {
    setSelectedUser(user)
    toggleShowChangeRole()
  }

  const USER_COLUMNS: Array<Column<User>> = [
    {
      id: 'username',
      columnName: 'Usuario',
      filterFunc: (user) => user.username,
      render: (user) => user.username,
      sortFunc: (a, b) => a.username > b.username ? 1 : -1
    },
    {
      id: 'role',
      columnName: 'Rol',
      filterFunc: (user) => user.role,
      render: (user) => capitalize(user.role),
      sortFunc: (a, b) => a.role > b.role ? 1 : -1
    },
    {
      id: 'status',
      columnName: 'Estado',
      filterFunc: (user) => user.active ? 'ACTIVO' : 'NO ACTIVO',
      render: (user) => user.active ? 'Activo' : 'No Activo',
      sortFunc: (a, b) => {
        const statusA = a.active ? 'ACTIVO' : 'NO ACTIVO'
        const statusB = b.active ? 'ACTIVO' : 'NO ACTIVO'

        return statusA > statusB ? 1 : -1
      }
    },
    {
      id: 'name',
      columnName: 'Nombre',
      filterFunc: (user) => `${user.profile.name} ${user.profile.lastName}`,
      render: (user) => capitalize(`${user.profile.name} ${user.profile.lastName}`),
      sortFunc: (a, b) => {
        const nameA = `${a.profile.name} ${a.profile.lastName}`
        const nameB = `${b.profile.name} ${b.profile.lastName}`

        return nameA > nameB ? 1 : -1
      }
    }
  ]

  const USER_ACTIONS: Array<Action<User>> = [
    {
      icon: () => (<EyeIcon className='cursor-pointer w-5 h-5 ' />),
      actionFunc: handleView
    },
    {
      icon: () => (<UserIcon className='cursor-pointer w-5 h-5 ' />),
      actionFunc: handleChangeRole
    },
    {
      icon: (user: User) => (
        <div className='cursor-pointer'>
          {
            user.active
              ? (<ToggleOnIcon className='w-6 h-6 cursor-pointer text-success' />)
              : (<ToggleOffIcon className='w-6 h-6 cursor-pointer' />)
          }
        </div>
      ),
      actionFunc: handleToggleActive
    }

  ]

  const PAGINATION = [5, 10, 15, 20]

  return (
    <main className=''>
      <Table
        data={users}
        columns={USER_COLUMNS}
        pagination={PAGINATION}
        showFilter={true}
        actions={USER_ACTIONS}
      />
    </main>
  )
}

export default UsersTable

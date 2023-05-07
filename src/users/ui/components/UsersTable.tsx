/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useContext, type ReactElement } from 'react'
import { UserContext } from '../contexts/UserContext'
import Table, { type Action, type Column } from '@/shared/ui/components/table/Table'
import { type User } from '@/users/models/user.interface'
import { capitalize } from '@/shared/utils'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import EyeIcon from '@/shared/ui/assets/icons/EyeIcon'

interface UsersTableProps {
  toggleShowDetailModal: () => void
  toggleShowUpdateModal: () => void
}

const UsersTable = ({ toggleShowDetailModal, toggleShowUpdateModal }: UsersTableProps): ReactElement => {
  const { users, setSelectedUser } = useContext(UserContext)

  const handleView = (user: User): void => {
    setSelectedUser(user)
    toggleShowDetailModal()
  }

  const handleUpdate = (user: User): void => {
    setSelectedUser(user)
    toggleShowUpdateModal()
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
      id: 'area',
      columnName: 'Area',
      filterFunc: (user) => user.areas[0].name,
      render: (user) => capitalize(user.areas[0].name),
      sortFunc: (a, b) => a.areas[0].name > b.areas[0].name ? 1 : -1
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
      icon: () => (<EditIcon className='cursor-pointer w-5 h-5' />),
      actionFunc: handleUpdate
    },
    {
      icon: () => (<EyeIcon className='cursor-pointer w-5 h-5 ' />),
      actionFunc: handleView
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

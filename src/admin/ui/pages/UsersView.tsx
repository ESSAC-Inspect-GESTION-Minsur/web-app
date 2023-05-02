import React, { type ReactElement, useEffect, useState } from 'react'
import Toast from '@/shared/ui/components/Toast'
import { useSelector } from 'react-redux'
import { type RootState } from '@/shared/config/store'
import { getCurrentUser } from '@/shared/config/store/features/auth-slice'
import { type UserStorage } from '@/iam/models/interfaces/user-storage.interface'
import { UsersService } from '@/admin/services/users.service'
import { type User } from '@/iam/models/user.model'
import Button from '@/shared/ui/components/Button'
import AddUserModal from '../components/users/AddUserModal'
import AreasComponent from '../components/areas/AreasComponent'
import ImportModal from '../components/ImportModal'
import UserDetailModal from '../components/users/UserDetailModal'
import Table, { type Column } from '@/shared/ui/components/table/Table'

const TOAST_ID = 'users'

export const ToastContext = React.createContext({ id: '' })

const UsersView = (): ReactElement => {
  const usersService = new UsersService()
  const currentUser = useSelector<RootState, UserStorage>(getCurrentUser)

  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false)
  const [showImportAssignCompanyModal, setShowImportAssignCompanyModal] = useState<boolean>(false)

  useEffect(() => {
    void usersService.getAll()
      .then(response => {
        setUsers(response.filter(user => user.id !== currentUser.id))
      })
  }, [])

  const updateUser = (newUser: User): void => {
    setSelectedUser(newUser)
    refreshUserList(newUser, newUser.id)
  }

  const refreshUserList = (user: User, id: string, remove: boolean = false): void => {
    const index = users.findIndex(user => user.id === id)

    if (index === -1) {
      setUsers([...users, user])
      return
    }

    if (remove) {
      setUsers(users.filter(user => user.id !== id))
      return
    }

    const usersList = [...users.slice(0, index), user, ...users.slice(index + 1, users.length)]
    setUsers(usersList)
  }

  const handleAddUser = (): void => {
    setShowAddModal(true)
  }

  const onClickUser = (user: User): void => {
    setSelectedUser(user)
    setShowDetailModal(true)
  }

  const handleImportExcel = (): void => {
    setShowImportModal(true)
  }

  const refreshImportedUsers = (newUsers: User[]): void => {
    setUsers(users.concat(newUsers))
  }

  const refreshImportedUsersWithCompany = (newUsers: User[]): void => {
    setUsers(users.map(user => {
      const newUser = newUsers.find(newUser => newUser.id === user.id)
      return newUser ?? user
    }))
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
      filterFunc: (user) => user.areas[0] ? user.areas[0].name : '-',
      render: (user) => user.areas[0] ? user.areas[0].name : '-',
      sortFunc: (a, b) => {
        const areaA = a.areas[0] ? a.areas[0].name : '-'
        const areaB = b.areas[0] ? b.areas[0].name : '-'

        return areaA > areaB ? 1 : -1
      }
    },
    {
      id: 'role',
      columnName: 'Rol',
      filterFunc: (user) => user.role,
      render: (user) => user.role.toUpperCase(),
      sortFunc: (a, b) => a.role > b.role ? 1 : -1
    },
    {
      id: 'status',
      columnName: 'Estado',
      filterFunc: (user) => user.active ? 'ACTIVO' : 'NO ACTIVO',
      render: (user) => user.active ? 'ACTIVO' : 'NO ACTIVO',
      sortFunc: (a, b) => {
        const statusA = a.active ? 'ACTIVO' : 'NO ACTIVO'
        const statusB = b.active ? 'ACTIVO' : 'NO ACTIVO'

        return statusA > statusB ? 1 : -1
      }
    },
    {
      id: 'name',
      columnName: 'Nombre',
      filterFunc: (user) => user.profile.fullName,
      render: (user) => user.profile.fullName.toUpperCase(),
      sortFunc: (a, b) => a.profile.fullName > b.profile.fullName ? 1 : -1
    }
  ]

  const PAGINATION = [5, 10, 15, 20]

  return (
    <ToastContext.Provider value={{ id: TOAST_ID }}>
      <div className='container-page'>
        <div className='sm:flex sm:justify-between sm:items-center'>
          <h1 className='text-3xl mb-4 after:h-px after:w-32 after:bg-gray-light after:block after:mt-1'>Usuarios</h1>
          <div className='flex flex-col sm:flex-row gap-2 sm:justify-center'>
            <Button color='secondary' onClick={handleImportExcel}>Importar Excel</Button>
            { currentUser.company !== 'MARCOBRE' && <Button color='secondary' onClick={() => { setShowImportAssignCompanyModal(true) }}>Assignar Empresas Excel</Button>}
            <Button color='primary' onClick={handleAddUser}>Añadir usuario</Button>
          </div>
        </div>

        <main className='flex flex-col md:grid md:grid-cols-table md:gap-10'>
          <div className='order-2 md:order-1 '>
            <AreasComponent toastId={TOAST_ID} />
          </div>
          <div className='w-full order-1 md:order-2 mt-3 md:mt-0'>
            <Table columns={USER_COLUMNS} data={users} pagination={PAGINATION} showFilter={true} onRowClick={onClickUser} />
          </div>
        </main>

        {showAddModal && <AddUserModal close={() => { setShowAddModal(false) }} updateUser={updateUser} />}
        {showDetailModal && <UserDetailModal user={selectedUser} close={() => { setShowDetailModal(false) }} updateUser={updateUser} />}

        {showImportModal && <ImportModal close={() => { setShowImportModal(false) }} refreshList={refreshImportedUsers} toastId={TOAST_ID} type='user' />}
        {showImportAssignCompanyModal && <ImportModal close={() => { setShowImportAssignCompanyModal(false) }} refreshList={refreshImportedUsersWithCompany} toastId={TOAST_ID} type='assign-user-company' />}
        <Toast id={TOAST_ID}></Toast>
      </div>
    </ToastContext.Provider>
  )
}

export default UsersView

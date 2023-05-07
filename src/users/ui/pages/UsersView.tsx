import React, { useState, type ReactElement, useEffect } from 'react'
import Button from '@/shared/ui/components/Button'
import { useArrayReducer } from '@/shared/hooks/useArrayReducer'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import { type User } from '@/users/models/user.interface'
import { UserContext } from '../contexts/UserContext'
import { UsersService } from '@/users/services/user.service'
import Divider from '@/shared/ui/components/Divider'
import Toast from '@/shared/ui/components/Toast'
import UsersTable from '../components/UsersTable'
import { getCurrentUser } from '@/shared/config/store/features/auth-slice'
import { useSelector } from 'react-redux'
import AreasComponent from '../components/AreasComponent'
import AddUserModal from '../components/AddUserModal'
import ImportModal from '@/admin/ui/components/ImportModal'
import UserDetailModal from '../components/UserDetailModal'
import UpdateUserModal from '../components/UpdateUserModal'

const TOAST_ID = 'users'

const UsersView = (): ReactElement => {
  const currentUser = useSelector(getCurrentUser)
  const [users, setUsers, addUser, updateUser, removeUser] = useArrayReducer<User>([])

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userForm, setUserForm] = useState<User | null>(null)

  const [isFormShown, toggleShowForm] = useBooleanState()
  const [isImportModalShown, toggleShowImportModal] = useBooleanState()
  const [isDetailModalShown, toggleShowDetailModal] = useBooleanState()
  const [isUpdateModalShown, toggleShowUpdateModal] = useBooleanState()
  const [isImportAssignCompanyModalShown, toggleShowImportAssignCompanyModal] = useBooleanState()

  useEffect(() => {
    const usersService = new UsersService()
    void usersService.findAll()
      .then(response => {
        setUsers(response.filter(user => user.id !== currentUser?.id))
      })
  }, [])

  const handleAdd = (): void => {
    setUserForm(null)
    toggleShowForm()
  }

  const handleImportUsers = (newUsers: User[]): void => {
    setUsers([...users, ...newUsers])
  }

  const refreshImportedUsersWithCompany = (newUsers: User[]): void => {
    setUsers(users.map(user => {
      const newUser = newUsers.find(newUser => newUser.id === user.id)
      return newUser ?? user
    }))
  }

  return (
    <UserContext.Provider value={{
      toastId: TOAST_ID,
      users,
      addUser,
      updateUser,
      removeUser,
      selectedUser,
      setSelectedUser,
      userForm,
      setUserForm
    }}>

      <section className='flex justify-between items-center'>
        <h1 className='uppercase text-2xl font-semibold'>Usuarios</h1>
        <div className='flex gap-2'>
          <Button color='secondary' onClick={toggleShowImportModal}>Importar Excel</Button>
          <Button color='secondary' onClick={toggleShowImportAssignCompanyModal}>Assignar Empresas Excel</Button>
          <Button color='primary' onClick={handleAdd}>Agregar usuario</Button>
        </div>
      </section>
      <Divider></Divider>
      <main className='flex flex-col md:grid md:grid-cols-table md:gap-10'>
        <div className='order-2 md:order-1 '>
          <AreasComponent />
        </div>
        <div className='w-full order-1 md:order-2 mt-3 md:mt-0'>
          <UsersTable toggleShowDetailModal={toggleShowDetailModal} toggleShowUpdateModal={toggleShowUpdateModal}/>
        </div>
      </main>

      <UserDetailModal isOpen={isDetailModalShown} onClose={toggleShowDetailModal}/>
      <UpdateUserModal isOpen={isUpdateModalShown} onClose={toggleShowUpdateModal}/>
      <AddUserModal isOpen={isFormShown} onClose={toggleShowForm} />
      <ImportModal isOpen={isImportModalShown} onClose={toggleShowImportModal} onSuccess={handleImportUsers} toastId={TOAST_ID} type='user' />
      <ImportModal isOpen={isImportAssignCompanyModalShown} onClose={toggleShowImportAssignCompanyModal} onSuccess={refreshImportedUsersWithCompany} toastId={TOAST_ID} type='assign-user-company' />

      <Toast id={TOAST_ID} />
    </UserContext.Provider>
  )
}

export default UsersView

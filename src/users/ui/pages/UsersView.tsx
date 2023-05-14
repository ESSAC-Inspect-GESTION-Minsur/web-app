import React, { useState, type ReactElement, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Button from '@/shared/ui/components/Button'
import { useArrayReducer } from '@/shared/hooks/useArrayReducer'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import { type User } from '@/users/models/user.interface'
import { UserContext } from '../contexts/UserContext'
import { UsersService } from '@/users/services/user.service'
import Divider from '@/shared/ui/components/Divider'
import Toast from '@/shared/ui/components/Toast'
import UsersTable from '../components/users/UsersTable'
import { getCurrentUser } from '@/shared/config/store/features/auth-slice'
import UserDetail from '../components/users/UserDetail'
import UserFormModal from '../components/users/UserFormModal'
import ChangeRoleModal from '../components/users/ChangeRoleModal'
import AssignSponsorModal from '../components/users/AssignSponsorModal'

const TOAST_ID = 'users'

const UsersView = (): ReactElement => {
  const currentUser = useSelector(getCurrentUser)
  const [users, setUsers, addUser, updateUser, removeUser] = useArrayReducer<User>([])

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userForm, setUserForm] = useState<User | null>(null)

  const [isFormShown, toggleShowForm] = useBooleanState()
  const [isChangeRoleShown, toggleShowChangeRole] = useBooleanState()
  const [isAssignSponsorShown, toggleShowAssignSponsor] = useBooleanState()

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
          <Button color='primary' onClick={handleAdd}>Agregar usuario</Button>
        </div>
      </section>
      <Divider></Divider>
      <div className='flex gap-5 items-start'>

        <main className={selectedUser !== null ? 'w-[70%]' : 'w-full'}>
          <UsersTable toggleShowChangeRole={toggleShowChangeRole} />
        </main>
        {
          selectedUser && (
            <UserDetail toggleForm={toggleShowForm} toggleAssignSponsorModal={toggleShowAssignSponsor}/>
          )
        }
      </div>

      <AssignSponsorModal isOpen={isAssignSponsorShown} onClose={toggleShowAssignSponsor}/>
      <UserFormModal isOpen={isFormShown} onClose={toggleShowForm} />
      <ChangeRoleModal isOpen={isChangeRoleShown} onClose={toggleShowChangeRole} />

      <Toast id={TOAST_ID} />
    </UserContext.Provider>
  )
}

export default UsersView

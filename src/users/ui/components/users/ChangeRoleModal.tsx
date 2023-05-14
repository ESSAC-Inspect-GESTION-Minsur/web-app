import React, { type ReactElement, useContext, useEffect } from 'react'
import { toast } from 'react-toastify'
import Button from '@/shared/ui/components/Button'
import { UserRole } from '@/users/models/enum/role.enum'
import { UserContext } from '../../contexts/UserContext'
import { UsersService } from '@/users/services/user.service'
import { useDataForm } from '@/shared/hooks/useDataForm'
import { USER_CHANGE_ROLE_INITIAL_STATE, type UserChangeRole } from '@/users/models/user.interface'
import Modal from '@/shared/ui/components/Modal'

interface ChangeRoleModalProps {
  isOpen: boolean
  onClose: () => void
}

const ChangeRoleModal = ({ isOpen, onClose }: ChangeRoleModalProps): ReactElement => {
  const { toastId, selectedUser, updateUser, setSelectedUser } = useContext(UserContext)

  const [user, setUserValue, setUser] = useDataForm<UserChangeRole>(USER_CHANGE_ROLE_INITIAL_STATE)

  useEffect(() => {
    if (selectedUser === null) return
    const { id, role } = selectedUser

    setUser({
      id,
      role
    })
  }, [selectedUser])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    if (selectedUser?.role === user.role) {
      toast('El usuario ya cuenta con el rol ingresado', { toastId, type: 'info' })
      onClose()
    }

    const usersService = new UsersService()

    void usersService.changeRole(user, user.id)
      .then((response) => {
        updateUser(response)
        setSelectedUser(response)
        toast('Rol actualizado correctamente', { toastId, type: 'success' })
        onClose()
      })
      .catch((error) => {
        console.log(error)
        toast('Hubo un error, intente más tarde', { toastId, type: 'error' })
        onClose()
      })
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.target

    const roleEnum = value as UserRole
    setUserValue('role', roleEnum)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='mb-4'>
        <p className='text-center uppercase text-xl'><span className='font-bold'>Usuario seleccionado:</span> {selectedUser?.username}</p>
        <p className='text-center uppercase text-red'><span className='font-bold'>Rol:</span> {user?.role}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <select onChange={handleChange} name="role" value={user.role} className='block w-full h-10 px-2 border-b border-solid border-purple-900 outline-none mb-4'>
          <option value={UserRole.USER}>{UserRole.USER.toUpperCase()}</option>
          <option value={UserRole.ADMIN}>{UserRole.ADMIN.toUpperCase()}</option>
          <option value={UserRole.SUPERVISOR}>{UserRole.SUPERVISOR.toUpperCase()}</option>
        </select>

        <div className='flex justify-center gap-5'>
          <Button color='secondary' onClick={onClose}>Cancelar</Button>
          <Button color='primary' type='submit'>Cambiar</Button>
        </div>
      </form>
    </Modal >
  )
}

export default ChangeRoleModal

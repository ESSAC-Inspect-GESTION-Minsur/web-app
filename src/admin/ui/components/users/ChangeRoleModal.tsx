import React, { type ReactElement, useContext, useState } from 'react'
import Button from '@/shared/ui/components/Button'
import { UserRole } from '@/admin/models/role.enum'
import { UsersService } from '@/admin/services/users.service'
import { type User } from '@/iam/models/user.model'
import { toast } from 'react-toastify'
import { ToastContext } from '../../pages/UsersView'

interface ChangeRoleModalProps {
  user: User | null
  updateUser: (user: User) => void
  close: () => void
}

const ChangeRoleModal = ({ user, updateUser, close }: ChangeRoleModalProps): ReactElement => {
  const toastContext = useContext(ToastContext)
  const usersService = new UsersService()

  const [userRole, setUserRole] = useState<UserRole>(user?.role ?? UserRole.USER)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    if (user?.role === userRole) {
      toast('El usuario ya cuenta con el rol inngresado', { toastId: toastContext.id, type: 'info' })
      close()
    }

    void usersService.changeRole({ role: userRole }, user?.id ?? '')
      .then((response) => {
        updateUser(response)
        toast('Rol actuliazado correctamente', { toastId: toastContext.id, type: 'success' })
        close()
      })
      .catch(() => {
        toast('Hubo un error, intente más tarde', { toastId: toastContext.id, type: 'error' })
        close()
      })
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.target

    const roleEnum = value as UserRole
    setUserRole(roleEnum)
  }

  return (
    <div className='p-6'>
      <div className='mb-4'>
        <p className='text-center uppercase text-xl'><span className='font-bold'>Usuario seleccionado:</span> {user?.username}</p>
        <p className='text-center uppercase text-red'><span className='font-bold'>Rol:</span> {user?.role}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <select onChange={handleChange} name="role" value={userRole} className='block w-full h-10 px-2 border-b border-solid border-purple-900 outline-none mb-4'>
          <option value={UserRole.USER}>{UserRole.USER.toUpperCase()}</option>
          <option value={UserRole.ADMIN}>{UserRole.ADMIN.toUpperCase()}</option>
          <option value={UserRole.SUPERVISOR}>{UserRole.SUPERVISOR.toUpperCase()}</option>
        </select>

        <div className='flex justify-center gap-5'>
          <Button color='secondary' onClick={close}>Cancelar</Button>
          <Button color='primary' type='submit'>Cambiar</Button>
        </div>
      </form>
    </div >
  )
}

export default ChangeRoleModal

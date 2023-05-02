import { UsersService } from '@/admin/services/users.service'
import { type User } from '@/iam/models/user.model'
import { type Profile } from '@/profiles/models/profile.entity'
import { LOCALE_OPTIONS } from '@/shared/models/date-range'
import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'
import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { ToastContext } from '../../pages/UsersView'
import ChangeRoleModal from './ChangeRoleModal'
import AssignCompany from './AssignCompany'
import { useSelector } from 'react-redux'
import { getCurrentUser } from '@/shared/config/store/features/auth-slice'

interface UserDetailModalProps {
  user: User | null
  close: () => void
  updateUser: (user: User) => void
}

const UserDetailModal = ({ user, close, updateUser }: UserDetailModalProps): ReactElement => {
  const toastContext = useContext(ToastContext)
  const usersService = new UsersService()
  const currentUser = useSelector(getCurrentUser)

  const [profile, setProfile] = useState<Profile | null>(null)

  const [showChangeRole, setShowChangeRole] = useState<boolean>(false)
  const [showAddCompany, setShowAddCompany] = useState<boolean>(false)

  useEffect(() => {
    if (user === null) close()
  }, [user])

  useEffect(() => {
    setProfile(user?.profile ?? null)
  }, [user])

  const handleShowChangeRole = (): void => {
    setShowChangeRole(!showChangeRole)
  }

  const handleShowAddCompany = (): void => {
    setShowAddCompany(!showAddCompany)
  }

  const handleDeactivate = (): void => {
    const result = confirm(`Estás seguro que quieres ${user?.active ? 'desactivar' : 'activar'} el usuario '${user?.username ?? ''}'`)

    if (!result) { return }

    const id = user?.id ?? ''
    void usersService.toggleActiveUser(id)
      .then(response => {
        updateUser(response)
        toast(`Usuario  ${user?.active ? 'desactivado' : 'activado'} correctamente`, { toastId: toastContext.id, type: 'success' })
      })
      .catch(() => {
        toast('Hubo un error, intente nuevamente luego', { toastId: toastContext.id, type: 'error' })
      })
  }

  return (
    <Modal>
      <div className='min-w-[300px] sm:min-w-[600px] p-6'>
        <div className='flex justify-between items-center'>
          <h2 className='text-center uppercase font-bold text-2xl'>Detalle de usuario</h2>
          <Button color='secondary' onClick={close}>Close</Button>
        </div>
        <div className='h-[1px] bg-gray-400 my-3'>
        </div>
        <div className='mb-2'>
          <h3 className='font-bold text-xl after:h-[1px] after:block after:w-28 after:bg-gray-400'>Detalle cuenta</h3>
          <div className='flex gap-2'>
            <p className='font-semibold'>Usuario:</p>
            <p>{user?.username}</p>
          </div>
          <div className='flex gap-2'>
            <p className='font-semibold'>Rol:</p>
            <p>{user?.role}</p>
          </div>
          <div className='flex gap-2'>
            <p className='font-semibold'>¿Está activo?:</p>
            <p>{user?.active ? 'Activo' : 'No activo'}</p>
          </div>
          <div className='flex gap-2'>
            <p className='font-semibold'>Fecha de creación:</p>
            <p>{new Date(user?.createdAt ?? '').toLocaleDateString('es-PE', { ...LOCALE_OPTIONS })}</p>
          </div>
        </div>
        <div>
          <h3 className='font-bold text-xl after:h-[1px] after:block after:w-28 after:bg-gray-400'>Información Personal</h3>
          <div className='flex gap-2'>
            <p className='font-semibold'>Nombre completo: </p>
            <p>{profile?.fullName}</p>
          </div>
          <div className='flex gap-2'>
            <p className='font-semibold'>Correo: </p>
            <p>{profile?.email}</p>
          </div>
          <div className='flex gap-2'>
            <p className='font-semibold'>DNI: </p>
            <p>{profile?.dni}</p>
          </div>
          <div className='flex gap-2'>
            <p className='font-semibold'>Empresa: </p>
            <p>{profile?.company}</p>
          </div>
          <div className='flex gap-2'>
            <p className='font-semibold'>Sponsor: </p>
            <p>{user?.company}</p>
          </div>
          <div className='flex gap-2'>
            <p className='font-semibold'>Licencia: </p>
            <p>{profile?.license}</p>
          </div>
          <div className='flex gap-2'>
            <p className='font-semibold'>Categoría de la licencia: </p>
            <p>{profile?.licenseCategory}</p>
          </div>
          <div className='flex gap-2'>
            <p className='font-semibold'>Fecha de Vencimiento Licencia: </p>
            <p>{new Date(profile?.licenseExpiration ?? '').toLocaleDateString('es-PE', { ...LOCALE_OPTIONS })}</p>
          </div>
          <div className='flex gap-2'>
            <p className='font-semibold'>Teléfono 1: </p>
            <p>{profile?.phone1}</p>
          </div>
          <div className='flex gap-2'>
            <p className='font-semibold'>Teléfono 2: </p>
            <p>{profile?.phone2}</p>
          </div>
        </div>
        {currentUser.company !== 'MARCOBRE' && (
          <div>
            <h3 className='font-bold text-xl after:h-[1px] after:block after:w-28 after:bg-gray-400'>Empresas</h3>
            <div>
              {
                profile && profile.companies.length > 0
                  ? profile?.companies.map((company, index) => (
                    <div key={company.id} className='flex gap-2'>
                      <p className='font-semibold'>Empresa {index + 1}: </p>
                      <p>{company.name}</p>
                    </div>))
                  : <p>No tiene empresas asignadas</p>
              }
            </div>
          </div>
        )}

        {showChangeRole && <ChangeRoleModal user={user} updateUser={updateUser} close={handleShowChangeRole} />}
        {showAddCompany && user && <AssignCompany user={user} updateUser={updateUser} close={handleShowAddCompany} />}
        <div className='mt-3 flex gap-2 items-center'>
          <Button color='secondary' onClick={handleDeactivate}>{user?.active ? 'Desactivar' : 'Activar'}</Button>
          <Button color='success' onClick={handleShowChangeRole}>Cambiar rol</Button>
          { currentUser.company !== 'MARCOBRE' && <Button color='success' onClick={handleShowAddCompany}>Añadir empresa</Button>}
        </div>

      </div>
    </Modal>
  )
}

export default UserDetailModal

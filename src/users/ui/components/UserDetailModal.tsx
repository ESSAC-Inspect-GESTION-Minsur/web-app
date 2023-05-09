import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'

import { UserContext } from '../contexts/UserContext'
import { type Profile } from '@/profiles/models/profile.interface'
import { LOCALE_OPTIONS } from '@/shared/types/date-range'
import ChangeRole from './ChangeRole'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import AssignCompany from './AssignCompany'

interface UserDetailModalProps {
  isOpen: boolean
  onClose: () => void
}

const UserDetailModal = ({ isOpen, onClose }: UserDetailModalProps): ReactElement => {
  const { selectedUser: user } = useContext(UserContext)
  const [profile, setProfile] = useState<Profile | null>(null)

  const [showChangeRole, toggleShowChangeRole] = useBooleanState()
  const [showAssignCompany, toggleShowAssignCompany] = useBooleanState()

  useEffect(() => {
    setProfile(user?.profile ?? null)
  }, [user])

  return (
    <Modal isOpen={isOpen} onClose={onClose} className='min-w-[300px] sm:min-w-[600px]' onTop={true}>
      <div className='p-6'>
        <div className='flex justify-between items-center'>
          <h2 className='text-center uppercase font-bold text-2xl'>Detalle de usuario</h2>
          <Button color='secondary' onClick={onClose}>Close</Button>
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
        <div className='mb-2'>
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
            <p className='font-semibold'>Empresa que contrata: </p>
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
            <p>{profile?.phone2 ?? 'No tiene registrado'}</p>
          </div>
        </div>

        <div className='mb-4'>
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

        {showChangeRole && <ChangeRole onClose={toggleShowChangeRole} />}
        {showAssignCompany && <AssignCompany onClose={toggleShowAssignCompany} />}

        <div className='mt-3 flex gap-2 items-center'>
          <Button color='success' onClick={toggleShowChangeRole}>Cambiar rol</Button>
          <Button color='success' onClick={toggleShowAssignCompany}>Asignar Empresa</Button>
        </div>

      </div>
    </Modal>
  )
}

export default UserDetailModal

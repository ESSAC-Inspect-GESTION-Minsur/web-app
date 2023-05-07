import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { UserContext } from '../contexts/UserContext'
import { useDataForm } from '@/shared/hooks/useDataForm'
import { USER_INITIAL_STATE } from '@/users/models/user.interface'
import { toast } from 'react-toastify'
import Modal from '@/shared/ui/components/Modal'
import Input from '@/shared/ui/components/Input'
import SelectInput from '@/shared/ui/components/SelectInput'
import { UserRole } from '@/users/models/enum/role.enum'
import Button from '@/shared/ui/components/Button'
import Divider from '@/shared/ui/components/Divider'
import { ProfilesService } from '@/profiles/services/profile.service'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import { PROFILE_DTO_INITIAL_STATE, type ProfileDto } from '@/profiles/models/profile.interface'

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
}

const UpdateUserModal = ({ isOpen, onClose }: AddUserModalProps): ReactElement => {
  const { toastId, selectedUser, updateUser } = useContext(UserContext)

  const [profile, setProfileValue, setProfile, resetProfile] = useDataForm<ProfileDto>(PROFILE_DTO_INITIAL_STATE)

  const [canSubmit, setCanSubmit] = useState<boolean>(false)

  const [isLoading,, setIsLoading] = useBooleanState()
  // const areaRef = useRef<HTMLSelectElement>(null)

  const [validInputs, setValidInputs] = useState({
    company: true,
    name: true,
    lastName: true,
    license: true,
    licenseCategory: true,
    phone1: true
  })

  useEffect(() => {
    if (selectedUser === null) {
      return
    }

    const { profile } = selectedUser

    setProfile({
      company: profile.company,
      name: profile.name,
      lastName: profile.lastName,
      license: profile.license,
      licenseCategory: profile.licenseCategory,
      phone1: profile.phone1,
      dni: profile.dni,
      email: profile.email ?? '',
      licenseExpiration: profile.licenseExpiration,
      phone2: profile.phone2 ?? ''
    })
  }, [selectedUser])

  useEffect(() => {
    setCanSubmit(Object.values(validInputs).every(v => v))
  }, [validInputs])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setIsLoading(true)
    const profilesService = new ProfilesService()

    // console.log(profile)
    void profilesService.update(profile, selectedUser?.profile.id ?? '')
      .then((profile) => {
        console.log(profile)
        updateUser({
          ...selectedUser ?? USER_INITIAL_STATE,
          profile
        })
        resetProfile()
        setIsLoading(false)
        onClose()
        toast('Usuario guardado correctamente', { toastId, type: 'success' })
      })
      .catch(error => {
        const { message } = error.data
        setIsLoading(false)
        toast(message, { toastId, type: 'error' })
      })
  }

  const setIsValidInput = (name: string, valid: boolean): void => {
    setValidInputs({
      ...validInputs,
      [name]: valid
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className='min-w-[600px]'>
      <div className='p-6'>
        <h1 className='uppercase text-center font-bold mb-4'>Editar Usuario</h1>
        <form onSubmit={handleSubmit} className='flex flex-col'>
          <Input
            label='Usuario'
            value={selectedUser?.username}
            name='username' placeholder='Username' type='text'
            setValid={(valid) => { setIsValidInput('username', valid) }}
            setValue={() => {}}
            disabled={true}></Input>

          <SelectInput<string>
            label='Rol'
            name='role'
            value={selectedUser?.role ?? UserRole.USER}
            objects={Object.values(UserRole)}
            setValue={() => {}}
            disabled={true}></SelectInput>

          <Divider />
          <p className='uppercase font-semibold mb-3'>Información personal</p>
          <Input
            label='Nombres'
            value={profile.name}
            name='name' placeholder='Nombres completos' type='text'
            setValid={(valid) => { setIsValidInput('name', valid) }}
            setValue={setProfileValue}></Input>

          <Input
            label='Apellidos'
            value={profile.lastName}
            name='lastName' placeholder='Apellidos completos' type='text'
            setValid={(valid) => { setIsValidInput('lastName', valid) }}
            setValue={setProfileValue}></Input>

          <Input
            label='DNI'
            value={profile.dni}
            name='dni' placeholder='DNI' type='text'
            setValid={(valid) => { setIsValidInput('dni', valid) }}
            setValue={setProfileValue}
            disabled={true}></Input>

          <Input
            label='Empresa'
            value={profile.company}
            name='company' placeholder='Empresa' type='text'
            setValid={(valid) => { setIsValidInput('company', valid) }}
            setValue={setProfileValue}></Input>

          <Input
            label='Email'
            value={profile.email}
            name='email' placeholder='Correo electrónico' type='email'
            setValue={setProfileValue}
            required={false}></Input>

          <Input
            label='Licencia'
            value={profile.license}
            name='license' placeholder='Licencia' type='text'
            setValid={(valid) => { setIsValidInput('license', valid) }}
            setValue={setProfileValue}></Input>

          <Input
            label='Categoría de la licencia'
            value={profile.licenseCategory}
            name='licenseCategory' placeholder='Categoría de la licencia' type='text'
            setValid={(valid) => { setIsValidInput('licenseCategory', valid) }}
            setValue={setProfileValue}></Input>

          <Input
            label='Fecha de vencimiento de la licencia'
            value={new Date(profile.licenseExpiration).toISOString().substring(0, 10)}
            name='licenseExpiration' placeholder='' type='date'
            setValid={(valid) => { setIsValidInput('licenseExpiration', valid) }}
            setValue={setProfileValue}></Input>

          <Input
            label='Teléfono 1'
            value={profile.phone1}
            name='phone1' placeholder='Teléfono 1' type='tel'
            setValid={(valid) => { setIsValidInput('phone1', valid) }}
            setValue={setProfileValue}></Input>

          <Input
            label='Teléfono 2'
            value={profile.phone2}
            name='phone2' placeholder='Teléfono 2' type='tel'
            setValue={setProfileValue}
            required={false}></Input>

          <div className='flex justify-center gap-5 mt-4'>
            <Button color='secondary' onClick={onClose}>Cerrar</Button>
            <Button color='primary' type='submit' disabled={!canSubmit || isLoading} isLoading={isLoading}>Guardar Usuario</Button>
          </div>
        </form>
      </div>
    </Modal>

  )
}

export default UpdateUserModal

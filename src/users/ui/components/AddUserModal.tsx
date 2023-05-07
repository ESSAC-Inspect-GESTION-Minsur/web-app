import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { UserContext } from '../contexts/UserContext'
import { useDataForm } from '@/shared/hooks/useDataForm'
import { USER_DTO_INITIAL_STATE, type UserDto } from '@/users/models/user.interface'
import { PROFILE_DTO_INITIAL_STATE, type ProfileDto } from '@/profiles/models/profile.interface'
import { type Area } from '@/users/models/area.interface'
import { AreasService } from '@/users/services/area.service'
import { UsersService } from '@/users/services/user.service'
import { toast } from 'react-toastify'
import Modal from '@/shared/ui/components/Modal'
import Input from '@/shared/ui/components/Input'
import SelectInput from '@/shared/ui/components/SelectInput'
import { UserRole } from '@/users/models/enum/role.enum'
import Button from '@/shared/ui/components/Button'
import Divider from '@/shared/ui/components/Divider'
import { useBooleanState } from '@/shared/hooks/useBooleanState'

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
}

const AddUserModal = ({ isOpen, onClose }: AddUserModalProps): ReactElement => {
  const { toastId, addUser } = useContext(UserContext)

  const [user, setUserValue, , resetUser] = useDataForm<UserDto>(USER_DTO_INITIAL_STATE)
  const [profile, setProfileValue, , resetProfile] = useDataForm<ProfileDto>(PROFILE_DTO_INITIAL_STATE)

  const [areas, setAreas] = useState<Area[]>([])

  const [canSubmit, setCanSubmit] = useState<boolean>(false)
  const [isLoading,, setIsLoading] = useBooleanState()

  // const areaRef = useRef<HTMLSelectElement>(null)

  const [validInputs, setValidInputs] = useState({
    username: false,
    password: false,
    dni: false,
    company: false,
    companyWhoHires: false,
    name: false,
    lastName: false,
    license: false,
    licenseCategory: false,
    phone1: false
  })

  useEffect(() => {
    setIsLoading(false)
    const areasService = new AreasService()
    void areasService.findAll()
      .then(setAreas)
  }, [])

  useEffect(() => {
    setCanSubmit(Object.values(validInputs).every(v => v))
  }, [validInputs])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setIsLoading(true)
    const areasService = new AreasService()
    const usersService = new UsersService()

    user.company = user.company.toUpperCase()
    const areaId = user.areaId

    void usersService.create(user)
      .then((user) => {
        void usersService.createProfile(user.id, profile)
          .then(profile => {
            void areasService.assignUser(areaId, user.id)
              .then(userWithArea => {
                setIsLoading(false)
                userWithArea.profile = profile
                addUser(userWithArea)
                resetUser()
                resetProfile()
                onClose()
                toast('Usuario creado correctamente', { toastId, type: 'success' })
              })
              .catch(error => {
                setIsLoading(false)
                const { message } = error.data
                toast(message, { toastId, type: 'error' })
              })
          })
          .catch(error => {
            setIsLoading(false)
            void usersService.remove(user.id)

            const { message } = error.data
            const errors = typeof message === 'object' ? Object.values(message).join(',') : message
            toast(errors, { toastId, type: 'error' })
          })
      })
      .catch(error => {
        setIsLoading(false)
        const { message } = error.data
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
        <h1 className='uppercase text-center font-bold mb-4'>Añadir Usuario</h1>
        <form onSubmit={handleSubmit} className='flex flex-col'>
          <Input
            label='Usuario'
            value={user.username}
            name='username' placeholder='Username' type='text'
            setValid={(valid) => { setIsValidInput('username', valid) }}
            setValue={setUserValue}></Input>

          <Input
            label='Contraseña'
            value={user.password}
            name='password' placeholder='Contraseña' type='password'
            setValid={(valid) => { setIsValidInput('password', valid) }}
            setValue={setUserValue}></Input>

          <SelectInput<string>
            label='Rol'
            name='role'
            objects={Object.values(UserRole)}
            setValue={setUserValue}
            value={user.role}
          />

          <SelectInput<Area>
            label='Área'
            name='areaId'
            objects={areas}
            setValue={setUserValue}
            value={user.areaId}
            optionKey='name'
            valueKey='id'
          />

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
            setValue={setProfileValue}></Input>

          <Input
            label='Empresa'
            value={profile.company}
            name='company' placeholder='Empresa' type='text'
            setValid={(valid) => { setIsValidInput('company', valid) }}
            setValue={setProfileValue}></Input>

          <Input
            label='Sponsor'
            value={user.company}
            name='company' placeholder='Sponsor' type='text'
            setValid={(valid) => { setIsValidInput('companyWhoHires', valid) }}
            setValue={setUserValue}></Input>

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
            <Button color='primary' type='submit' disabled={!canSubmit || isLoading} isLoading={isLoading}>Añadir Usuario</Button>
          </div>
        </form>
      </div>
    </Modal>

  )
}

export default AddUserModal

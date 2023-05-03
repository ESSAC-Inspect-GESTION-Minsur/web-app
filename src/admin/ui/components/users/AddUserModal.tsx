import { type AddUser } from '@/admin/models/add-user.interface'
import { UserRole } from '@/admin/models/role.enum'
import { AreasService } from '@/admin/services/areas.service'
import { UsersService } from '@/admin/services/users.service'
import { type Area, type User } from '@/iam/models/user.model'
import { type ProfileDto } from '@/profiles/models/profile.entity'
import Button from '@/shared/ui/components/Button'
import Input from '@/shared/ui/components/Input'
import Modal from '@/shared/ui/components/Modal'
import React, { type ReactElement, useContext, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { ToastContext } from '../../pages/UsersView'

interface AddUserModalProps {
  close: () => void
  updateUser: (user: User) => void
}

const PROFILE_INIT_STATE: ProfileDto = {
  dni: '',
  company: '',
  email: '',
  name: '',
  lastName: '',
  license: '',
  licenseCategory: '',
  licenseExpiration: new Date().toISOString(),
  phone1: '',
  phone2: ''
}

const AddUserModal = ({ close, updateUser: refreshUserList }: AddUserModalProps): ReactElement => {
  const toastContext = useContext(ToastContext)
  const areasService = new AreasService()
  const usersService = new UsersService()

  const [canSubmit, setCanSubmit] = useState<boolean>(false)

  const [newUser, setNewUser] = useState<AddUser>({
    username: '',
    password: '',
    company: '',
    role: UserRole.USER
  })

  const [newProfile, setNewProfile] = useState<ProfileDto>(PROFILE_INIT_STATE)

  const [areas, setAreas] = useState<Area[]>([])

  const areaRef = useRef<HTMLSelectElement>(null)

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

  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    void areasService.findAll()
      .then(setAreas)
  }, [])

  useEffect(() => {
    setCanSubmit(Object.values(validInputs).every(v => v))
  }, [validInputs])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target

    setNewUser({
      ...newUser,
      [name]: value
    })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setIsLoading(true)

    const areaId = areaRef.current?.value ?? areas[0].id.toString()
    newUser.company = newUser.company.toUpperCase()
    void usersService.create(newUser)
      .then((user) => {
        void usersService.createProfile(user.id, newProfile)
          .then(profile => {
            void areasService.assignUser(areaId, user.id)
              .then(userWithArea => {
                setIsLoading(false)
                userWithArea.profile = profile
                refreshUserList(userWithArea)
                toast('Usuario creado correctamente', { toastId: toastContext.id, type: 'success' })
              })
              .catch(error => {
                setIsLoading(false)
                console.log(error)
                const { message } = error.data
                toast(message, { toastId: toastContext.id, type: 'error' })
              })
          })
          .catch(error => {
            setIsLoading(false)
            console.log(error)
            void usersService.remove(user.id)

            const { message } = error.data
            const errors = typeof message === 'object' ? Object.values(message).join(',') : message
            toast(errors, { toastId: toastContext.id, type: 'error' })
          })
      })
      .catch(error => {
        setIsLoading(false)
        console.log(error)
        const { message } = error.data
        toast(message, { toastId: toastContext.id, type: 'error' })
      })
      .finally(() => {
        setIsLoading(false)
        close()
      })
  }

  const setValueUser = (name: string, value: string): void => {
    setNewUser({
      ...newUser,
      [name]: value
    })
  }

  const setValueProfile = (name: string, value: string): void => {
    setNewProfile({
      ...newProfile,
      [name]: value
    })
  }

  const setIsValidInput = (name: string, valid: boolean): void => {
    setValidInputs({
      ...validInputs,
      [name]: valid
    })
  }

  const inputClass = 'block w-full h-10 px-2 border-b border-solid border-purple-900 outline-none'

  return (
    <Modal>
      <div className='min-w-[300px] sm:min-w-[600px] p-6'>
        <h1 className='uppercase text-center font-bold mb-4'>Añadir Usuario</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <Input
            value={newUser.username}
            name='username' placeholder='Username' type='text'
            setValid={(valid) => { setIsValidInput('username', valid) }}
            setValue={(value) => { setValueUser('username', value) }}></Input>
          <Input
            value={newUser.password}
            name='password' placeholder='Contraseña' type='password'
            setValid={(valid) => { setIsValidInput('password', valid) }}
            setValue={(value) => { setValueUser('password', value) }}></Input>

          <select name="role" className={`${inputClass}`} onChange={handleChange}>
            <option value={`${UserRole.USER}`}>{UserRole.USER.toUpperCase()}</option>
            <option value={`${UserRole.ADMIN}`}>{UserRole.ADMIN.toUpperCase()}</option>
            <option value={`${UserRole.SUPERVISOR}`}>{UserRole.SUPERVISOR.toUpperCase()}</option>
          </select>

          <select name="area" ref={areaRef} className={`${inputClass}`}>
            {
              areas.map(area => {
                return (
                  <option key={area.id} value={area.id}>{area.name.toUpperCase()}</option>
                )
              })
            }
          </select>

          <p>Información personal</p>
          <Input
            value={newProfile.name}
            name='name' placeholder='Nombres completos' type='text'
            setValid={(valid) => { setIsValidInput('name', valid) }}
            setValue={(value) => { setValueProfile('name', value) }}></Input>

          <Input
            value={newProfile.lastName}
            name='lastName' placeholder='Apellidos completos' type='text'
            setValid={(valid) => { setIsValidInput('lastName', valid) }}
            setValue={(value) => { setValueProfile('lastName', value) }}></Input>

          <Input
            value={newProfile.dni}
            name='dni' placeholder='DNI' type='text'
            setValid={(valid) => { setIsValidInput('dni', valid) }}
            setValue={(value) => { setValueProfile('dni', value) }}></Input>

          <Input
            value={newUser.company}
            name='companyWhoHires' placeholder='SPONSOR' type='text'
            setValid={(valid) => { setIsValidInput('companyWhoHires', valid) }}
            setValue={(value) => { setValueUser('company', value) }}></Input>

          <Input
            value={newProfile.company}
            name='company' placeholder='Empresa del transportista' type='text'
            setValid={(valid) => { setIsValidInput('company', valid) }}
            setValue={(value) => { setValueProfile('company', value) }}></Input>

          <Input
            value={newProfile.email}
            name='email' placeholder='Correo electrónico' type='email'
            setValue={(value) => { setValueProfile('email', value) }}
            required={false}></Input>

          <Input
            value={newProfile.license}
            name='license' placeholder='Licencia' type='text'
            setValid={(valid) => { setIsValidInput('license', valid) }}
            setValue={(value) => { setValueProfile('license', value) }}></Input>

          <Input
            value={newProfile.licenseCategory}
            name='licenseCategory' placeholder='Categoría de la licencia' type='text'
            setValid={(valid) => { setIsValidInput('licenseCategory', valid) }}
            setValue={(value) => { setValueProfile('licenseCategory', value) }}></Input>

          <div className='my-2'>
            <label className='font-medium' htmlFor="licenseExpiration">Fecha de vencimiento de la licencia</label>
            <Input
              value={new Date(newProfile.licenseExpiration).toISOString().substring(0, 10)}
              name='licenseExpiration' placeholder='' type='date'
              setValid={(valid) => { setIsValidInput('licenseExpiration', valid) }}
              setValue={(value) => { setValueProfile('licenseExpiration', value) }}></Input>
          </div>

          <Input
            value={newProfile.phone1}
            name='phone1' placeholder='Telefóno 1' type='tel'
            setValid={(valid) => { setIsValidInput('phone1', valid) }}
            setValue={(value) => { setValueProfile('phone1', value) }}></Input>

          <Input
            value={newProfile.phone2}
            name='phone2' placeholder='Teléfono 2' type='tel'
            setValue={(value) => { setValueProfile('phone2', value) }}
            required={false}></Input>

          <div className='flex justify-center gap-5'>
            <Button color='secondary' onClick={close}>Cerrar</Button>
            <Button color='primary' type='submit' disabled={!canSubmit || isLoading} isLoading={isLoading}>Añadir Usuario</Button>
          </div>
        </form>
      </div>
    </Modal>

  )
}

export default AddUserModal

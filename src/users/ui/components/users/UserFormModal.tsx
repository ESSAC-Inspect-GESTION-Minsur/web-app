import Modal from '@/shared/ui/components/Modal'
import React, { useContext, type ReactElement, useState, useEffect, Fragment } from 'react'
import { UserContext } from '../../contexts/UserContext'
import { useDataForm } from '@/shared/hooks/useDataForm'
import { USER_DTO_INITIAL_STATE, USER_INITIAL_STATE, type UserDto } from '@/users/models/user.interface'
import { PROFILE_DTO_INITIAL_STATE, type ProfileDto } from '@/profiles/models/profile.interface'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import { toast } from 'react-toastify'
import { UsersService } from '@/users/services/user.service'
import Input from '@/shared/ui/components/Input'
import SelectInput from '@/shared/ui/components/SelectInput'
import { UserRole } from '@/users/models/enum/role.enum'
import Divider from '@/shared/ui/components/Divider'
import Button from '@/shared/ui/components/Button'
import { type FormAction } from '@/shared/types'
import { ProfilesService } from '@/profiles/services/profile.service'
import { PROJECT_INITIAL_STATE, type Project } from '@/users/models/project.interface'
import { ProjectsService } from '@/users/services/project.service'
import { type Sponsor } from '@/users/models/sponsor.interface'
// import { type Project } from '@/users/models/project.interface'

interface UserFormModalProps {
  isOpen: boolean
  onClose: () => void
}

const UserFormModal = ({ isOpen, onClose }: UserFormModalProps): ReactElement => {
  const { toastId, userForm, addUser, updateUser, setUserForm } = useContext(UserContext)

  const [user, setUserValue, setUser, resetUser] = useDataForm<UserDto>(USER_DTO_INITIAL_STATE)
  const [profile, setProfileValue, setProfile, resetProfile] = useDataForm<ProfileDto>(PROFILE_DTO_INITIAL_STATE)

  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project>(PROJECT_INITIAL_STATE)
  const [formAction, setFormAction] = useState<FormAction>('add')

  const [isLoading, , setIsLoading] = useBooleanState()
  const [isEssac, setIsEssac] = useState<boolean>(true)

  // const sponsorRef = useRef<HTMLSelectElement>(null)

  const handleOnClose = (): void => {
    if (formAction === 'update') {
      setUserForm(null)
      resetUser()
      resetProfile()
    }

    setIsEssac(false)

    onClose()
  }

  useEffect(() => {
    setIsLoading(false)
    if (formAction === 'update' || !isOpen) return

    const projectsService = new ProjectsService()
    void projectsService.findAll()
      .then(response => {
        const projectsFiltered = response.filter(project => project.sponsors.length > 0)
        setProjects(projectsFiltered)
        if (projectsFiltered.length > 0) {
          setSelectedProject(projectsFiltered[0])
        }
      })
  }, [formAction, isOpen])

  useEffect(() => {
    if (!isOpen) return

    if (userForm === null) {
      setFormAction('add')
      return
    }

    const { role, username, profile } = userForm
    console.log({ role })
    setFormAction('update')

    setUser({
      role,
      username,
      company: '',
      password: '',
      profile: PROFILE_DTO_INITIAL_STATE,
      sponsorId: ''
    })

    setProfile({
      name: profile.name,
      lastName: profile.lastName,
      dni: profile.dni,
      phone1: profile.phone1,
      phone2: profile.phone2,
      email: profile.email,
      isDriver: false,
      license: null,
      licenseCategory: null,
      licenseExpiration: null
    })
  }, [userForm, isOpen])

  useEffect(() => {
    if (isEssac) {
      setUser({
        ...user,
        sponsorId: ''
      })

      return
    }

    const sponsors = selectedProject.sponsors
    if (sponsors.length === 0) return

    setUser({
      ...user,
      sponsorId: sponsors[0].id
    })
  }, [selectedProject, isEssac])

  const finishSubmitting = (): void => {
    setUserForm(null)
    resetUser()
    resetProfile()
    onClose()
    setIsLoading(false)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setIsLoading(true)

    if (formAction === 'add') {
      addUserSubmitting()
      return
    }

    updateProfileSubmitting()
  }

  const addUserSubmitting = (): void => {
    const usersService = new UsersService()
    user.profile = profile
    user.company = 'MINSUR'

    void usersService.create(user)
      .then((user) => {
        addUser(user)
        finishSubmitting()
        toast('Se agregó correctamente el usuario', { toastId, type: 'success' })
      })
      .catch(error => {
        console.log(error)
        setIsLoading(false)
        const { message } = error.data
        const errors = typeof message === 'object' ? Object.values(message).join(',') : message
        toast(errors, { toastId, type: 'error' })
      })
  }

  const updateProfileSubmitting = (): void => {
    const profilesService = new ProfilesService()
    const id = userForm?.profile.id ?? ''

    profile.license = null
    profile.licenseCategory = null
    profile.licenseExpiration = null

    void profilesService.update(profile, id)
      .then((newProfile) => {
        const updatedUser = { ...userForm ?? USER_INITIAL_STATE, profile: newProfile }
        updateUser(updatedUser)
        finishSubmitting()
        toast('Se guardó correctamente el usuario', { toastId, type: 'success' })
      })
      .catch(error => {
        setIsLoading(false)
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose} onTop={true} className='min-w-[600px]'>
      <div className='p-6'>
        <h1 className='uppercase text-center font-bold mb-4'>{formAction === 'add' ? 'Añadir' : 'Editar'} Usuario</h1>
        <form onSubmit={handleSubmit} className='flex flex-col'>
          <Input
            label='Usuario'
            value={user.username}
            name='username'
            placeholder='Username'
            setValue={setUserValue}
            disabled={formAction === 'update'}
            type='text'
          />

          {
            formAction === 'add' &&
            <Input
              label='Contraseña'
              value={user.password}
              name='password'
              placeholder='Contraseña'
              setValue={setUserValue}
              type='password'
            />
          }

          <SelectInput<string>
            label='Rol'
            name='role'
            objects={Object.values(UserRole)}
            setValue={setUserValue}
            value={user.role}
            disabled={formAction === 'update'}
          />
          {
            formAction === 'add' && (
              <Input
                className='-ml-2 mt-2'
                label='¿Pertenece a ESSAC?'
                name='isEssac'
                type='checkbox'
                placeholder='¿Pertenece a ESSAC?'
                setValue={(name, value) => {
                  setIsEssac(!isEssac)
                }}
                value={isEssac.toString()}
              />
            )
          }

          {
            formAction === 'add' && !isEssac && (
              <Fragment>
                {
                  projects.length > 0 && (
                    <SelectInput<Project>
                      label='Proyecto'
                      name=''
                      objects={projects}
                      setValue={(name, value) => {
                        const project = projects.find(project => project.id === value)
                        setSelectedProject(project ?? PROJECT_INITIAL_STATE)
                      }}
                      value={selectedProject.id}
                      optionKey='name'
                      valueKey='id'
                    />
                  )
                }
                {
                  selectedProject.sponsors.length > 0 && (
                    <SelectInput<Sponsor>
                      label='Sponsor'
                      name='sponsorId'
                      objects={selectedProject.sponsors}
                      setValue={setUserValue}
                      value={user.sponsorId}
                      optionKey='name'
                      valueKey='id'
                    />
                  )
                }
              </Fragment>
            )
          }

          <Divider />

          <p className='uppercase font-semibold mb-3'>Información personal</p>
          <Input
            label='Nombres'
            value={profile.name}
            name='name'
            placeholder='Nombres completos'
            setValue={setProfileValue}
            type='text'
          />

          <Input
            label='Apellidos'
            value={profile.lastName}
            name='lastName'
            placeholder='Apellidos completos'
            setValue={setProfileValue}
            type='text'
          />

          <Input
            label='DNI'
            value={profile.dni}
            name='dni'
            placeholder='DNI'
            disabled={formAction === 'update'}
            setValue={setProfileValue}
            type='text'
          />

          {
            profile.email !== null &&
            <Input
              label='Email'
              value={profile.email}
              name='email'
              placeholder='Correo electrónico'
              type='email'
              setValue={setProfileValue}
              required={false}
            />
          }

          {
            profile.phone1 !== null &&
            <Input
              label='Teléfono 1'
              value={profile.phone1}
              name='phone1'
              placeholder='Teléfono 1'
              type='tel'
              setValue={setProfileValue}
            />
          }

          {
            profile.phone2 !== null &&
            <Input
              label='Teléfono 2'
              value={profile.phone2}
              name='phone2'
              placeholder='Teléfono 2'
              type='tel'
              setValue={setProfileValue}
              required={false}
            />
          }

          <div className='flex justify-center gap-5 mt-4'>
            <Button color='secondary' onClick={handleOnClose}>Cerrar</Button>
            <Button color='primary' type='submit' isLoading={isLoading}>{formAction === 'add' ? 'Añadir' : 'Guardar'} Usuario</Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default UserFormModal

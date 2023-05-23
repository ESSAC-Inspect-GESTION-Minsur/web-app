import React, { useContext, type ReactElement, useState, useEffect } from 'react'
import { DriverContext } from '../contexts/DriverContext'
import { PROFILE_DTO_INITIAL_STATE, type ProfileDto } from '@/profiles/models/profile.interface'
import { useDataForm } from '@/shared/hooks/useDataForm'
import { type FormAction } from '@/shared/types'
import { ProfilesService } from '@/profiles/services/profile.service'
import { toast } from 'react-toastify'
import Input from '@/shared/ui/components/Input'
import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'
import Divider from '@/shared/ui/components/Divider'
import { INITIAL_STATE_COMPANY, type Company } from '@/profiles/models/company.interface'
import { CompaniesService } from '@/profiles/services/company.service'
import SelectInput from '@/shared/ui/components/SelectInput'

interface DriverFormModalProps {
  isOpen: boolean
  onClose: () => void
}

const DriverFormModal = ({ isOpen, onClose }: DriverFormModalProps): ReactElement => {
  const { driverForm, setDriverForm, addDriver, updateDriver, toastId, setSelectedDriver } = useContext(DriverContext)

  const [driver, setDriverValue, setDriver, reset] = useDataForm<ProfileDto>(PROFILE_DTO_INITIAL_STATE)

  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<Company>(INITIAL_STATE_COMPANY)

  const [formAction, setFormAction] = useState<FormAction>('add')

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  useEffect(() => {
    if (driverForm === null) {
      setFormAction('add')
      return
    }

    const { name, lastName, dni, license, licenseCategory, licenseExpiration, isDriver, phone1, phone2, email } = driverForm
    setFormAction('update')

    setDriver({
      name,
      lastName,
      dni,
      license,
      licenseCategory,
      licenseExpiration,
      isDriver,
      phone1,
      phone2,
      email
    })
  }, [driverForm])

  useEffect(() => {
    const companiesServices = new CompaniesService()
    void companiesServices.findAll()
      .then((companies) => {
        if (companies.length === 0) return

        setCompanies(companies)
        setSelectedCompany(companies[0])
      })
  }, [])

  const handleCancel = (): void => {
    setDriverForm(null)
    reset()
    onClose()
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setIsSubmitting(true)
    const profilesService = new ProfilesService()

    const submitAction = formAction === 'add' ? profilesService.create : profilesService.update
    const onFinishAction = formAction === 'add' ? addDriver : updateDriver
    const id = formAction === 'add' ? '' : driverForm?.id ?? ''

    driver.isDriver = true

    void submitAction(driver, id)
      .then((response) => {
        if (formAction === 'add') {
          void profilesService.assignCompany(response.id, selectedCompany.id)
            .then((profileWithCompany) => {
              onFinishAction(profileWithCompany)
              if (driverForm) {
                setSelectedDriver(response)
              }
            })
        } else {
          onFinishAction(response)
          if (driverForm) {
            setSelectedDriver(response)
          }
        }

        setDriverForm(null)
        reset()
        onClose()
        toast(`Conductor ${formAction === 'add' ? 'añadido' : 'actualizado'} correctamente`, { toastId, type: 'success' })
      })
      .catch(error => {
        console.log(error)
        const { message } = error.data
        const errorMessage = typeof message === 'object' ? message.join(' ') : message
        toast(errorMessage, { toastId, type: 'error' })
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className='text-center uppercase font-semibold text-xl'>Agregar Conductor</h2>
      <Divider className='mt-0' />
      <form onSubmit={handleSubmit}>
        <Input
          label='Nombre'
          name='name'
          placeholder='Ingresa nombre'
          value={driver.name}
          setValue={setDriverValue}
          type='text'
        />

        <Input
          label='Apellido'
          name='lastName'
          placeholder='Ingresa apellido'
          value={driver.lastName}
          setValue={setDriverValue}
          type='text'
        />

        <Input
          label='DNI'
          name='dni'
          placeholder='Ingresa dni'
          value={driver.dni}
          setValue={setDriverValue}
          type='text'
        />

        {
          formAction === 'add' && companies.length > 0 && (
            <SelectInput<Company>
              label='Empresa'
              name='company'
              objects={companies}
              setValue={(name, value) => {
                const company = companies.find(company => company.id === value)
                if (!company) return
                setSelectedCompany(company)
              }}
              value={selectedCompany.id}
              optionKey='name'
              valueKey='id'
            />
          )
        }

        {
          driver.license !== null &&
          <Input
            label='Licencia'
            name='license'
            placeholder='Ingresa licencia'
            value={driver.license}
            setValue={setDriverValue}
            type='text'
          />
        }

        {
          driver.licenseCategory !== null &&
          <Input
            label='Categoría de Licencia'
            name='licenseCategory'
            placeholder='Ingresa categoría de licencia'
            value={driver.licenseCategory}
            setValue={setDriverValue}
            type='text'
          />
        }

        {
          driver.licenseExpiration !== null &&
          <Input
            label='Fecha de vencimiento de la licencia'
            name='licenseExpiration'
            placeholder=''
            value={new Date(driver.licenseExpiration).toISOString().substring(0, 10)}
            setValue={setDriverValue}
            type='date'
          />
        }

        <div className='mt-3 flex gap-3 justify-end'>
          <Button color='primary' type='submit' isLoading={isSubmitting}>{formAction === 'add' ? 'Añadir' : 'Editar'}</Button>
          <Button color='secondary' onClick={handleCancel}>Cancelar</Button>
        </div>
      </form>
    </Modal>

  )
}

export default DriverFormModal

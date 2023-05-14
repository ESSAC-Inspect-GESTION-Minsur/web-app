import Modal from '@/shared/ui/components/Modal'
import React, { useContext, type ReactElement, useState, useEffect } from 'react'
import { DriverContext } from '../contexts/DriverContext'
import { type Company } from '@/profiles/models/company.interface'
import Button from '@/shared/ui/components/Button'
import SelectInput from '@/shared/ui/components/SelectInput'
import { CompaniesService } from '@/profiles/services/company.service'
import { ProfilesService } from '@/profiles/services/profile.service'
import { toast } from 'react-toastify'

interface AssignCompanyModalProps {
  isOpen: boolean
  onClose: () => void
}

const AssignCompanyModal = ({ isOpen, onClose }: AssignCompanyModalProps): ReactElement => {
  const { toastId, selectedDriver, updateDriver, setSelectedDriver } = useContext(DriverContext)

  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)

  useEffect(() => {
    const companiesServices = new CompaniesService()
    void companiesServices.findAll()
      .then((companies) => {
        if (companies.length === 0) return
        const driverCompanies = selectedDriver?.companies ?? []
        const actualCompaniesIds = driverCompanies.map((company) => company.id)

        const filteredCompanies = companies.filter((company) => !actualCompaniesIds.includes(company.id))
        setCompanies(filteredCompanies)
      })
  }, [])

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    if (!selectedDriver || !selectedCompany) return
    event.preventDefault()

    const profilesService = new ProfilesService()

    void profilesService.assignCompany(selectedDriver.id, selectedCompany.id)
      .then((response) => {
        updateDriver(response)
        setSelectedDriver(response)
        toast('Empresa asignada correctamente', { toastId, type: 'success' })
        onClose()
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='text-center uppercase font-semibold'>
        <h3>Asignar Empresa</h3>
        <p>Conductor: {selectedDriver?.fullName}</p>
      </div>

      {companies.length > 0
        ? (
        <form onSubmit={onSubmit}>
          <SelectInput<Company>
            label='Empresa'
            name='company'
            objects={companies}
            setValue={(name, value) => {
              const company = companies.find((company) => company.id === value)
              if (!company) return
              setSelectedCompany(company)
            }}
            value={selectedCompany?.id ?? ''}
            optionKey='name'
            valueKey='id'
          />

          <div className='flex gap-2 mt-4'>
            <Button color='secondary' onClick={onClose}>Cancelar</Button>
            <Button color='primary' type='submit'>Asignar</Button>
          </div>
        </form>
          )
        : (
        <p className='text-center'>No hay más proyectos registrados</p>
          )
        }
    </Modal>
  )
}

export default AssignCompanyModal

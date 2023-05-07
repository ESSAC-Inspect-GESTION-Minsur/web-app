import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'
import { type Company } from '@/profiles/models/company.interface'
import { CompaniesService } from '@/profiles/services/company.service'
import { VehicleContext } from '../contexts/VehicleContext'
import { VehiclesService } from '@/vehicles/services/vehicles.service'

interface AddVehicleFormProps {
  isOpen: boolean
  onClose: () => void
}

const AssignCompany = ({ isOpen, onClose }: AddVehicleFormProps): ReactElement => {
  const { toastId, selectedVehicle, updateVehicle, setSelectedVehicle } = useContext(VehicleContext)
  const [selectedCompany, setSelectedCompany] = useState<string>('')
  const [companies, setCompanies] = useState<Company[]>([])

  useEffect(() => {
    const companiesService = new CompaniesService()
    void companiesService.findAll()
      .then((response) => {
        const companies = selectedVehicle?.companies ?? []

        const profileCompanies = companies.map((company) => company.id)
        const companiesFiltered = response.filter((company) => !profileCompanies?.includes(company.id))
        setCompanies(companiesFiltered)
        if (companiesFiltered.length > 0) {
          setSelectedCompany(companiesFiltered[0].id)
        }
      })
  }, [selectedVehicle])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const vehiclesService = new VehiclesService()

    vehiclesService.assignCompany(selectedVehicle?.licensePlate ?? '', selectedCompany)
      .then((response) => {
        updateVehicle(response)
        setSelectedVehicle(response)
        toast('Empresa agregada correctamente', { toastId, type: 'success' })
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

    setSelectedCompany(value)
  }

  const inputClass = 'block w-full h-10 px-2 border-b border-solid border-purple-900 outline-none'

  const modal = (): ReactElement => (
    <>
      <div className='mb-4'>
        <p className='text-center uppercase text-xl'><span className='font-bold'>Vehículo seleccionado:</span> {selectedVehicle?.licensePlate}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <select name="area" onChange={handleChange} className={`${inputClass}`}>
          {
            companies.map(company => {
              return (
                <option key={company.id} value={company.id}>{company.name.toUpperCase()}</option>
              )
            })
          }
        </select>

        <div className='flex justify-center gap-5 mt-2'>
          <Button color='secondary' onClick={onClose}>Cancelar</Button>
          <Button color='primary' type='submit'>Agregar</Button>
        </div>
      </form>
    </>
  )

  const assignCompanyMessage = (): ReactElement => (
    <>
      <p className='text-center mb-3 text-lg'>No hay empresas, por favor añade una empresa para asignarla</p>

      <div className='flex justify-center gap-3 items-center'>
        <Button color='secondary' onClick={onClose}>Close</Button>
      </div>
    </>
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} className='w-full min-w-[300px] sm:min-w-[600px]'>
      <div className='p-3'>
        {companies.length > 0 ? modal() : assignCompanyMessage()}
      </div>
    </Modal>
  )
}

export default AssignCompany

import { type Vehicle } from '@/routes/models/vehicle.interface'
import { VehiclesService } from '@/routes/services/vehicle.service'
import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'
import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { VehicleToastContext } from '../../pages/VehiclesView'
import { type Company } from '@/profiles/models/company.interface'
import { CompaniesService } from '@/profiles/services/company.service'

interface AddVehicleFormProps {
  vehicle: Vehicle
  closeModal: () => void
  onFinishSubmit: (vehicle: Vehicle) => void
}

const AddVehicleForm = ({ vehicle, closeModal: close, onFinishSubmit }: AddVehicleFormProps): ReactElement => {
  const toastContext = useContext(VehicleToastContext)

  const [selectedCompany, setSelectedCompany] = useState<string>('')
  const [companies, setCompanies] = useState<Company[]>([])

  useEffect(() => {
    const companiesService = new CompaniesService()
    void companiesService.findAll()
      .then((response) => {
        const profileCompanies = vehicle.companies.map((company) => company.id)
        const companiesFiltered = response.filter((company) => !profileCompanies?.includes(company.id))
        setCompanies(companiesFiltered)
        if (companiesFiltered.length > 0) {
          setSelectedCompany(companiesFiltered[0].id)
        }
      })
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const vehiclesService = new VehiclesService()

    vehiclesService.assignCompany(vehicle.licensePlate, selectedCompany)
      .then((response) => {
        onFinishSubmit(response)
        toast('Empresa agregada correctamente', { toastId: toastContext.id, type: 'success' })
        close()
      })
      .catch((error) => {
        console.log(error)
        toast('Hubo un error, intente más tarde', { toastId: toastContext.id, type: 'error' })
        close()
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
        <p className='text-center uppercase text-xl'><span className='font-bold'>Vehiculo seleccionado:</span> {vehicle.licensePlate}</p>
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
          <Button color='secondary' onClick={close}>Cancelar</Button>
          <Button color='primary' type='submit'>Agregar</Button>
        </div>
      </form>
    </>
  )

  const assignCompanyMessage = (): ReactElement => (
    <>
      <p className='text-center mb-3 text-lg'>No hay empresas, por favor añade una empresa para asignarla</p>

      <div className='flex justify-center gap-3 items-center'>
        <Button color='secondary' onClick={close}>Close</Button>
      </div>
    </>
  )

  return (
    <Modal>
      <div className='w-full min-w-[300px] sm:min-w-[600px] p-3'>
        {companies.length > 0 ? modal() : assignCompanyMessage()}
      </div>
    </Modal>
  )
}

export default AddVehicleForm

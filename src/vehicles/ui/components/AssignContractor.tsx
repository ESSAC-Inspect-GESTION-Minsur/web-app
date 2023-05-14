import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'
import { type Contractor } from '@/profiles/models/contractor.interface'
import { ContractorsService } from '@/profiles/services/contractor.service'
import { VehicleContext } from '../contexts/VehicleContext'
import { VehiclesService } from '@/vehicles/services/vehicles.service'

interface AddVehicleFormProps {
  isOpen: boolean
  onClose: () => void
}

const AssignContractor = ({ isOpen, onClose }: AddVehicleFormProps): ReactElement => {
  const { toastId, selectedVehicle, updateVehicle, setSelectedVehicle } = useContext(VehicleContext)
  const [selectedContractor, setSelectedContractor] = useState<string>('')
  const [contractors, setContractors] = useState<Contractor[]>([])

  useEffect(() => {
    const contractorsService = new ContractorsService()
    void contractorsService.findAll()
      .then((response) => {
        const contractors = selectedVehicle?.contractors ?? []

        const profileContractors = contractors.map((contractor) => contractor.id)
        const contractorsFiltered = response.filter((contractor) => !profileContractors?.includes(contractor.id))
        setContractors(contractorsFiltered)
        if (contractorsFiltered.length > 0) {
          setSelectedContractor(contractorsFiltered[0].id)
        }
      })
  }, [selectedVehicle])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const vehiclesService = new VehiclesService()

    vehiclesService.assignContractor(selectedVehicle?.licensePlate ?? '', selectedContractor)
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

    setSelectedContractor(value)
  }

  const inputClass = 'block w-full h-10 px-2 border-b border-solid border-purple-900 outline-none'

  const modal = (): ReactElement => (
    <>
      <div className='mb-4'>
        <p className='text-center uppercase font-bold text-xl'>Asignar Empresa Contratante</p>
        <p className='text-center uppercase text-xl'><span className='font-bold'>Vehículo seleccionado:</span> {selectedVehicle?.licensePlate}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <select name="sponsor" onChange={handleChange} className={`${inputClass}`}>
          {
            contractors.map(contractor => {
              return (
                <option key={contractor.id} value={contractor.id}>{contractor.name.toUpperCase()}</option>
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

  const assignContractorMessage = (): ReactElement => (
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
        {contractors.length > 0 ? modal() : assignContractorMessage()}
      </div>
    </Modal>
  )
}

export default AssignContractor

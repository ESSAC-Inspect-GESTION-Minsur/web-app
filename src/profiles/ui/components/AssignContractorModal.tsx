import React, { useContext, type ReactElement, useState, useEffect } from 'react'
import Modal from '@/shared/ui/components/Modal'
import Button from '@/shared/ui/components/Button'
import SelectInput from '@/shared/ui/components/SelectInput'
import { CompaniesService } from '@/profiles/services/company.service'
import { toast } from 'react-toastify'
import { CompanyContext } from '../contexts/CompanyContext'
import { type Contractor } from '@/profiles/models/contractor.interface'
import { ContractorsService } from '@/profiles/services/contractor.service'

interface AssignCompanyModalProps {
  isOpen: boolean
  onClose: () => void
}

const AssignCompanyModal = ({ isOpen, onClose }: AssignCompanyModalProps): ReactElement => {
  const { toastId, selectedCompany, updateCompany, setSelectedCompany } = useContext(CompanyContext)

  const [contractors, setContractors] = useState<Contractor[]>([])
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null)

  useEffect(() => {
    const contractorsService = new ContractorsService()
    void contractorsService.findAll()
      .then((contractors) => {
        if (contractors.length === 0) return
        const companyContractors = selectedCompany?.contractors ?? []
        console.log(companyContractors)
        const actualContractorsIds = companyContractors.map((contractor) => contractor.id)

        const filteredContractors = contractors.filter((company) => !actualContractorsIds.includes(company.id))
        setContractors(filteredContractors)
      })
  }, [selectedCompany])

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    if (!selectedCompany || !selectedContractor) return
    event.preventDefault()

    const companiesService = new CompaniesService()

    void companiesService.assignContractor(selectedCompany.id, selectedContractor.id)
      .then((response) => {
        updateCompany(response)
        setSelectedCompany(response)
        toast('Empresa contratante asignada correctamente', { toastId, type: 'success' })
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
        <h3>Asignar Empresa contratante</h3>
        <p>Empresa transportista: {selectedCompany?.name}</p>
      </div>

      {contractors.length > 0
        ? (
        <form onSubmit={onSubmit}>
          <SelectInput<Contractor>
            label='Empresa'
            name='company'
            objects={contractors}
            setValue={(name, value) => {
              const contractor = contractors.find((contractor) => contractor.id === value)
              if (!contractor) return
              setSelectedContractor(contractor)
            }}
            value={selectedContractor?.id ?? ''}
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
        <p className='text-center'>No hay empresas contratantes registrados</p>
          )
        }
    </Modal>
  )
}

export default AssignCompanyModal

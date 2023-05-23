import React, { useState, type ReactElement, useEffect } from 'react'
import Divider from '@/shared/ui/components/Divider'
import Toast from '@/shared/ui/components/Toast'
import { useArrayReducer } from '@/shared/hooks/useArrayReducer'
import { type Contractor } from '@/profiles/models/contractor.interface'
import { ContractorsService } from '@/profiles/services/contractor.service'
import { ContractorContext } from '../contexts/ContractorContext'
import ContractorTable from '../components/ContractorTable'
import ContractorForm from '../components/ContractorForm'
import Button from '@/shared/ui/components/Button'
import ImportModal from '@/admin/ui/components/ImportModal'
import { useBooleanState } from '@/shared/hooks/useBooleanState'

const TOAST_ID = 'contractors-view'

const ContractorsView = (): ReactElement => {
  const [contractors, setContractor, addContractor, updateContractor, removeContractor] = useArrayReducer<Contractor>([])

  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null)
  const [contractorForm, setContractorForm] = useState<Contractor | null>(null)

  const [showImportModal, toggleShowImportModal] = useBooleanState()

  useEffect(() => {
    const contractorsService = new ContractorsService()
    void contractorsService.findAll()
      .then(setContractor)
  }, [])

  const refreshImportedContractor = (newContractor: Contractor[]): void => {
    setContractor([...contractors, ...newContractor])
  }

  return (
    <ContractorContext.Provider value={{
      contractors,
      addContractor,
      updateContractor,
      removeContractor,
      selectedContractor,
      setSelectedContractor,
      contractorForm,
      setContractorForm,
      toastId: TOAST_ID
    }}>
      <div className='container-page'>
        <section className='flex justify-between items-center'>
          <h1 className='text-blue-era uppercase text-2xl font-semibold'>Contratantes</h1>
          <Button color='primary' onClick={toggleShowImportModal}>Importar Excel</Button>
        </section>
        <Divider></Divider>
        <div className='w-[90%] mx-auto'>
          <div className='flex flex-col gap-10 md:flex-row'>
            <div className='order-2 md:order-1 md:w-[70%]'>
              <ContractorTable />
            </div>
            <aside className='md:w-[30%] md:order-2'>
              <ContractorForm />
            </aside>
          </div>
        </div>

      </div>

      <ImportModal isOpen={showImportModal} onClose={toggleShowImportModal} onSuccess={refreshImportedContractor} toastId={TOAST_ID} type='contractor' />

      <Toast id={TOAST_ID} />

    </ContractorContext.Provider>
  )
}

export default ContractorsView

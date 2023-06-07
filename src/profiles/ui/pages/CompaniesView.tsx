import React, { useState, type ReactElement, useEffect } from 'react'
import Divider from '@/shared/ui/components/Divider'
import Toast from '@/shared/ui/components/Toast'
import { useArrayReducer } from '@/shared/hooks/useArrayReducer'
import { type Company } from '@/profiles/models/company.interface'
import { CompaniesService } from '@/profiles/services/company.service'
import Button from '@/shared/ui/components/Button'
import { CompanyContext } from '../contexts/CompanyContext'
import CompaniesTable from '../components/CompaniesTable'
import CompaniesForm from '../components/CompaniesForm'
import ImportModal from '@/admin/ui/components/ImportModal'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import AssignContractorModal from '../components/AssignContractorModal'

const TOAST_ID = 'companies-view'

const CompaniesView = (): ReactElement => {
  const [companies, setCompanies, addCompany, updateCompany, removeCompany] = useArrayReducer<Company>([])

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [companyForm, setCompanyForm] = useState<Company | null>(null)

  const [showImportModal, toggleShowImportModal] = useBooleanState()
  const [showImportAssignContractorModal, toggleShowImportAssignContractorModal] = useBooleanState()
  const [showAssignContractorModal, toggleShowAssignContractorModal] = useBooleanState()

  useEffect(() => {
    const companiesService = new CompaniesService()
    void companiesService.findAll()
      .then(setCompanies)
  }, [])

  const refreshImportedCompanies = (newCompanies: Company[]): void => {
    console.log('newCompanies', newCompanies)
    setCompanies([...companies, ...newCompanies])
  }

  const refreshImportedCompanyWithContractors = (newCompanies: Company[]): void => {
    setCompanies(companies.map(company => {
      const newCompany = newCompanies.find(newCompany => newCompany.id === company.id)
      return newCompany ?? company
    }))
  }

  return (
    <CompanyContext.Provider value={{
      companies,
      addCompany,
      updateCompany,
      removeCompany,
      selectedCompany,
      setSelectedCompany,
      companyForm,
      setCompanyForm,
      toastId: TOAST_ID
    }}>
      <div className='container-page'>
        <section className='flex justify-between items-center'>
          <h1 className='text-blue-era uppercase text-2xl font-semibold'>Empresas Transporte</h1>
          <div className="flex gap-2">
            <Button color='primary' onClick={toggleShowImportModal}>Importar Excel</Button>
            <Button color='primary' onClick={toggleShowImportAssignContractorModal}>Importar Asignar Contratantes</Button>
          </div>
        </section>
        <Divider></Divider>
        <div className='mx-auto'>
          <div className='flex flex-col gap-10 md:flex-row'>
            <div className='order-2 md:order-1 md:w-[70%]'>
              <CompaniesTable toggleShowAssignContractorModal={toggleShowAssignContractorModal} />
            </div>
            <aside className='md:w-[30%] md:order-2'>
              <CompaniesForm />
            </aside>
          </div>
        </div>

      </div>

      <ImportModal isOpen={showImportModal} onClose={toggleShowImportModal} onSuccess={refreshImportedCompanies} toastId={TOAST_ID} type='company' />
      <ImportModal isOpen={showImportAssignContractorModal} onClose={toggleShowImportAssignContractorModal} onSuccess={refreshImportedCompanyWithContractors} toastId={TOAST_ID} type='assign-company-contractor' />

      <AssignContractorModal isOpen={showAssignContractorModal} onClose={toggleShowAssignContractorModal} />

      <Toast id={TOAST_ID} />

    </CompanyContext.Provider>
  )
}

export default CompaniesView

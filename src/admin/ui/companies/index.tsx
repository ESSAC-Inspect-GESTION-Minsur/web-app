import React, { useState, type ReactElement, useEffect } from 'react'
import Divider from '@/shared/ui/components/Divider'
import Toast from '@/shared/ui/components/Toast'
import { CompanyContext } from './context'
import { useArrayReducer } from '@/shared/hooks/useArrayReducer'
import { type Company } from '@/profiles/models/company.interface'
import { CompaniesService } from '@/profiles/services/company.service'
import CompaniesTable from './components/CompaniesTable'
import CompaniesForm from './components/CompaniesForm'
import ImportModal from '../components/ImportModal'
import Button from '@/shared/ui/components/Button'

const TOAST_ID = 'companies-view'

const CompaniesView = (): ReactElement => {
  const [companies, setCompanys, addCompany, updateCompany, removeCompany] = useArrayReducer<Company>([])

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [companyForm, setCompanyForm] = useState<Company | null>(null)

  const [showImportModal, setShowImportModal] = useState<boolean>(false)

  useEffect(() => {
    const companiesService = new CompaniesService()
    void companiesService.findAll()
      .then(setCompanys)
  }, [])

  const refreshImportedCompanies = (newCompanies: Company[]): void => {
    setCompanys([...companies, ...newCompanies])
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
          <h1 className='text-blue-era uppercase text-2xl font-semibold'>Empresas</h1>
          <Button color='primary' onClick={() => { setShowImportModal(true) }}>Importar Excel</Button>
        </section>
        <Divider></Divider>
        <div className='w-[90%] mx-auto'>
          <div className='flex flex-col gap-10 md:flex-row'>
            <div className='order-2 md:order-1 md:w-[70%]'>
              <CompaniesTable />
            </div>
            <aside className='md:w-[30%] md:order-2'>
              <CompaniesForm />
            </aside>
          </div>
        </div>

      </div>

      {showImportModal && <ImportModal close={() => { setShowImportModal(false) }} refreshList={refreshImportedCompanies} toastId={TOAST_ID} type='company' />}

      <Toast id={TOAST_ID} />

    </CompanyContext.Provider>
  )
}

export default CompaniesView

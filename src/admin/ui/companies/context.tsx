import { type Company } from '@/profiles/models/company.interface'
import React from 'react'

interface CompanyContextInterface {
  toastId: string

  companies: Company[]
  addCompany: (company: Company) => void
  updateCompany: (company: Company) => void
  removeCompany: (id: string) => void

  selectedCompany: Company | null
  setSelectedCompany: (company: Company | null) => void

  companyForm: Company | null
  setCompanyForm: (companyForm: Company | null) => void
}

export const CompanyContext = React.createContext<CompanyContextInterface>({
  toastId: '',
  companies: [],
  addCompany: () => { },
  updateCompany: () => { },
  removeCompany: () => { },
  selectedCompany: null,
  setSelectedCompany: () => { },
  companyForm: null,
  setCompanyForm: () => { }
})

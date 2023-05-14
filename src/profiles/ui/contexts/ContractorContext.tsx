import { type Contractor } from '@/profiles/models/contractor.interface'
import React from 'react'

interface ContractorContextInterface {
  toastId: string

  contractors: Contractor[]
  addContractor: (contractor: Contractor) => void
  updateContractor: (contractor: Contractor) => void
  removeContractor: (id: string) => void

  selectedContractor: Contractor | null
  setSelectedContractor: (contractor: Contractor | null) => void

  contractorForm: Contractor | null
  setContractorForm: (contractorForm: Contractor | null) => void
}

export const ContractorContext = React.createContext<ContractorContextInterface>({
  toastId: '',
  contractors: [],
  addContractor: () => { },
  updateContractor: () => { },
  removeContractor: () => { },
  selectedContractor: null,
  setSelectedContractor: () => { },
  contractorForm: null,
  setContractorForm: () => { }
})

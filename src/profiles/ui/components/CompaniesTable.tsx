import React, { useContext, type ReactElement } from 'react'
import Table, { type Action, type Column } from '@/shared/ui/components/table/Table'
import { type Company } from '@/profiles/models/company.interface'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import { CompaniesService } from '@/profiles/services/company.service'
import { toast } from 'react-toastify'
import { CompanyContext } from '../contexts/CompanyContext'
import AdminIcon from '@/shared/ui/assets/icons/AdminIcon'

interface CompaniesTableProps {
  toggleShowAssignContractorModal: () => void
}

const CompaniesTable = ({ toggleShowAssignContractorModal }: CompaniesTableProps): ReactElement => {
  const { companies, setSelectedCompany, setCompanyForm, removeCompany, toastId } = useContext(CompanyContext)

  const AREAS_COLUMNS: Array<Column<Company>> = [
    {
      id: 'name',
      columnName: 'Nombre',
      filterFunc: (company) => company.name,
      render: (company) => company.name.toUpperCase(),
      sortFunc: (a, b) => a.name > b.name ? 1 : -1
    },
    {
      id: 'ruc',
      columnName: 'RUC',
      filterFunc: (company) => company.ruc,
      render: (company) => company.ruc,
      sortFunc: (a, b) => a.ruc > b.ruc ? 1 : -1
    },
    {
      id: 'contractors',
      columnName: 'Contratantes',
      filterFunc: (company) => company.contractors.map(contractor => contractor.name).join(' '),
      render: (company) => {
        const contractors = company.contractors

        if (contractors.length <= 0) {
          return 'No hay contratantes asignados'
        }

        const filteredArray = contractors.filter(
          (obj, index, self) => index === self.findIndex((o) => o.id === obj.id)
        )

        return (
          <select className='block w-full h-10 px-2 rounded-t-md border-b border-solid border-blue-dark outline-none capitalize'>
            {
              ...filteredArray.map((contractor) => (
                <option key={contractor.id}>{contractor.name}</option>
              ))
            }
          </select>
        )
      }
    },
    {
      id: 'status',
      columnName: 'Estado',
      filterFunc: (company) => company.active ? 'ACTIVO' : 'NO ACTIVO',
      render: (company) => company.active ? 'Activo' : 'No Activo',
      sortFunc: (a, b) => {
        const statusA = a.active ? 'ACTIVO' : 'NO ACTIVO'
        const statusB = b.active ? 'ACTIVO' : 'NO ACTIVO'

        return statusA > statusB ? 1 : -1
      }
    }
  ]

  const PAGINATION = [5, 10, 15, 20]

  const update = (company: Company): void => {
    setSelectedCompany(company)
    setCompanyForm(company)
  }

  const remove = (company: Company): void => {
    const companiesService = new CompaniesService()
    const result = confirm(`Estas seguro que quieres eliminar la empresa ${company.name}`)
    if (!result) return

    const id = company.id
    void companiesService.remove(id)
      .then(response => {
        removeCompany(id)
        toast('Empresa eliminado correctamente', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  const assignContractor = (company: Company): void => {
    setSelectedCompany(company)
    toggleShowAssignContractorModal()
  }

  const COMPANY_ACTIONS: Array<Action<Company>> = [
    {
      icon: () => (<EditIcon className='cursor-pointer w-5 h-5' />),
      actionFunc: update
    },
    {
      icon: () => (<DeleteIcon className='cursor-pointer w-5 h-5 text-red' />),
      actionFunc: remove
    },
    {
      icon: () => (<AdminIcon className='cursor-pointer w-5 h-5 text-blue' />),
      actionFunc: assignContractor
    }
  ]

  return (
    <main>
      <Table
        data={companies}
        columns={AREAS_COLUMNS}
        pagination={PAGINATION}
        showFilter={false}
        actions={COMPANY_ACTIONS}
        />
    </main>
  )
}

export default CompaniesTable

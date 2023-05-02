import React, { useContext, type ReactElement } from 'react'
import Table, { type Action, type Column } from '@/shared/ui/components/table/Table'
import { type Company } from '@/profiles/models/company.interface'
import { CompanyContext } from '../context'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import { CompaniesService } from '@/profiles/services/company.service'
import { toast } from 'react-toastify'

const CompaniesTable = (): ReactElement => {
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

  const COMPANY_ACTIONS: Array<Action<Company>> = [
    {
      icon: () => (<EditIcon className='cursor-pointer w-5 h-5' />),
      actionFunc: update
    },
    {
      icon: () => (<DeleteIcon className='cursor-pointer w-5 h-5 text-red' />),
      actionFunc: remove
    }
  ]

  return (
    <main className='shadow-card px-6 py-6 bg-white'>
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

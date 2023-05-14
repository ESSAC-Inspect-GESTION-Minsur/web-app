import React, { useContext, type ReactElement } from 'react'
import Table, { type Action, type Column } from '@/shared/ui/components/table/Table'
import { type Contractor } from '@/profiles/models/contractor.interface'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import { ContractorsService } from '@/profiles/services/contractor.service'
import { toast } from 'react-toastify'
import { ContractorContext } from '../contexts/ContractorContext'

const ContractorsTable = (): ReactElement => {
  const { contractors, setSelectedContractor, setContractorForm, removeContractor, toastId } = useContext(ContractorContext)

  const AREAS_COLUMNS: Array<Column<Contractor>> = [
    {
      id: 'name',
      columnName: 'Nombre',
      filterFunc: (contractor) => contractor.name,
      render: (contractor) => contractor.name.toUpperCase(),
      sortFunc: (a, b) => a.name > b.name ? 1 : -1
    },
    {
      id: 'status',
      columnName: 'Estado',
      filterFunc: (contractor) => contractor.active ? 'ACTIVO' : 'NO ACTIVO',
      render: (contractor) => contractor.active ? 'Activo' : 'No Activo',
      sortFunc: (a, b) => {
        const statusA = a.active ? 'ACTIVO' : 'NO ACTIVO'
        const statusB = b.active ? 'ACTIVO' : 'NO ACTIVO'

        return statusA > statusB ? 1 : -1
      }
    }
  ]

  const PAGINATION = [5, 10, 15, 20]

  const update = (contractor: Contractor): void => {
    setSelectedContractor(contractor)
    setContractorForm(contractor)
  }

  const remove = (contractor: Contractor): void => {
    const contractorsService = new ContractorsService()
    const result = confirm(`Estas seguro que quieres eliminar la empresa ${contractor.name}`)
    if (!result) return

    const id = contractor.id
    void contractorsService.remove(id)
      .then(response => {
        removeContractor(id)
        toast('Empresa eliminado correctamente', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  const COMPANY_ACTIONS: Array<Action<Contractor>> = [
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
    <main>
      <Table
        data={contractors}
        columns={AREAS_COLUMNS}
        pagination={PAGINATION}
        showFilter={false}
        actions={COMPANY_ACTIONS}
        />
    </main>
  )
}

export default ContractorsTable

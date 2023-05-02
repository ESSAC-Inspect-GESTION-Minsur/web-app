import { SortIconAsc, SortIconDesc } from '@/shared/ui/components/table/SortIcons'
import React, { type ReactElement, useContext } from 'react'
import { type Column } from './Table'
import TableContext from './TableContext'

interface TableHeaderProps {
  columns: Array<Column<any>>
  hasActions: boolean
}

const TableHeader = ({ columns, hasActions }: TableHeaderProps): ReactElement => {
  const { sortColumn, sortDirection, setSortColumn, setSortDirection } = useContext(TableContext)

  const onClick = (newColumn: Column<any>): void => {
    if (newColumn.sortFunc === undefined) {
      return
    }

    if (sortColumn?.id === newColumn.id) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
      return
    }
    setSortColumn(newColumn)
  }

  const sortIcon = (column: Column<any>): React.ReactElement => {
    if (sortColumn?.id !== column.id) return (<span></span>)
    const className = 'text-white w-6 h-6'
    return sortDirection === 'asc' ? <SortIconAsc className={className} /> : <SortIconDesc className={className} />
  }

  const tableHeadStyle = 'text-sm font-medium text-white px-6 py-4 capitalize'

  return (
    <thead className='border-b bg-black'>
      <tr>
        {
          columns?.map((column, index) => (
            <th key={index} onClick={() => { onClick(column) }} className={`${tableHeadStyle} ${column.sortFunc !== undefined ? 'cursor-pointer' : ''}`}>
              <p className='flex items-center justify-center gap-4'>
                {column.columnName.toUpperCase()}
                {sortIcon(column)}
              </p>
            </th>
          ))
        }
        {
          hasActions && <th className={tableHeadStyle}>Acciones</th>
        }
      </tr>
    </thead>
  )
}

export default TableHeader

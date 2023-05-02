import React from 'react'
import { type Column } from './Table'

export type SortDirection = 'asc' | 'desc'

interface TableContextInterface {
  filterValue: string
  setFilterValue: React.Dispatch<React.SetStateAction<string>>
  filterColumn: Column<any> | null
  setFilterColumn: React.Dispatch<React.SetStateAction<Column<any> | null>>
  sortColumn: Column<any> | null
  setSortColumn: React.Dispatch<React.SetStateAction<Column<any> | null>>
  sortDirection: SortDirection
  setSortDirection: React.Dispatch<React.SetStateAction<SortDirection>>
  pageCount: number
  pageSize: number
  setPageSize: React.Dispatch<React.SetStateAction<number>>
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
}

const TableContext = React.createContext<TableContextInterface>({
  filterValue: '',
  setFilterValue: () => {},
  filterColumn: null,
  setFilterColumn: () => {},
  sortColumn: null,
  setSortColumn: () => {},
  sortDirection: 'asc',
  setSortDirection: () => {},
  pageCount: 0,
  pageSize: 0,
  setPageSize: () => {},
  page: 0,
  setPage: () => {}
})

export default TableContext

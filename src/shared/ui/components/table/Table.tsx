import React, { type ReactElement, useEffect, useMemo, useState } from 'react'
import Filter from './TableFilter'
import Pagination from './Pagination'
import TableBody from './TableBody'
import TableContext, { type SortDirection } from './TableContext'
import TableHeader from './TableHeader'

export interface Column<T> {
  id: string
  columnName: string
  filterFunc: (entity: T) => string
  sortFunc?: (a: T, b: T) => number
  render: (entity: T) => React.ReactElement | string
}

export interface Action<T> {
  icon: (entity: T) => React.ReactNode
  actionFunc: (entity: T) => void
}

interface TableProps {
  data: any[]
  columns: Array<Column<any>>
  pagination?: number[]
  showFilter?: boolean
  actions?: Array<Action<any>>
  onRowClick?: (entity: any) => void
}

const Table = ({ data, columns, pagination, showFilter = true, actions, onRowClick }: TableProps): ReactElement => {
  const [filterValue, setFilterValue] = useState<string>('')
  const [filterColumn, setFilterColumn] = useState<Column<any> | null>(columns[0] ? columns[0] : null)

  const [sortColumn, setSortColumn] = useState<Column<any> | null>(columns[0] ? columns[0] : null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const [pageCount, setPageCount] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(0)
  const [page, setPage] = useState<number>(0)

  const [pageSizes, setPageSizes] = useState<number[]>([])

  useEffect(() => {
    const paginationWithOutNegatives = pagination ? pagination.filter(pageSize => pageSize > 0) : []
    paginationWithOutNegatives.sort((a, b) => a - b)

    setPageSizes(paginationWithOutNegatives)
    setPageSize(paginationWithOutNegatives[0] ?? 0)
  }, [])

  useEffect(() => {
    setPage(0)
    setPageCount(Math.ceil(data.length / pageSize))
  }, [pageSize])

  useEffect(() => {
    setFilterValue('')
  }, [showFilter])

  const filteredData = useMemo(() => {
    let filtered = data

    if (filterValue) {
      filtered = data.filter(a => filterColumn?.filterFunc(a).toLocaleLowerCase().includes(filterValue.toLocaleLowerCase()))
      setPageCount(Math.ceil(filtered.length / pageSize))
    } else {
      setPageCount(Math.ceil(data.length / pageSize))
    }

    if (sortColumn) {
      const sort = sortDirection === 'asc' ? 1 : -1
      const filteredSorted = [...filtered]
      filteredSorted.sort((a, b) => {
        const order = sortColumn.sortFunc !== undefined ? sortColumn.sortFunc(a, b) : 1
        return order * sort
      })

      filtered = [...filteredSorted]
    }

    if (pageSize !== 0) {
      const firstIndex = page * pageSize
      const lastIndex = (firstIndex + pageSize) > filtered.length ? filtered.length : (firstIndex + pageSize)
      filtered = filtered.slice(firstIndex, lastIndex)
    }

    return filtered
  }, [data, filterValue, filterColumn, sortColumn, sortDirection, page, pageSize])

  return (

    <div className='mb-6'>
      <TableContext.Provider value={{ filterValue, setFilterValue, filterColumn, setFilterColumn, sortColumn, setSortColumn, sortDirection, setSortDirection, pageCount, page, setPage, pageSize, setPageSize }}>
        {showFilter && <Filter columns={columns} />}

        <div className='overflow-x-auto'>
          <div className='inline-block min-w-full'>
            <div className='overflow-hidden'>
              <table className='min-w-full text-center'>
                <TableHeader columns={columns} hasActions={actions !== undefined} />
                <TableBody data={filteredData} columns={columns} actions={actions} onRowClick={onRowClick} />
              </table>
            </div>
          </div>
        </div>

        {pagination && <Pagination pagination={pageSizes} />}
      </TableContext.Provider>
    </div>

  )
}

export default Table

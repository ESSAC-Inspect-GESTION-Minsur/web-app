import React, { Fragment, type ReactElement, useContext } from 'react'
import { type Column } from './Table'
import TableContext from './TableContext'

interface FilterProps {
  columns: Array<Column<any>>
}

const Filter = ({ columns }: FilterProps): ReactElement => {
  const { filterValue, setFilterValue, filterColumn, setFilterColumn } = useContext(TableContext)

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target
    setFilterValue(value)
  }

  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.target

    const column = columns.find(column => column.id === value)
    setFilterColumn(column ?? null)
    setFilterValue('')
  }

  return (
    <Fragment>
      <div className='flex items-end gap-5 mt-5'>
        <div className='grid grid-cols-filter w-3/4'>
          <p className='font-medium uppercase'>Columna a filtrar</p>
          <input
            type="text"
            value={filterValue}
            className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none'
            placeholder='Ingresa el valor a filtrar'
            onChange={onInputChange}
          />
        </div>
        <div className='w-1/4'>
          <select
            value={filterColumn?.id}
            onChange={onSelectChange}
            className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none uppercase'
          >
            {
              columns.map(column => (
                <option key={column.id} value={column.id}>{column.columnName.toUpperCase()}</option>
              ))
            }
          </select>
        </div>
      </div>
      <div className='w-full border-b-2 my-3'></div>
    </Fragment>

  )
}

export default Filter

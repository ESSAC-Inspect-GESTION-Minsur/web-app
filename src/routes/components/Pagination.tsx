import React, { type ReactElement } from 'react'

export interface PaginationButton {
  disabled: boolean
  onClick: () => void
  icon: ReactElement
}

export interface PageOptions {
  pageIndex: number
  pageSize: number
  length: number
  setPageSize: (page: number) => void
}

interface PaginationProps {
  buttons: PaginationButton[]
  pageOptions: PageOptions
}

const Pagination = ({ buttons, pageOptions }: PaginationProps): ReactElement => {
  const paginationButtonStyle = 'grid place-items-center py-1 rounded-lg text-white px-2 cursor-pointer '
  const PAGE_SIZE = [5, 10, 15, 20]

  return (
    <div className="flex flex-col items-center justify-center mt-4 md:flex-row md:justify-between">
      <div className=' w-full flex flex-row gap-4 items-center justify-center md:w-auto'>
        <div className='flex flex-row gap-2 items-center justify-center'>
          {
            buttons.map(({ disabled, icon, onClick }, i) => (
              <button key={i}
                className={`${paginationButtonStyle} ${disabled ? 'bg-red' : 'bg-red-dark cursor-default'}`}
                onClick={onClick} disabled={!disabled}>
                {icon}
              </button>
            ))
          }
        </div>
        <span>
          Página{' '}
          <strong>
            {pageOptions.pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
      </div>
      <select
        value={pageOptions.pageSize}
        onChange={e => {
          pageOptions.setPageSize(Number(e.target.value))
        }}
        className='cursor-pointer w-[80%] block h-10 px-2 border-b border-solid border-blue-dark outline-none md:w-auto'
      >
        {PAGE_SIZE.map(pageSize => (
          <option key={pageSize} value={pageSize}>
            Mostrar {pageSize}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Pagination

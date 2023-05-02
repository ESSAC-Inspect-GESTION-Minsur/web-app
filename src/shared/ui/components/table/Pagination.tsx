import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { BackIcon, DoubleBackIcon, DoubleForwardIcon, ForwardIcon } from './PaginationIcons'
import TableContext from './TableContext'

interface PaginationButton {
  disabled: boolean
  onClick: () => void
  icon: ReactElement
}

interface PaginationProps {
  pagination: number[]
}

const Pagination = ({ pagination }: PaginationProps): ReactElement => {
  const { page, pageCount, pageSize, setPage, setPageSize } = useContext(TableContext)
  const [canPreviousPage, setCanPreviousPage] = useState<boolean>(false)
  const [canNextPage, setCanNextPage] = useState<boolean>(true)

  useEffect(() => {
    if (page > pageCount - 1) {
      setPage(pageCount)
    }
    setCanPreviousPage(page - 1 > -1)
    setCanNextPage(page + 1 < pageCount)
  }, [page, pageCount])
  const goToPage = (page: number): void => {
    setPage(page)
  }

  const nextPage = (): void => {
    setPage(page + 1)
  }

  const previousPage = (): void => {
    setPage(page - 1)
  }

  const buttons: PaginationButton[] = [
    {
      disabled: canPreviousPage,
      onClick: () => { goToPage(0) },
      icon: <DoubleBackIcon className='w-5 h-5' />
    },
    {
      disabled: canPreviousPage,
      onClick: () => { previousPage() },
      icon: <BackIcon className='w-5 h-5' />
    },
    {
      disabled: canNextPage,
      onClick: () => { nextPage() },
      icon: <ForwardIcon className='w-5 h-5' />
    },
    {
      disabled: canNextPage,
      onClick: () => { goToPage(pageCount - 1) },
      icon: <DoubleForwardIcon className='w-5 h-5' />
    }
  ]

  const paginationButtonStyle = 'grid place-items-center py-1 rounded-lg text-white px-2 cursor-pointer '
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
            {page + 1} of {pageCount}
          </strong>
        </span>
      </div>
      <select
        value={pageSize}
        onChange={e => {
          setPageSize(Number(e.target.value))
        }}
        className='cursor-pointer w-[80%] block h-10 px-2 border-b border-solid border-blue-dark outline-none md:w-auto'
      >
        {pagination.map(pageSize => (
          <option key={pageSize} value={pageSize}>
            Mostrar {pageSize}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Pagination

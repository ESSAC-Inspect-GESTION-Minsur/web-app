import React, { type ReactElement } from 'react'
import { type Action, type Column } from './Table'

interface TableBodyProps {
  data: any[]
  columns: Array<Column<any>>
  actions?: Array<Action<any>>
  onRowClick?: (entity: any) => void
}

const TableBody = ({ data, columns, actions, onRowClick }: TableBodyProps): ReactElement => {
  const tableBodyStyle = 'text-sm text-gray-900 font-light px-6 py-4'

  const onClick = (entity: any): void => {
    if (onRowClick) {
      onRowClick(entity)
    }
  }

  return (
    <tbody>
      {
        data.map((value, index) => (
          <tr key={index} onClick={() => { onClick(value) }} className={`bg-white border-b ${onRowClick ? 'transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer' : ''}`}>
            {
              columns?.map((column, index) => (
                <td key={index} className={tableBodyStyle}>{column.render(value)}</td>
              ))
            }

            {actions &&
              (
                <td className={tableBodyStyle}>
                  <div className='flex justify-center items-center gap-2 py-3'>
                    {
                      actions?.map((action, index) => (
                        <div key={index} onClick={() => { action.actionFunc(value) }}>
                          {
                            action.icon(value)
                          }
                        </div>
                      ))
                    }
                  </div>

                </td>
              )
            }
          </tr>
        ))

      }
    </tbody>
  )
}

export default TableBody

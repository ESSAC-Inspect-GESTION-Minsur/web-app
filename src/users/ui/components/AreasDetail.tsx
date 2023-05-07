import React, { useContext, type ReactElement, Fragment } from 'react'
import { AreaContext } from '../contexts/AreaContext'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import { type Area } from '@/users/models/area.interface'

const AreasDetail = (): ReactElement => {
  const { areas, setSelectedArea, setAreaForm } = useContext(AreaContext)

  const handleOnAreaClick = (area: Area): void => {
    setSelectedArea(area)
  }

  const handleOnEditClick = (area: Area): void => {
    setAreaForm(area)
  }

  return (
    <Fragment>
      {
        areas.map(area => (
          <div key={area.id}
            onClick={() => { handleOnAreaClick(area) }}
            className={'w-full flex justify-between items-center py-2 border-b-2 last-of-type:border-b-0'}>
            <p className='px-2 uppercase'>{area.name}</p>
            <div className='flex gap-3 px-2'>
              <EditIcon className='cursor-pointer w-5 h-5' onClick={() => { handleOnEditClick(area) }} />
            </div>
          </div>
        ))
      }
      {areas.length <= 0 && (<p>No hay areas creadas</p>)}
    </Fragment>

  )
}

export default AreasDetail

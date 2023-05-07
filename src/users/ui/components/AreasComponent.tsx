import React, { type ReactElement, useEffect, useState } from 'react'

import { useArrayReducer } from '@/shared/hooks/useArrayReducer'
import { AreasService } from '@/users/services/area.service'
import { type Area } from '@/users/models/area.interface'

import { AreaContext } from '../contexts/AreaContext'
import AreasDetail from './AreasDetail'
import AreaForm from './AreaForm'

const AreasComponent = (): ReactElement => {
  const [areas, setAreas, addArea, updateArea] = useArrayReducer<Area>([])

  const [selectedArea, setSelectedArea] = useState<Area | null>(null)
  const [areaForm, setAreaForm] = useState<Area | null>(null)

  useEffect(() => {
    const areasServices = new AreasService()
    void areasServices.findAll()
      .then(setAreas)
  }, [])

  return (
    <AreaContext.Provider value={{
      areas,
      addArea,
      updateArea,
      areaForm,
      selectedArea,
      setAreaForm,
      setSelectedArea
    }}>
      <section className='p-3'>
        <h2 className='text-xl font-bold uppercase '>Áreas</h2>
        <AreasDetail />
      </section>
      <section className='border-t border-solid border-gray-light px-2'>
        <AreaForm/>
      </section>
    </AreaContext.Provider>
  )
}

export default AreasComponent

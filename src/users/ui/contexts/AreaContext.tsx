import React from 'react'
import { type Area } from '@/users/models/area.interface'

interface AreaContextInterface {

  areas: Area[]
  addArea: (area: Area) => void
  updateArea: (area: Area) => void

  selectedArea: Area | null
  setSelectedArea: (area: Area | null) => void

  areaForm: Area | null
  setAreaForm: (areaForm: Area | null) => void
}

export const AreaContext = React.createContext<AreaContextInterface>({
  areas: [],
  addArea: () => { },
  updateArea: () => { },
  selectedArea: null,
  setSelectedArea: () => { },
  areaForm: null,
  setAreaForm: () => { }
})

import React from 'react'
import { type Material } from '@/vehicles/models/material.interface'

interface MaterialContextInterface {
  toastId: string

  materials: Material[]
  addMaterial: (material: Material) => void
  updateMaterial: (material: Material) => void
  removeMaterial: (id: string) => void

  selectedMaterial: Material | null
  setSelectedMaterial: (material: Material | null) => void

  materialForm: Material | null
  setMaterialForm: (materialForm: Material | null) => void
}

export const MaterialContext = React.createContext<MaterialContextInterface>({
  toastId: '',
  materials: [],
  addMaterial: () => { },
  updateMaterial: () => { },
  removeMaterial: () => { },
  selectedMaterial: null,
  setSelectedMaterial: () => { },
  materialForm: null,
  setMaterialForm: () => { }
})

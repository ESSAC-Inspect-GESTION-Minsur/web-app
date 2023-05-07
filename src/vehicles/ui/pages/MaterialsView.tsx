import React, { useState, type ReactElement, useEffect } from 'react'
import { useArrayReducer } from '@/shared/hooks/useArrayReducer'
import { type Material } from '@/vehicles/models/material.interface'
import Divider from '@/shared/ui/components/Divider'
import Toast from '@/shared/ui/components/Toast'
import { MaterialsService } from '@/vehicles/services/materials.service'
import { MaterialContext } from '../contexts/MaterialContext'
import MaterialsTable from '../components/MaterialsTable'
import MaterialForm from '../components/MaterialForm'

const TOAST_ID = 'materials-view'

const MaterialsView = (): ReactElement => {
  const [materials, setMaterials, addMaterial, updateMaterial, removeMaterial] = useArrayReducer<Material>([])

  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [materialForm, setMaterialForm] = useState<Material | null>(null)

  useEffect(() => {
    const materialsService = new MaterialsService()
    void materialsService.findAll()
      .then(setMaterials)
  }, [])

  return (
    <MaterialContext.Provider value={{
      materials,
      addMaterial,
      updateMaterial,
      removeMaterial,
      selectedMaterial,
      setSelectedMaterial,
      materialForm,
      setMaterialForm,
      toastId: TOAST_ID
    }}>
      <section className='flex justify-between items-center'>
        <h1 className='text-blue-era uppercase text-2xl font-semibold'>Tipo de Materiales</h1>
      </section>
      <Divider></Divider>

      <div className='w-[90%] mx-auto'>
        <div className='flex flex-col gap-10 md:flex-row'>
          <div className='order-2 md:order-1 md:w-[65%]'>
            <MaterialsTable />
          </div>
          <aside className='md:w-[35%] md:order-2'>
            <MaterialForm />
          </aside>
        </div>
      </div>

      <Toast id={TOAST_ID} />

    </MaterialContext.Provider>
  )
}

export default MaterialsView
